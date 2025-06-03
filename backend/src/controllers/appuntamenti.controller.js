const Appuntamento = require('../models/appuntamento.model');
const { validationResult } = require('express-validator');

// Ottiene tutti gli appuntamenti con filtri opzionali
exports.getAppuntamenti = async (req, res) => {
  try {
    const { 
      data, 
      dataInizio, 
      dataFine, 
      stato, 
      cliente, 
      operatore,
      page = 1,
      limit = 50
    } = req.query;

    // Costruisce il filtro
    let filter = {};
    
    if (data) {
      const startOfDay = new Date(data);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(data);
      endOfDay.setHours(23, 59, 59, 999);
      filter.dataOraInizio = { $gte: startOfDay, $lte: endOfDay };
    } else if (dataInizio || dataFine) {
      filter.dataOraInizio = {};
      if (dataInizio) filter.dataOraInizio.$gte = new Date(dataInizio);
      if (dataFine) filter.dataOraInizio.$lte = new Date(dataFine);
    }
    
    if (stato) filter.stato = stato;
    if (cliente) filter.cliente = cliente;
    if (operatore) filter.operatore = operatore;

    const skip = (page - 1) * limit;
    
    const appuntamenti = await Appuntamento.find(filter)
      .populate('cliente', 'nome cognome email telefono')
      .populate('operatore', 'nome cognome')
      .populate('servizi.servizio', 'nome durata prezzo')
      .sort({ dataOraInizio: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appuntamento.countDocuments(filter);

    res.status(200).json({
      appuntamenti,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Errore durante il recupero degli appuntamenti:', error);
    res.status(500).json({ message: 'Errore durante il recupero degli appuntamenti' });
  }
};

// Ottiene un appuntamento specifico tramite ID
exports.getAppuntamentoById = async (req, res) => {
  try {
    const appuntamento = await Appuntamento.findById(req.params.id)
      .populate('cliente', 'nome cognome email telefono')
      .populate('operatore', 'nome cognome')
      .populate('servizi.servizio', 'nome durata prezzo descrizione');
    
    if (!appuntamento) {
      return res.status(404).json({ message: 'Appuntamento non trovato' });
    }
    
    res.status(200).json(appuntamento);
  } catch (error) {
    console.error('Errore durante il recupero dell\'appuntamento:', error);
    res.status(500).json({ message: 'Errore durante il recupero dell\'appuntamento' });
  }
};

// Crea un nuovo appuntamento
exports.createAppuntamento = async (req, res) => {
  try {
    // Valida i dati di input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      cliente, 
      servizi, 
      operatore, 
      dataOraInizio, 
      dataOraFine, 
      sala, 
      note 
    } = req.body;

    // Verifica sovrapposizioni di appuntamenti per l'operatore
    const dataInizio = new Date(dataOraInizio);
    const dataFine = new Date(dataOraFine);
    
    const sovrapposizioni = await Appuntamento.find({
      operatore,
      stato: { $in: ['prenotato', 'confermato'] },
      $or: [
        {
          dataOraInizio: { $lt: dataFine },
          dataOraFine: { $gt: dataInizio }
        }
      ]
    });

    if (sovrapposizioni.length > 0) {
      return res.status(400).json({ 
        message: 'L\'operatore ha già un appuntamento in questo orario' 
      });
    }

    // Crea il nuovo appuntamento
    const nuovoAppuntamento = new Appuntamento({
      cliente,
      servizi,
      operatore,
      dataOraInizio: dataInizio,
      dataOraFine: dataFine,
      sala,
      note
    });

    await nuovoAppuntamento.save();
    
    // Popola i dati per la risposta
    await nuovoAppuntamento.populate([
      { path: 'cliente', select: 'nome cognome email telefono' },
      { path: 'operatore', select: 'nome cognome' },
      { path: 'servizi.servizio', select: 'nome durata prezzo' }
    ]);

    res.status(201).json(nuovoAppuntamento);
  } catch (error) {
    console.error('Errore durante la creazione dell\'appuntamento:', error);
    res.status(500).json({ message: 'Errore durante la creazione dell\'appuntamento' });
  }
};

// Modifica un appuntamento esistente
exports.updateAppuntamento = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Se si stanno modificando data/ora o operatore, verifica sovrapposizioni
    if (updateData.dataOraInizio || updateData.dataOraFine || updateData.operatore) {
      const appuntamentoCorrente = await Appuntamento.findById(id);
      if (!appuntamentoCorrente) {
        return res.status(404).json({ message: 'Appuntamento non trovato' });
      }

      const dataInizio = new Date(updateData.dataOraInizio || appuntamentoCorrente.dataOraInizio);
      const dataFine = new Date(updateData.dataOraFine || appuntamentoCorrente.dataOraFine);
      const operatore = updateData.operatore || appuntamentoCorrente.operatore;

      const sovrapposizioni = await Appuntamento.find({
        _id: { $ne: id }, // Escludi l'appuntamento corrente
        operatore,
        stato: { $in: ['prenotato', 'confermato'] },
        $or: [
          {
            dataOraInizio: { $lt: dataFine },
            dataOraFine: { $gt: dataInizio }
          }
        ]
      });

      if (sovrapposizioni.length > 0) {
        return res.status(400).json({ 
          message: 'L\'operatore ha già un appuntamento in questo orario' 
        });
      }
    }

    const appuntamentoAggiornato = await Appuntamento.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'cliente', select: 'nome cognome email telefono' },
      { path: 'operatore', select: 'nome cognome' },
      { path: 'servizi.servizio', select: 'nome durata prezzo' }
    ]);

    if (!appuntamentoAggiornato) {
      return res.status(404).json({ message: 'Appuntamento non trovato' });
    }

    res.status(200).json(appuntamentoAggiornato);
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'appuntamento:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'appuntamento' });
  }
};

// Elimina un appuntamento
exports.deleteAppuntamento = async (req, res) => {
  try {
    const appuntamentoEliminato = await Appuntamento.findByIdAndDelete(req.params.id);
    
    if (!appuntamentoEliminato) {
      return res.status(404).json({ message: 'Appuntamento non trovato' });
    }
    
    res.status(200).json({ message: 'Appuntamento eliminato con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'appuntamento:', error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'appuntamento' });
  }
};

// Aggiorna solo lo stato di un appuntamento
exports.updateStatoAppuntamento = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { stato } = req.body;
    
    const appuntamentoAggiornato = await Appuntamento.findByIdAndUpdate(
      req.params.id,
      { stato },
      { new: true, runValidators: true }
    ).populate([
      { path: 'cliente', select: 'nome cognome email telefono' },
      { path: 'operatore', select: 'nome cognome' },
      { path: 'servizi.servizio', select: 'nome durata prezzo' }
    ]);

    if (!appuntamentoAggiornato) {
      return res.status(404).json({ message: 'Appuntamento non trovato' });
    }

    res.status(200).json(appuntamentoAggiornato);
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dello stato:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dello stato' });
  }
};

// Ottiene appuntamenti per il calendario (raggruppati per giorno)
exports.getAppuntamentiCalendario = async (req, res) => {
  try {
    const { anno, mese } = req.params;
    
    const dataInizio = new Date(anno, mese - 1, 1); // mese è 0-based
    const dataFine = new Date(anno, mese, 0, 23, 59, 59, 999); // ultimo giorno del mese
    
    const appuntamenti = await Appuntamento.find({
      dataOraInizio: { $gte: dataInizio, $lte: dataFine },
      stato: { $ne: 'cancellato' }
    })
      .populate('cliente', 'nome cognome')
      .populate('operatore', 'nome cognome')
      .populate('servizi.servizio', 'nome')
      .sort({ dataOraInizio: 1 });

    // Raggruppa per giorno
    const calendario = {};
    appuntamenti.forEach(app => {
      const giorno = app.dataOraInizio.getDate();
      if (!calendario[giorno]) {
        calendario[giorno] = [];
      }
      calendario[giorno].push(app);
    });

    res.status(200).json(calendario);
  } catch (error) {
    console.error('Errore durante il recupero del calendario:', error);
    res.status(500).json({ message: 'Errore durante il recupero del calendario' });
  }
};

// Ottiene appuntamenti per operatore
exports.getAppuntamentiByOperatore = async (req, res) => {
  try {
    const { operatoreId } = req.params;
    const { 
      dataInizio, 
      dataFine, 
      stato,
      page = 1,
      limit = 50
    } = req.query;

    let filter = { operatore: operatoreId };
    
    if (dataInizio || dataFine) {
      filter.dataOraInizio = {};
      if (dataInizio) filter.dataOraInizio.$gte = new Date(dataInizio);
      if (dataFine) filter.dataOraInizio.$lte = new Date(dataFine);
    }
    
    if (stato) filter.stato = stato;

    const skip = (page - 1) * limit;
    
    const appuntamenti = await Appuntamento.find(filter)
      .populate('cliente', 'nome cognome email telefono')
      .populate('servizi.servizio', 'nome durata prezzo')
      .sort({ dataOraInizio: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appuntamento.countDocuments(filter);

    res.status(200).json({
      appuntamenti,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Errore during il recupero degli appuntamenti per operatore:', error);
    res.status(500).json({ message: 'Errore durante il recupero degli appuntamenti per operatore' });
  }
};

// Registra un pagamento per un appuntamento
exports.registraPagamento = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { metodo, importo, stato } = req.body;
    
    const appuntamentoAggiornato = await Appuntamento.findByIdAndUpdate(
      req.params.id,
      {
        'pagamento.metodo': metodo,
        'pagamento.importo': importo,
        'pagamento.stato': stato,
        'pagamento.dataOra': new Date()
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'cliente', select: 'nome cognome email telefono' },
      { path: 'operatore', select: 'nome cognome' },
      { path: 'servizi.servizio', select: 'nome durata prezzo' }
    ]);

    if (!appuntamentoAggiornato) {
      return res.status(404).json({ message: 'Appuntamento non trovato' });
    }

    res.status(200).json(appuntamentoAggiornato);
  } catch (error) {
    console.error('Errore durante la registrazione del pagamento:', error);
    res.status(500).json({ message: 'Errore durante la registrazione del pagamento' });
  }
};
