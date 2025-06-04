const { validationResult } = require('express-validator');
const ProgrammaFedelta = require('../models/programmaFedelta.model');
const Cliente = require('../models/cliente.model');
const Appuntamento = require('../models/appuntamento.model');
const Pagamento = require('../models/pagamento.model');

class ProgrammaFedeltaController {
  // Ottenere tutti i programmi fedeltà
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, cliente, livello, stato } = req.query;
      
      const query = {};
      if (cliente) query.cliente = cliente;
      if (livello) query.livello = livello;
      if (stato) query.stato = stato;

      const programmi = await ProgrammaFedelta.find(query)
        .populate('cliente', 'nome cognome email telefono')
        .sort({ dataCreazione: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await ProgrammaFedelta.countDocuments(query);

      res.json({
        programmi,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      });
    } catch (error) {
      console.error('Errore nel recupero programmi fedeltà:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }

  // Ottenere un programma fedeltà specifico
  async getById(req, res) {
    try {
      const programma = await ProgrammaFedelta.findById(req.params.id)
        .populate('cliente', 'nome cognome email telefono dataNascita')
        .populate('transazioni.appuntamento', 'data servizi importo')
        .populate('transazioni.pagamento', 'importo data metodo');

      if (!programma) {
        return res.status(404).json({ error: 'Programma fedeltà non trovato' });
      }

      res.json(programma);
    } catch (error) {
      console.error('Errore nel recupero programma fedeltà:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }

  // Ottenere il programma fedeltà di un cliente
  async getByCliente(req, res) {
    try {
      const { clienteId } = req.params;
      
      let programma = await ProgrammaFedelta.findOne({ cliente: clienteId })
        .populate('cliente', 'nome cognome email telefono dataNascita')
        .populate('transazioni.appuntamento', 'data servizi importo')
        .populate('transazioni.pagamento', 'importo data metodo');

      // Se il programma non esiste, crealo
      if (!programma) {
        const cliente = await Cliente.findById(clienteId);
        if (!cliente) {
          return res.status(404).json({ error: 'Cliente non trovato' });
        }

        programma = new ProgrammaFedelta({
          cliente: clienteId,
          punti: 0,
          livello: 'bronze'
        });
        await programma.save();
        
        // Popola il programma appena creato
        programma = await ProgrammaFedelta.findById(programma._id)
          .populate('cliente', 'nome cognome email telefono dataNascita');
      }

      res.json(programma);
    } catch (error) {
      console.error('Errore nel recupero programma fedeltà cliente:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }

  // Creare un nuovo programma fedeltà
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { cliente } = req.body;

      // Verificare che il cliente esista
      const clienteEsistente = await Cliente.findById(cliente);
      if (!clienteEsistente) {
        return res.status(404).json({ error: 'Cliente non trovato' });
      }

      // Verificare che non esista già un programma per questo cliente
      const programmaEsistente = await ProgrammaFedelta.findOne({ cliente });
      if (programmaEsistente) {
        return res.status(400).json({ error: 'Il cliente ha già un programma fedeltà' });
      }

      const nuovoProgramma = new ProgrammaFedelta(req.body);
      await nuovoProgramma.save();

      const programmaCompleto = await ProgrammaFedelta.findById(nuovoProgramma._id)
        .populate('cliente', 'nome cognome email telefono');

      res.status(201).json(programmaCompleto);
    } catch (error) {
      console.error('Errore nella creazione programma fedeltà:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }

  // Aggiornare un programma fedeltà
  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const programma = await ProgrammaFedelta.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('cliente', 'nome cognome email telefono');

      if (!programma) {
        return res.status(404).json({ error: 'Programma fedeltà non trovato' });
      }

      res.json(programma);
    } catch (error) {
      console.error('Errore nell\'aggiornamento programma fedeltà:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }

  // Eliminare un programma fedeltà
  async delete(req, res) {
    try {
      const programma = await ProgrammaFedelta.findByIdAndDelete(req.params.id);
      
      if (!programma) {
        return res.status(404).json({ error: 'Programma fedeltà non trovato' });
      }

      res.json({ message: 'Programma fedeltà eliminato con successo' });
    } catch (error) {
      console.error('Errore nell\'eliminazione programma fedeltà:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }

  // Aggiungere punti
  async aggiungiPunti(req, res) {
    try {
      const { punti, motivo, appuntamento, pagamento } = req.body;
      const { id } = req.params;

      if (!punti || punti <= 0) {
        return res.status(400).json({ error: 'Numero di punti non valido' });
      }

      const programma = await ProgrammaFedelta.findById(id);
      if (!programma) {
        return res.status(404).json({ error: 'Programma fedeltà non trovato' });
      }

      // Aggiungere la transazione
      const nuovaTransazione = {
        tipo: 'guadagno',
        punti: punti,
        motivo: motivo || 'Punti aggiunti manualmente',
        appuntamento,
        pagamento
      };

      programma.transazioni.push(nuovaTransazione);
      programma.punti += punti;
      programma.statistiche.ultimoGuadagno = new Date();

      // Aggiornare il livello se necessario
      this.aggiornaLivello(programma);

      await programma.save();

      const programmaAggiornato = await ProgrammaFedelta.findById(id)
        .populate('cliente', 'nome cognome email telefono');

      res.json(programmaAggiornato);
    } catch (error) {
      console.error('Errore nell\'aggiunta punti:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }

  // Riscattare punti
  async riscattaPunti(req, res) {
    try {
      const { punti, motivo, premio } = req.body;
      const { id } = req.params;

      if (!punti || punti <= 0) {
        return res.status(400).json({ error: 'Numero di punti non valido' });
      }

      const programma = await ProgrammaFedelta.findById(id);
      if (!programma) {
        return res.status(404).json({ error: 'Programma fedeltà non trovato' });
      }

      if (programma.punti < punti) {
        return res.status(400).json({ error: 'Punti insufficienti' });
      }

      // Aggiungere la transazione
      const nuovaTransazione = {
        tipo: 'spesa',
        punti: punti,
        motivo: motivo || 'Riscatto premio',
        premio
      };

      programma.transazioni.push(nuovaTransazione);
      programma.punti -= punti;
      programma.statistiche.ultimoUtilizzo = new Date();

      // Aggiornare il livello se necessario
      this.aggiornaLivello(programma);

      await programma.save();

      const programmaAggiornato = await ProgrammaFedelta.findById(id)
        .populate('cliente', 'nome cognome email telefono');

      res.json(programmaAggiornato);
    } catch (error) {
      console.error('Errore nel riscatto punti:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }

  // Ottenere le statistiche generali del programma fedeltà
  async getStatistiche(req, res) {
    try {
      const statistiche = await ProgrammaFedelta.aggregate([
        {
          $group: {
            _id: null,
            totaleProgrammi: { $sum: 1 },
            totalePuntiDistribuiti: { $sum: '$punti' },
            programmiBronze: { $sum: { $cond: [{ $eq: ['$livello', 'bronze'] }, 1, 0] } },
            programmiSilver: { $sum: { $cond: [{ $eq: ['$livello', 'silver'] }, 1, 0] } },
            programmiGold: { $sum: { $cond: [{ $eq: ['$livello', 'gold'] }, 1, 0] } },
            programmiPlatinum: { $sum: { $cond: [{ $eq: ['$livello', 'platinum'] }, 1, 0] } },
            programmiAttivi: { $sum: { $cond: [{ $eq: ['$attivo', true] }, 1, 0] } },
            programmiInattivi: { $sum: { $cond: [{ $eq: ['$attivo', false] }, 1, 0] } },
            totalePuntiUtilizzati: { $sum: '$puntiUtilizzati' },
            totaleMovimenti: { $sum: { $size: '$movimenti' } }
          }
        }
      ]);

      // Statistiche sui punti medi per livello
      const puntiPerLivello = await ProgrammaFedelta.aggregate([
        {
          $group: {
            _id: '$livello',
            puntiMedi: { $avg: '$punti' },
            count: { $sum: 1 }
          }
        }
      ]);

      // Trasforma i dati nel formato atteso dal frontend
      const stats = statistiche[0] || {};
      const frontendStats = {
        totalPrograms: stats.totaleProgrammi || 0,
        totalMembers: stats.totaleProgrammi || 0, // Per ora usiamo lo stesso valore
        totalRewards: stats.totalePuntiUtilizzati || 0,
        totalPointsIssued: stats.totalePuntiDistribuiti || 0,
        averagePointsPerMember: stats.totaleProgrammi ? Math.round(stats.totalePuntiDistribuiti / stats.totaleProgrammi) : 0,
        monthlyGrowth: 0 // Da implementare se necessario
      };

      res.json(frontendStats);
    } catch (error) {
      console.error('Errore nel recupero statistiche:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }

  // Sincronizzare i punti con gli appuntamenti e pagamenti
  async sincronizzaPunti(req, res) {
    try {
      const { clienteId } = req.params;
      
      let programma = await ProgrammaFedelta.findOne({ cliente: clienteId });
      if (!programma) {
        // Creare il programma se non esiste
        programma = new ProgrammaFedelta({
          cliente: clienteId,
          punti: 0,
          livello: 'bronze'
        });
      }

      // Ottenere tutti i pagamenti del cliente
      const pagamenti = await Pagamento.find({ cliente: clienteId, stato: 'completato' });
      
      // Resettare i punti e le transazioni
      programma.punti = 0;
      programma.transazioni = [];

      // Calcolare i punti basati sui pagamenti (1 punto per ogni euro speso)
      for (const pagamento of pagamenti) {
        const puntiGuadagnati = Math.floor(pagamento.importo);
        if (puntiGuadagnati > 0) {
          programma.transazioni.push({
            tipo: 'guadagno',
            punti: puntiGuadagnati,
            motivo: 'Pagamento completato',
            pagamento: pagamento._id,
            data: pagamento.data
          });
          programma.punti += puntiGuadagnati;
        }
      }

      // Aggiornare le statistiche
      const appuntamenti = await Appuntamento.find({ cliente: clienteId });
      programma.statistiche.totaleAppuntamenti = appuntamenti.length;
      programma.statistiche.totaleSpeso = pagamenti.reduce((sum, p) => sum + p.importo, 0);

      if (pagamenti.length > 0) {
        programma.statistiche.ultimoGuadagno = pagamenti[pagamenti.length - 1].data;
        programma.statistiche.mediaSpesaMensile = programma.statistiche.totaleSpeso / 
          Math.max(1, this.calcolaMesiAttivita(pagamenti[0].data));
      }

      // Aggiornare il livello
      this.aggiornaLivello(programma);

      await programma.save();

      const programmaCompleto = await ProgrammaFedelta.findById(programma._id)
        .populate('cliente', 'nome cognome email telefono');

      res.json(programmaCompleto);
    } catch (error) {
      console.error('Errore nella sincronizzazione punti:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }

  // Metodo helper per aggiornare il livello
  aggiornaLivello(programma) {
    const punti = programma.punti;
    let nuovoLivello = 'bronze';

    if (punti >= 10000) {
      nuovoLivello = 'platinum';
    } else if (punti >= 5000) {
      nuovoLivello = 'gold';
    } else if (punti >= 1000) {
      nuovoLivello = 'silver';
    }

    programma.livello = nuovoLivello;
  }

  // Metodo helper per calcolare i mesi di attività
  calcolaMesiAttivita(dataInizio) {
    const ora = new Date();
    const inizio = new Date(dataInizio);
    const diffTime = Math.abs(ora - inizio);
    const diffMesi = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMesi;
  }
}

module.exports = new ProgrammaFedeltaController();
