const Campagna = require('../models/campagna.model');
const Invio = require('../models/invio.model');
const Cliente = require('../models/cliente.model');
const emailService = require('../services/email.service');
const smsService = require('../services/sms.service');
const { validationResult } = require('express-validator');

// Ottiene tutte le campagne con filtri opzionali
exports.getCampagne = async (req, res) => {
  try {
    const { 
      tipo, 
      stato, 
      page = 1,
      limit = 20
    } = req.query;

    // Costruisce il filtro
    let filter = {};
    
    if (tipo) filter.tipo = tipo;
    if (stato) filter.stato = stato;

    const skip = (page - 1) * limit;
    
    const campagne = await Campagna.find(filter)
      .populate('createdBy', 'nome cognome')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Campagna.countDocuments(filter);

    res.status(200).json({
      campagne,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Errore durante il recupero delle campagne:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle campagne' });
  }
};

// Ottiene una campagna specifica
exports.getCampagnaById = async (req, res) => {
  try {
    const campagna = await Campagna.findById(req.params.id)
      .populate('createdBy', 'nome cognome')
      .populate('clientiTarget', 'nome cognome email telefono');
    
    if (!campagna) {
      return res.status(404).json({ message: 'Campagna non trovata' });
    }
    
    res.status(200).json(campagna);
  } catch (error) {
    console.error('Errore durante il recupero della campagna:', error);
    res.status(500).json({ message: 'Errore durante il recupero della campagna' });
  }
};

// Crea una nuova campagna
exports.createCampagna = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const nuovaCampagna = new Campagna({
      ...req.body,
      createdBy: req.user.userId
    });

    await nuovaCampagna.save();
    
    await nuovaCampagna.populate('createdBy', 'nome cognome');

    res.status(201).json(nuovaCampagna);
  } catch (error) {
    console.error('Errore durante la creazione della campagna:', error);
    res.status(500).json({ message: 'Errore durante la creazione della campagna' });
  }
};

// Aggiorna una campagna
exports.updateCampagna = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const campagna = await Campagna.findById(req.params.id);
    
    if (!campagna) {
      return res.status(404).json({ message: 'Campagna non trovata' });
    }

    // Verifica che solo la stessa persona che ha creato la campagna possa modificarla (o un admin)
    if (req.user.ruolo !== 'admin' && campagna.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Non autorizzato a modificare questa campagna' });
    }

    // Non permettere modifiche se la campagna è in corso o completata
    if (['in_corso', 'completata'].includes(campagna.stato)) {
      return res.status(400).json({ message: 'Impossibile modificare una campagna in corso o completata' });
    }

    const campagnaAggiornata = await Campagna.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'nome cognome');

    res.status(200).json(campagnaAggiornata);
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della campagna:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento della campagna' });
  }
};

// Elimina una campagna
exports.deleteCampagna = async (req, res) => {
  try {
    const campagna = await Campagna.findById(req.params.id);
    
    if (!campagna) {
      return res.status(404).json({ message: 'Campagna non trovata' });
    }

    // Verifica autorizzazioni
    if (req.user.ruolo !== 'admin' && campagna.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Non autorizzato a eliminare questa campagna' });
    }

    // Non permettere eliminazione se la campagna è in corso
    if (campagna.stato === 'in_corso') {
      return res.status(400).json({ message: 'Impossibile eliminare una campagna in corso' });
    }

    await Campagna.findByIdAndDelete(req.params.id);
    
    // Elimina anche tutti gli invii associati
    await Invio.deleteMany({ campagna: req.params.id });

    res.status(200).json({ message: 'Campagna eliminata con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione della campagna:', error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione della campagna' });
  }
};

// Avvia una campagna
exports.avviaCampagna = async (req, res) => {
  try {
    const campagna = await Campagna.findById(req.params.id);
    
    if (!campagna) {
      return res.status(404).json({ message: 'Campagna non trovata' });
    }

    // Verifica autorizzazioni
    if (req.user.ruolo !== 'admin' && campagna.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Non autorizzato ad avviare questa campagna' });
    }

    // Verifica che la campagna sia programmabile
    if (!['bozza', 'programmata'].includes(campagna.stato)) {
      return res.status(400).json({ message: 'Impossibile avviare questa campagna nel suo stato attuale' });
    }

    // Seleziona i clienti target in base ai segmenti
    let clientiTarget = [];
    
    if (campagna.clientiTarget && campagna.clientiTarget.length > 0) {
      clientiTarget = campagna.clientiTarget;
    } else {
      // Applica i criteri di segmentazione
      clientiTarget = await applicaSegmentazione(campagna.segmenti);
    }

    if (clientiTarget.length === 0) {
      return res.status(400).json({ message: 'Nessun cliente target trovato per questa campagna' });
    }

    // Aggiorna lo stato della campagna
    campagna.stato = 'in_corso';
    campagna.clientiTarget = clientiTarget;
    await campagna.save();

    // Ottieni i dati completi dei clienti target
    const clientiCompleti = await Cliente.find({ 
      _id: { $in: clientiTarget } 
    }).select('nome cognome email telefono');

    // Invia la campagna in base al tipo
    let risultatiInvio = { successi: 0, fallimenti: 0, invii: [] };
    
    try {
      if (campagna.tipo === 'email') {
        risultatiInvio = await emailService.inviaEmailCampagna(campagna, clientiCompleti);
      } else if (campagna.tipo === 'sms') {
        risultatiInvio = await smsService.inviaSMSCampagna(campagna, clientiCompleti);
      }

      // Aggiorna le statistiche della campagna
      campagna.statistiche.invii = risultatiInvio.successi + risultatiInvio.fallimenti;
      await campagna.save();

      console.log(`Campagna ${campagna.nome} completata: ${risultatiInvio.successi} successi, ${risultatiInvio.fallimenti} fallimenti`);

      res.status(200).json({ 
        message: 'Campagna avviata con successo',
        destinatari: clientiTarget.length,
        risultati: {
          successi: risultatiInvio.successi,
          fallimenti: risultatiInvio.fallimenti
        }
      });
    } catch (serviceError) {
      console.error('Errore servizio di invio:', serviceError);
      
      // Aggiorna lo stato della campagna in caso di errore
      campagna.stato = 'sospesa';
      await campagna.save();
      
      res.status(500).json({ 
        message: 'Errore durante l\'invio della campagna',
        error: serviceError.message 
      });
    }
  } catch (error) {
    console.error('Errore durante l\'avvio della campagna:', error);
    res.status(500).json({ message: 'Errore durante l\'avvio della campagna' });
  }
};

// Sospende una campagna
exports.sospendiCampagna = async (req, res) => {
  try {
    const campagna = await Campagna.findById(req.params.id);
    
    if (!campagna) {
      return res.status(404).json({ message: 'Campagna non trovata' });
    }

    // Verifica autorizzazioni
    if (req.user.ruolo !== 'admin' && campagna.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Non autorizzato a sospendere questa campagna' });
    }

    if (campagna.stato !== 'in_corso') {
      return res.status(400).json({ message: 'Può essere sospesa solo una campagna in corso' });
    }

    campagna.stato = 'sospesa';
    await campagna.save();

    // Sospendi gli invii in coda
    await Invio.updateMany(
      { campagna: req.params.id, stato: 'in_coda' },
      { stato: 'sospeso' }
    );

    res.status(200).json({ message: 'Campagna sospesa con successo' });
  } catch (error) {
    console.error('Errore durante la sospensione della campagna:', error);
    res.status(500).json({ message: 'Errore durante la sospensione della campagna' });
  }
};

// Ottiene le statistiche di una campagna
exports.getStatisticheCampagna = async (req, res) => {
  try {
    const campagna = await Campagna.findById(req.params.id);
    
    if (!campagna) {
      return res.status(404).json({ message: 'Campagna non trovata' });
    }

    // Conta gli invii per stato
    const invii = await Invio.aggregate([
      { $match: { campagna: campagna._id } },
      { $group: { 
          _id: '$stato', 
          count: { $sum: 1 } 
        } 
      }
    ]);

    // Statistiche avanzate
    const aperture = await Invio.countDocuments({ 
      campagna: campagna._id, 
      dataApertura: { $exists: true } 
    });
    
    const click = await Invio.countDocuments({ 
      campagna: campagna._id, 
      dataClick: { $exists: true } 
    });

    const statistiche = {
      ...campagna.statistiche,
      inviiPerStato: invii.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      tassoApertura: campagna.statistiche.invii > 0 ? 
        ((aperture / campagna.statistiche.invii) * 100).toFixed(2) : 0,
      tassoClick: aperture > 0 ? 
        ((click / aperture) * 100).toFixed(2) : 0
    };

    res.status(200).json(statistiche);
  } catch (error) {
    console.error('Errore durante il recupero delle statistiche:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle statistiche' });
  }
};

// Testare una campagna (invio di prova)
exports.testCampagna = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { emailTest } = req.body;
    const campagna = await Campagna.findById(req.params.id);
    
    if (!campagna) {
      return res.status(404).json({ error: 'Campagna non trovata' });
    }

    // Invia l'email di test usando il servizio email
    try {
      await emailService.inviaEmailTest(campagna, emailTest);
      
      res.json({ 
        message: 'Test campagna inviato con successo',
        emailTest,
        campagna: campagna.nome
      });
    } catch (emailError) {
      console.error('Errore invio email di test:', emailError);
      res.status(500).json({ 
        error: 'Errore durante l\'invio dell\'email di test',
        details: emailError.message
      });
    }
  } catch (error) {
    console.error('Errore nel test campagna:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

// Duplicare una campagna
exports.duplicaCampagna = async (req, res) => {
  try {
    const campagnaOriginale = await Campagna.findById(req.params.id);
    
    if (!campagnaOriginale) {
      return res.status(404).json({ error: 'Campagna non trovata' });
    }

    // Creare una copia della campagna
    const campagnaDuplicata = new Campagna({
      nome: `${campagnaOriginale.nome} - Copia`,
      descrizione: campagnaOriginale.descrizione,
      tipo: campagnaOriginale.tipo,
      stato: 'bozza',
      contenuto: campagnaOriginale.contenuto,
      segmentazione: campagnaOriginale.segmentazione,
      // Non copiare la programmazione e le statistiche
      programmazione: {
        tipo: 'immediata'
      },
      statistiche: {
        invii: 0,
        aperture: 0,
        click: 0,
        risposte: 0,
        conversioni: 0
      }
    });

    await campagnaDuplicata.save();

    res.status(201).json(campagnaDuplicata);
  } catch (error) {
    console.error('Errore nella duplicazione campagna:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

// Ottenere le statistiche generali delle campagne
exports.getStatistiche = async (req, res) => {
  try {
    const statistiche = await Campagna.aggregate([
      {
        $group: {
          _id: null,
          totaleCampagne: { $sum: 1 },
          campagneAttive: { $sum: { $cond: [{ $eq: ['$stato', 'in_corso'] }, 1, 0] } },
          campagneCompletate: { $sum: { $cond: [{ $eq: ['$stato', 'completata'] }, 1, 0] } },
          campagneSospese: { $sum: { $cond: [{ $eq: ['$stato', 'sospesa'] }, 1, 0] } },
          totaleInvii: { $sum: '$statistiche.invii' },
          totaleAperture: { $sum: '$statistiche.aperture' },
          totaleClick: { $sum: '$statistiche.click' }
        }
      }
    ]);

    // Statistiche per tipo di campagna
    const statistichePerTipo = await Campagna.aggregate([
      {
        $group: {
          _id: '$tipo',
          count: { $sum: 1 },
          inviiTotali: { $sum: '$statistiche.invii' },
          apertureTotali: { $sum: '$statistiche.aperture' }
        }
      }
    ]);

    res.json({
      generale: statistiche[0] || {},
      perTipo: statistichePerTipo
    });
  } catch (error) {
    console.error('Errore nel recupero statistiche campagne:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

// Ottenere i clienti target di una campagna
exports.getClientiTarget = async (req, res) => {
  try {
    const campagna = await Campagna.findById(req.params.id);
    
    if (!campagna) {
      return res.status(404).json({ error: 'Campagna non trovata' });
    }

    let clientiTarget = [];

    if (campagna.clientiTarget && campagna.clientiTarget.length > 0) {
      // Clienti specificati manualmente
      clientiTarget = await Cliente.find({ 
        _id: { $in: campagna.clientiTarget } 
      }).select('nome cognome email telefono dataNascita');
    } else if (campagna.segmentazione) {
      // Applica la segmentazione per trovare i clienti
      const clientiIds = await this.applicaSegmentazioneClienti(campagna.segmentazione);
      clientiTarget = await Cliente.find({ 
        _id: { $in: clientiIds } 
      }).select('nome cognome email telefono dataNascita');
    }

    res.json({
      clienti: clientiTarget,
      totale: clientiTarget.length
    });
  } catch (error) {
    console.error('Errore nel recupero clienti target:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

// Helper method per applicare la segmentazione
exports.applicaSegmentazioneClienti = async (segmentazione) => {
  let clienti = [];
  const tipo = segmentazione.tipo;
  
  switch (tipo) {
    case 'tutti':
      const tuttiClienti = await Cliente.find().select('_id');
      clienti = tuttiClienti.map(c => c._id);
      break;
      
    case 'nuovi_clienti':
      const unMeseFa = new Date();
      unMeseFa.setDate(unMeseFa.getDate() - 30);
      const nuoviClienti = await Cliente.find({ 
        createdAt: { $gte: unMeseFa } 
      }).select('_id');
      clienti = nuoviClienti.map(c => c._id);
      break;
      
    case 'clienti_fedeli':
      // Clienti con almeno 5 appuntamenti
      const Appuntamento = require('../models/appuntamento.model');
      const clientiFedeli = await Appuntamento.aggregate([
        { $group: { _id: '$cliente', count: { $sum: 1 } } },
        { $match: { count: { $gte: 5 } } }
      ]);
      clienti = clientiFedeli.map(c => c._id);
      break;
      
    case 'inattivi':
      const dueMesiFa = new Date();
      dueMesiFa.setDate(dueMesiFa.getDate() - 60);
      const AppuntamentoModel = require('../models/appuntamento.model');
      
      // Trova clienti senza appuntamenti negli ultimi 60 giorni
      const clientiConAppuntamentiRecenti = await AppuntamentoModel.distinct('cliente', {
        data: { $gte: dueMesiFa }
      });
      
      const clientiInattivi = await Cliente.find({
        _id: { $nin: clientiConAppuntamentiRecenti }
      }).select('_id');
      
      clienti = clientiInattivi.map(c => c._id);
      break;
      
    case 'compleanni':
      const oggi = new Date();
      const giornoOggi = oggi.getDate();
      const meseOggi = oggi.getMonth() + 1;
      
      const clientiCompleanno = await Cliente.find({
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: '$dataNascita' }, giornoOggi] },
            { $eq: [{ $month: '$dataNascita' }, meseOggi] }
          ]
        }
      }).select('_id');
      
      clienti = clientiCompleanno.map(c => c._id);
      break;
      
    case 'personalizzato':
      if (segmentazione.criteri) {
        const clientiPersonalizzati = await Cliente.find(segmentazione.criteri).select('_id');
        clienti = clientiPersonalizzati.map(c => c._id);
      }
      break;
  }
  
  return clienti;
};

// Funzione helper per applicare la segmentazione
async function applicaSegmentazione(segmenti) {
  let clienti = [];
  
  for (const segmento of segmenti) {
    let query = {};
    
    switch (segmento.tipo) {
      case 'tutti':
        query = {};
        break;
        
      case 'nuovi_clienti':
        // Clienti registrati negli ultimi 30 giorni
        const unMeseFa = new Date();
        unMeseFa.setDate(unMeseFa.getDate() - 30);
        query = { createdAt: { $gte: unMeseFa } };
        break;
        
      case 'clienti_inattivi':
        // Clienti che non hanno appuntamenti negli ultimi 60 giorni
        // TODO: Implementare con lookup sugli appuntamenti
        break;
        
      case 'compleanno':
        // Clienti che compiono gli anni oggi o nei prossimi giorni
        const oggi = new Date();
        const giornoOggi = oggi.getDate();
        const meseOggi = oggi.getMonth() + 1;
        
        query = {
          $expr: {
            $and: [
              { $eq: [{ $dayOfMonth: '$dataNascita' }, giornoOggi] },
              { $eq: [{ $month: '$dataNascita' }, meseOggi] }
            ]
          }
        };
        break;
        
      case 'custom':
        if (segmento.criteri) {
          query = segmento.criteri;
        }
        break;
    }
    
    const clientiSegmento = await Cliente.find(query).select('_id');
    clienti = clienti.concat(clientiSegmento.map(c => c._id));
  }
  
  // Rimuovi duplicati
  return [...new Set(clienti.map(c => c.toString()))];
}
