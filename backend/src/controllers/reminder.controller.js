const reminderService = require('../services/reminder.service');
const Appuntamento = require('../models/appuntamento.model');

// Esegue manualmente il processo di reminder
exports.eseguiReminder = async (req, res) => {
  try {
    const { tipo } = req.body;
    
    let risultato;
    if (tipo && ['24h', '2h', '30m'].includes(tipo)) {
      // Esegue reminder per un tipo specifico
      risultato = await reminderService.eseguiReminder(tipo);
    } else {
      // Esegue tutti i reminder
      risultato = await reminderService.inviaReminder();
    }
    
    res.status(200).json({
      message: tipo ? `Processo reminder ${tipo} completato` : 'Processo reminder completato',
      ...risultato
    });
  } catch (error) {
    console.error('Errore esecuzione reminder:', error);
    res.status(500).json({ 
      message: 'Errore durante l\'esecuzione dei reminder',
      error: error.message 
    });
  }
};

// Configura reminder personalizzati per un appuntamento
exports.configuraReminder = async (req, res) => {
  try {
    const { appuntamentoId } = req.params;
    const { tipiReminder, messaggio } = req.body;

    const appuntamento = await reminderService.configuraReminderPersonalizzato(
      appuntamentoId, 
      tipiReminder, 
      messaggio
    );

    res.status(200).json({
      message: 'Reminder configurato con successo',
      appuntamento
    });
  } catch (error) {
    console.error('Errore configurazione reminder:', error);
    res.status(500).json({ 
      message: 'Errore durante la configurazione del reminder',
      error: error.message 
    });
  }
};

// Test del sistema di reminder per un appuntamento specifico
exports.testReminder = async (req, res) => {
  try {
    const { appuntamentoId } = req.params;
    
    const risultati = await reminderService.testReminder(appuntamentoId);
    
    res.status(200).json({
      message: 'Test reminder completato',
      risultati
    });
  } catch (error) {
    console.error('Errore test reminder:', error);
    res.status(500).json({ 
      message: 'Errore durante il test del reminder',
      error: error.message 
    });
  }
};

// Ottiene lo stato dei reminder per gli appuntamenti
exports.getStatoReminder = async (req, res) => {
  try {
    const { dataInizio, dataFine } = req.query;
    
    let filter = {};
    if (dataInizio && dataFine) {
      filter.dataOraInizio = {
        $gte: new Date(dataInizio),
        $lte: new Date(dataFine)
      };
    }

    const appuntamenti = await Appuntamento.find(filter)
      .populate('cliente', 'nome cognome email telefono')
      .select('dataOraInizio reminderInviato reminderConfig stato cliente')
      .sort({ dataOraInizio: 1 });

    const statistiche = {
      totaleAppuntamenti: appuntamenti.length,
      reminderInviati: appuntamenti.filter(a => a.reminderInviato).length,
      reminderPendenti: appuntamenti.filter(a => !a.reminderInviato && ['prenotato', 'confermato'].includes(a.stato)).length
    };

    res.status(200).json({
      appuntamenti,
      statistiche
    });
  } catch (error) {
    console.error('Errore recupero stato reminder:', error);
    res.status(500).json({ 
      message: 'Errore durante il recupero dello stato dei reminder',
      error: error.message 
    });
  }
};

// Reset del flag reminder per un appuntamento (per re-invio)
exports.resetReminder = async (req, res) => {
  try {
    const { appuntamentoId } = req.params;
    
    const appuntamento = await Appuntamento.findByIdAndUpdate(
      appuntamentoId,
      { reminderInviato: false },
      { new: true }
    );

    if (!appuntamento) {
      return res.status(404).json({ message: 'Appuntamento non trovato' });
    }

    res.status(200).json({
      message: 'Flag reminder resettato con successo',
      appuntamento
    });
  } catch (error) {
    console.error('Errore reset reminder:', error);
    res.status(500).json({ 
      message: 'Errore durante il reset del reminder',
      error: error.message 
    });
  }
};

// Gestione dello scheduler
exports.getSchedulerStatus = async (req, res) => {
  try {
    const schedulerService = require('../services/scheduler.service');
    const status = schedulerService.getStatus();
    
    res.status(200).json({
      message: 'Status scheduler recuperato',
      scheduler: status
    });
  } catch (error) {
    console.error('Errore get scheduler status:', error);
    res.status(500).json({ 
      message: 'Errore durante il recupero dello status scheduler',
      error: error.message 
    });
  }
};

exports.startScheduler = async (req, res) => {
  try {
    const schedulerService = require('../services/scheduler.service');
    schedulerService.start();
    
    res.status(200).json({
      message: 'Scheduler avviato con successo'
    });
  } catch (error) {
    console.error('Errore start scheduler:', error);
    res.status(500).json({ 
      message: 'Errore durante l\'avvio dello scheduler',
      error: error.message 
    });
  }
};

exports.stopScheduler = async (req, res) => {
  try {
    const schedulerService = require('../services/scheduler.service');
    schedulerService.stop();
    
    res.status(200).json({
      message: 'Scheduler fermato con successo'
    });
  } catch (error) {
    console.error('Errore stop scheduler:', error);
    res.status(500).json({ 
      message: 'Errore durante la fermata dello scheduler',
      error: error.message 
    });
  }
};

exports.testScheduler = async (req, res) => {
  try {
    const schedulerService = require('../services/scheduler.service');
    const result = await schedulerService.executeReminderTest();
    
    res.status(200).json({
      message: 'Test scheduler completato',
      result
    });
  } catch (error) {
    console.error('Errore test scheduler:', error);
    res.status(500).json({ 
      message: 'Errore durante il test dello scheduler',
      error: error.message 
    });
  }
};
