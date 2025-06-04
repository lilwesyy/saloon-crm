const Appuntamento = require('../models/appuntamento.model');
const Cliente = require('../models/cliente.model');
const Servizio = require('../models/servizio.model');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');
const emailService = require('../services/email.service');

// Ottiene gli operatori disponibili per la prenotazione online (pubblico)
exports.getOperatoriDisponibili = async (req, res) => {
  try {
    const operatori = await User.find({ 
      ruolo: 'operatore', 
      attivo: true 
    }).select('_id nome cognome');
    
    res.status(200).json(operatori);
  } catch (error) {
    console.error('Errore recupero operatori:', error);
    res.status(500).json({ 
      message: 'Errore durante il recupero degli operatori',
      error: error.message 
    });
  }
};

// Ottiene le disponibilità per la prenotazione online
exports.getDisponibilita = async (req, res) => {
  try {
    const { data, servizioId, operatoreId } = req.query;
    
    if (!data || !servizioId) {
      return res.status(400).json({ 
        message: 'Data e servizio sono obbligatori' 
      });
    }

    const servizio = await Servizio.findById(servizioId);
    if (!servizio) {
      return res.status(404).json({ message: 'Servizio non trovato' });
    }

    const dataRichiesta = new Date(data);
    const inizioGiorno = new Date(dataRichiesta);
    inizioGiorno.setHours(9, 0, 0, 0); // Apertura alle 9:00
    const fineGiorno = new Date(dataRichiesta);
    fineGiorno.setHours(19, 0, 0, 0); // Chiusura alle 19:00

    // Trova operatori disponibili
    let operatoriQuery = { ruolo: 'operatore', attivo: true };
    if (operatoreId) {
      operatoriQuery._id = operatoreId;
    }
    
    const operatori = await User.find(operatoriQuery);
    
    const disponibilita = [];
    
    for (const operatore of operatori) {
      // Trova appuntamenti esistenti per l'operatore
      const appuntamentiEsistenti = await Appuntamento.find({
        operatore: operatore._id,
        dataOraInizio: { $gte: inizioGiorno, $lte: fineGiorno },
        stato: { $in: ['prenotato', 'confermato'] }
      }).sort({ dataOraInizio: 1 });

      // Calcola slot disponibili (ogni 30 minuti)
      const slotsDisponibili = [];
      let orarioCorrente = new Date(inizioGiorno);
      
      while (orarioCorrente < fineGiorno) {
        const fineSlot = new Date(orarioCorrente.getTime() + (servizio.durata * 60000));
        
        // Verifica se lo slot è libero
        const conflitto = appuntamentiEsistenti.find(app => {
          return (orarioCorrente < app.dataOraFine && fineSlot > app.dataOraInizio);
        });
        
        if (!conflitto && fineSlot <= fineGiorno) {
          slotsDisponibili.push({
            inizio: new Date(orarioCorrente),
            fine: new Date(fineSlot),
            operatore: {
              id: operatore._id,
              nome: operatore.nome,
              cognome: operatore.cognome
            }
          });
        }
        
        orarioCorrente.setMinutes(orarioCorrente.getMinutes() + 30);
      }
      
      if (slotsDisponibili.length > 0) {
        disponibilita.push(...slotsDisponibili);
      }
    }

    res.status(200).json({
      data: dataRichiesta.toISOString().split('T')[0],
      servizio: {
        id: servizio._id,
        nome: servizio.nome,
        durata: servizio.durata,
        prezzo: servizio.prezzo
      },
      slotsDisponibili: disponibilita.sort((a, b) => a.inizio - b.inizio)
    });

  } catch (error) {
    console.error('Errore recupero disponibilità:', error);
    res.status(500).json({ 
      message: 'Errore durante il recupero delle disponibilità',
      error: error.message 
    });
  }
};

// Crea prenotazione online
exports.creaPrenotazioneOnline = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      cliente: datiCliente,
      servizioId,
      operatoreId,
      dataOraInizio,
      note,
      consensoPrivacy,
      consensoMarketing
    } = req.body;

    if (!consensoPrivacy) {
      return res.status(400).json({ 
        message: 'Il consenso alla privacy è obbligatorio' 
      });
    }

    // Trova o crea il cliente
    let cliente = await Cliente.findOne({ 
      email: datiCliente.email 
    });

    if (!cliente) {
      cliente = new Cliente({
        ...datiCliente,
        consensoPrivacy: true,
        consensoMarketing: consensoMarketing || false,
        dataConsenso: new Date(),
        fonte: 'prenotazione_online'
      });
      await cliente.save();
    } else {
      // Aggiorna i dati se necessario
      Object.assign(cliente, datiCliente);
      if (consensoMarketing !== undefined) {
        cliente.consensoMarketing = consensoMarketing;
      }
      await cliente.save();
    }

    // Verifica servizio e operatore
    const servizio = await Servizio.findById(servizioId);
    if (!servizio) {
      return res.status(404).json({ message: 'Servizio non trovato' });
    }

    const operatore = await User.findById(operatoreId);
    if (!operatore) {
      return res.status(404).json({ message: 'Operatore non trovato' });
    }

    const dataInizio = new Date(dataOraInizio);
    const dataFine = new Date(dataInizio.getTime() + (servizio.durata * 60000));

    // Verifica disponibilità
    const conflitti = await Appuntamento.find({
      operatore: operatoreId,
      stato: { $in: ['prenotato', 'confermato'] },
      $or: [
        {
          dataOraInizio: { $lt: dataFine },
          dataOraFine: { $gt: dataInizio }
        }
      ]
    });

    if (conflitti.length > 0) {
      return res.status(409).json({ 
        message: 'Orario non più disponibile. Scegli un altro slot.' 
      });
    }

    // Crea l'appuntamento
    const nuovoAppuntamento = new Appuntamento({
      cliente: cliente._id,
      servizi: [{
        servizio: servizio._id,
        prezzo: servizio.prezzo
      }],
      operatore: operatore._id,
      dataOraInizio: dataInizio,
      dataOraFine: dataFine,
      stato: 'prenotato',
      note: note || '',
      fonte: 'prenotazione_online'
    });

    await nuovoAppuntamento.save();

    // Popola i dati per la risposta
    await nuovoAppuntamento.populate([
      { path: 'cliente', select: 'nome cognome email telefono' },
      { path: 'operatore', select: 'nome cognome' },
      { path: 'servizi.servizio', select: 'nome durata prezzo' }
    ]);

    // Genera token per conferma/cancellazione
    const token = Buffer.from(nuovoAppuntamento._id + cliente.email).toString('base64');

    // Invia email di conferma
    try {
      await emailService.inviaConfermaPrenotazione(nuovoAppuntamento, token);
    } catch (emailError) {
      console.error('Errore invio email conferma:', emailError);
      // Non bloccare la prenotazione se l'email fallisce
    }

    res.status(201).json({
      message: 'Prenotazione creata con successo',
      appuntamento: nuovoAppuntamento,
      numeroPrenotazione: nuovoAppuntamento._id
    });

  } catch (error) {
    console.error('Errore creazione prenotazione online:', error);
    res.status(500).json({ 
      message: 'Errore durante la creazione della prenotazione',
      error: error.message 
    });
  }
};

// Conferma prenotazione online
exports.confermaPrenotazione = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    const appuntamento = await Appuntamento.findById(id)
      .populate('cliente', 'nome cognome email')
      .populate('operatore', 'nome cognome')
      .populate('servizi.servizio', 'nome');

    if (!appuntamento) {
      return res.status(404).json({ message: 'Prenotazione non trovata' });
    }

    // Verifica token (implementazione semplificata)
    const expectedToken = Buffer.from(id + appuntamento.cliente.email).toString('base64');
    if (token !== expectedToken) {
      return res.status(401).json({ message: 'Token non valido' });
    }

    if (appuntamento.stato !== 'prenotato') {
      return res.status(400).json({ message: 'Prenotazione già confermata o cancellata' });
    }

    appuntamento.stato = 'confermato';
    await appuntamento.save();

    // Invia email di conferma avvenuta
    try {
      await emailService.inviaPrenotazioneConfermata(appuntamento);
    } catch (emailError) {
      console.error('Errore invio email conferma avvenuta:', emailError);
    }

    res.status(200).json({
      message: 'Prenotazione confermata con successo',
      appuntamento
    });

  } catch (error) {
    console.error('Errore conferma prenotazione:', error);
    res.status(500).json({ 
      message: 'Errore durante la conferma della prenotazione',
      error: error.message 
    });
  }
};

// Cancella prenotazione online
exports.cancellaPrenotazione = async (req, res) => {
  try {
    const { id } = req.params;
    const { token, motivoCancellazione } = req.body;

    const appuntamento = await Appuntamento.findById(id)
      .populate('cliente', 'nome cognome email')
      .populate('operatore', 'nome cognome')
      .populate('servizi.servizio', 'nome');

    if (!appuntamento) {
      return res.status(404).json({ message: 'Prenotazione non trovata' });
    }

    // Verifica token
    const expectedToken = Buffer.from(id + appuntamento.cliente.email).toString('base64');
    if (token !== expectedToken) {
      return res.status(401).json({ message: 'Token non valido' });
    }

    // Verifica se la cancellazione è consentita (almeno 2 ore prima)
    const oraCorrente = new Date();
    const oreLimite = new Date(appuntamento.dataOraInizio.getTime() - (2 * 60 * 60 * 1000));
    
    if (oraCorrente > oreLimite) {
      return res.status(400).json({ 
        message: 'Non è possibile cancellare la prenotazione. Contatta direttamente il centro.' 
      });
    }

    if (appuntamento.stato === 'cancellato') {
      return res.status(400).json({ message: 'Prenotazione già cancellata' });
    }

    appuntamento.stato = 'cancellato';
    appuntamento.motivoCancellazione = motivoCancellazione || 'Cancellazione cliente';
    await appuntamento.save();

    // Invia email di cancellazione
    try {
      await emailService.inviaPrenotazioneCancellata(appuntamento, motivoCancellazione);
    } catch (emailError) {
      console.error('Errore invio email cancellazione:', emailError);
    }

    res.status(200).json({
      message: 'Prenotazione cancellata con successo',
      appuntamento
    });

  } catch (error) {
    console.error('Errore cancellazione prenotazione:', error);
    res.status(500).json({ 
      message: 'Errore durante la cancellazione della prenotazione',
      error: error.message 
    });
  }
};

// Ottiene i servizi disponibili per la prenotazione online
exports.getServiziDisponibili = async (req, res) => {
  try {
    const servizi = await Servizio.find({ 
      attivo: true,
      prenotabileOnline: true 
    }).select('nome descrizione durata prezzo categoria');

    const serviziRaggruppati = servizi.reduce((acc, servizio) => {
      const categoria = servizio.categoria || 'Altri';
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(servizio);
      return acc;
    }, {});

    res.status(200).json({
      servizi: serviziRaggruppati,
      totale: servizi.length
    });

  } catch (error) {
    console.error('Errore recupero servizi:', error);
    res.status(500).json({ 
      message: 'Errore durante il recupero dei servizi',
      error: error.message 
    });
  }
};
