const salaService = require('../services/sala.service');
const { validationResult } = require('express-validator');

// Ottiene tutte le sale disponibili
exports.getSale = async (req, res) => {
  try {
    const sale = salaService.getSaleDisponibili();
    
    res.status(200).json({
      message: 'Sale recuperate con successo',
      sale
    });
  } catch (error) {
    console.error('Errore recupero sale:', error);
    res.status(500).json({ 
      message: 'Errore durante il recupero delle sale',
      error: error.message 
    });
  }
};

// Ottiene una sala specifica
exports.getSalaById = async (req, res) => {
  try {
    const { salaId } = req.params;
    const sala = salaService.getSalaById(salaId);
    
    if (!sala) {
      return res.status(404).json({ message: 'Sala non trovata' });
    }
    
    res.status(200).json({
      message: 'Sala recuperata con successo',
      sala
    });
  } catch (error) {
    console.error('Errore recupero sala:', error);
    res.status(500).json({ 
      message: 'Errore durante il recupero della sala',
      error: error.message 
    });
  }
};

// Verifica disponibilità di una sala
exports.verificaDisponibilita = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { salaId } = req.params;
    const { dataInizio, dataFine, appuntamentoEscluso } = req.body;
    
    const disponibile = await salaService.verificaDisponibilitaSala(
      salaId, 
      dataInizio, 
      dataFine, 
      appuntamentoEscluso
    );
    
    res.status(200).json({
      message: 'Verifica disponibilità completata',
      disponibile,
      sala: salaService.getSalaById(salaId)
    });
  } catch (error) {
    console.error('Errore verifica disponibilità:', error);
    res.status(500).json({ 
      message: 'Errore durante la verifica della disponibilità',
      error: error.message 
    });
  }
};

// Trova sale disponibili per un periodo
exports.getSaleDisponibili = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { dataInizio, dataFine, tipoServizio } = req.query;
    
    const saleDisponibili = await salaService.getSaleDisponibiliPerPeriodo(
      new Date(dataInizio),
      new Date(dataFine),
      tipoServizio
    );
    
    res.status(200).json({
      message: 'Sale disponibili recuperate con successo',
      saleDisponibili,
      periodo: { dataInizio, dataFine },
      tipoServizio
    });
  } catch (error) {
    console.error('Errore ricerca sale disponibili:', error);
    res.status(500).json({ 
      message: 'Errore durante la ricerca delle sale disponibili',
      error: error.message 
    });
  }
};

// Suggerisce la sala migliore per un servizio
exports.suggerisciSala = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tipoServizio, dataInizio, dataFine, clientePremium } = req.body;
    
    const salaSuggerita = await salaService.suggerisciSala(
      tipoServizio,
      new Date(dataInizio),
      new Date(dataFine),
      clientePremium === true
    );
    
    if (!salaSuggerita) {
      return res.status(404).json({
        message: 'Nessuna sala disponibile per il periodo richiesto'
      });
    }
    
    res.status(200).json({
      message: 'Suggerimento sala generato con successo',
      salaSuggerita,
      criteri: { tipoServizio, clientePremium }
    });
  } catch (error) {
    console.error('Errore suggerimento sala:', error);
    res.status(500).json({ 
      message: 'Errore durante il suggerimento della sala',
      error: error.message 
    });
  }
};

// Ottiene il planning settimanale delle sale
exports.getPlanningSettimanale = async (req, res) => {
  try {
    const { data } = req.query;
    const dataInizio = data ? new Date(data) : new Date();
    
    // Imposta all'inizio della settimana (lunedì)
    const giornoSettimana = dataInizio.getDay();
    const lunedi = new Date(dataInizio);
    lunedi.setDate(dataInizio.getDate() - (giornoSettimana === 0 ? 6 : giornoSettimana - 1));
    lunedi.setHours(0, 0, 0, 0);
    
    const planning = await salaService.getPlanningSettimanale(lunedi);
    
    res.status(200).json({
      message: 'Planning settimanale recuperato con successo',
      planning,
      settimanaInizio: lunedi.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Errore recupero planning:', error);
    res.status(500).json({ 
      message: 'Errore durante il recupero del planning',
      error: error.message 
    });
  }
};

// Ottiene statistiche di utilizzo delle sale
exports.getStatistiche = async (req, res) => {
  try {
    const { dataInizio, dataFine } = req.query;
    
    // Default: ultimo mese se non specificato
    const fine = dataFine ? new Date(dataFine) : new Date();
    const inizio = dataInizio ? new Date(dataInizio) : new Date(fine.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const statistiche = await salaService.getStatisticheSale(inizio, fine);
    
    res.status(200).json({
      message: 'Statistiche sale recuperate con successo',
      statistiche,
      periodo: { 
        dataInizio: inizio.toISOString().split('T')[0], 
        dataFine: fine.toISOString().split('T')[0] 
      }
    });
  } catch (error) {
    console.error('Errore recupero statistiche:', error);
    res.status(500).json({ 
      message: 'Errore durante il recupero delle statistiche',
      error: error.message 
    });
  }
};

// Ottiene suggerimenti per ottimizzazione
exports.getSuggerimentiOttimizzazione = async (req, res) => {
  try {
    const { dataInizio, dataFine } = req.query;
    
    // Default: ultimo mese se non specificato
    const fine = dataFine ? new Date(dataFine) : new Date();
    const inizio = dataInizio ? new Date(dataInizio) : new Date(fine.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const suggerimenti = await salaService.getSuggerimentiOttimizzazione(inizio, fine);
    
    res.status(200).json({
      message: 'Suggerimenti ottimizzazione generati con successo',
      suggerimenti,
      periodo: { 
        dataInizio: inizio.toISOString().split('T')[0], 
        dataFine: fine.toISOString().split('T')[0] 
      }
    });
  } catch (error) {
    console.error('Errore generazione suggerimenti:', error);
    res.status(500).json({ 
      message: 'Errore durante la generazione dei suggerimenti',
      error: error.message 
    });
  }
};

// Prenota una sala per un appuntamento
exports.prenotaSala = async (req, res) => {
  try {
    const { salaId } = req.params;
    const { appuntamentoId, dataInizio, dataFine, note } = req.body;
    
    const sala = salaService.getSalaById(salaId);
    if (!sala) {
      return res.status(404).json({ message: 'Sala non trovata' });
    }

    // Verifica disponibilità
    const disponibile = await salaService.verificaDisponibilitaSala(
      salaId, 
      dataInizio, 
      dataFine
    );

    if (!disponibile) {
      return res.status(409).json({ 
        message: 'Sala non disponibile per il periodo richiesto' 
      });
    }

    // In un'implementazione reale, qui aggiorneresti il database
    // dell'appuntamento con l'ID della sala
    
    res.status(200).json({
      message: 'Sala prenotata con successo',
      prenotazione: {
        salaId,
        sala: sala.nome,
        appuntamentoId,
        dataInizio,
        dataFine,
        note
      }
    });
  } catch (error) {
    console.error('Errore prenotazione sala:', error);
    res.status(500).json({ 
      message: 'Errore durante la prenotazione della sala',
      error: error.message 
    });
  }
};

// Libera una sala da un appuntamento
exports.liberaSala = async (req, res) => {
  try {
    const { salaId, appuntamentoId } = req.params;
    
    const sala = salaService.getSalaById(salaId);
    if (!sala) {
      return res.status(404).json({ message: 'Sala non trovata' });
    }

    // In un'implementazione reale, qui rimuoveresti l'assegnazione
    // della sala dall'appuntamento nel database
    
    res.status(200).json({
      message: 'Sala liberata con successo',
      salaId,
      appuntamentoId
    });
  } catch (error) {
    console.error('Errore liberazione sala:', error);
    res.status(500).json({ 
      message: 'Errore durante la liberazione della sala',
      error: error.message 
    });
  }
};

// Ottieni tutti gli appuntamenti di una sala
exports.ottieniAppuntamentiSala = async (req, res) => {
  try {
    const { salaId } = req.params;
    const { dataInizio, dataFine } = req.query;
    
    const sala = salaService.getSalaById(salaId);
    if (!sala) {
      return res.status(404).json({ message: 'Sala non trovata' });
    }

    // Default: prossimi 30 giorni se non specificato
    const fine = dataFine ? new Date(dataFine) : new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
    const inizio = dataInizio ? new Date(dataInizio) : new Date();

    // Query per gli appuntamenti della sala
    const Appuntamento = require('../models/appuntamento.model');
    const appuntamenti = await Appuntamento.find({
      sala: salaId,
      dataOraInizio: { $gte: inizio, $lte: fine },
      stato: { $in: ['prenotato', 'confermato', 'completato'] }
    })
    .populate('cliente', 'nome cognome telefono')
    .populate('operatore', 'nome cognome')
    .populate('servizi.servizio', 'nome durata prezzo')
    .sort({ dataOraInizio: 1 });
    
    res.status(200).json({
      message: 'Appuntamenti sala recuperati con successo',
      sala: {
        id: sala.id,
        nome: sala.nome,
        descrizione: sala.descrizione
      },
      appuntamenti,
      periodo: { 
        dataInizio: inizio.toISOString().split('T')[0], 
        dataFine: fine.toISOString().split('T')[0] 
      },
      totale: appuntamenti.length
    });
  } catch (error) {
    console.error('Errore recupero appuntamenti sala:', error);
    res.status(500).json({ 
      message: 'Errore durante il recupero degli appuntamenti',
      error: error.message 
    });
  }
};

// Rileva conflitti potenziali nella prenotazione delle sale
exports.rilevaConflitti = async (req, res) => {
  try {
    const { appuntamenti } = req.body; // Array di appuntamenti da verificare
    
    if (!appuntamenti || !Array.isArray(appuntamenti)) {
      return res.status(400).json({ 
        message: 'Array di appuntamenti richiesto' 
      });
    }

    const conflitti = [];
    
    for (let i = 0; i < appuntamenti.length; i++) {
      const app1 = appuntamenti[i];
      
      // Verifica che la sala esista
      const sala = salaService.getSalaById(app1.salaId);
      if (!sala) {
        conflitti.push({
          tipo: 'sala_inesistente',
          appuntamento: app1,
          messaggio: `Sala ${app1.salaId} non trovata`
        });
        continue;
      }

      // Verifica disponibilità con database
      const disponibile = await salaService.verificaDisponibilitaSala(
        app1.salaId,
        app1.dataInizio,
        app1.dataFine,
        app1.appuntamentoId
      );

      if (!disponibile) {
        conflitti.push({
          tipo: 'sala_occupata',
          appuntamento: app1,
          sala: sala.nome,
          messaggio: `Sala ${sala.nome} non disponibile per il periodo ${app1.dataInizio} - ${app1.dataFine}`
        });
      }

      // Verifica conflitti tra appuntamenti nella richiesta
      for (let j = i + 1; j < appuntamenti.length; j++) {
        const app2 = appuntamenti[j];
        
        if (app1.salaId === app2.salaId) {
          const inizio1 = new Date(app1.dataInizio);
          const fine1 = new Date(app1.dataFine);
          const inizio2 = new Date(app2.dataInizio);
          const fine2 = new Date(app2.dataFine);
          
          // Verifica sovrapposizione
          if (inizio1 < fine2 && inizio2 < fine1) {
            conflitti.push({
              tipo: 'conflitto_interno',
              appuntamento1: app1,
              appuntamento2: app2,
              sala: sala.nome,
              messaggio: `Conflitto tra appuntamenti nella stessa sala ${sala.nome}`
            });
          }
        }
      }
    }
    
    res.status(200).json({
      message: 'Analisi conflitti completata',
      conflittiTrovati: conflitti.length,
      conflitti,
      validazione: conflitti.length === 0 ? 'successo' : 'conflitti_rilevati'
    });
  } catch (error) {
    console.error('Errore rilevazione conflitti:', error);
    res.status(500).json({ 
      message: 'Errore durante la rilevazione dei conflitti',
      error: error.message 
    });
  }
};
