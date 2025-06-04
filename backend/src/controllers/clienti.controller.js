const Cliente = require('../models/cliente.model');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Ottiene tutti i clienti
exports.getAll = async (req, res) => {
  try {
    // Supporto per paginazione
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Supporto per ordinamento
    const sortField = req.query.sort || 'cognome';
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const sortOptions = {};
    sortOptions[sortField] = sortOrder;
    
    // Supporto per filtri
    const filter = {};
    if (req.query.classificazione && req.query.classificazione !== 'tutti') {
      filter.classificazione = req.query.classificazione;
    }
    
    // Conta totale dei clienti per la paginazione
    const total = await Cliente.countDocuments(filter);
    
    // Effettua la query
    const clienti = await Cliente.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      clienti,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Errore durante il recupero dei clienti:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei clienti' });
  }
};

// Ottiene un cliente specifico tramite ID
exports.getById = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente non trovato' });
    }
    
    res.status(200).json(cliente);
  } catch (error) {
    console.error('Errore durante il recupero del cliente:', error);
    res.status(500).json({ message: 'Errore durante il recupero del cliente' });
  }
};

// Crea un nuovo cliente
exports.create = async (req, res) => {
  try {
    // Valida i dati di input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Verifica se l'email è già in uso da un altro cliente
    if (req.body.email) {
      const emailExists = await Cliente.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email già registrata per un altro cliente' });
      }
    }
    
    // Crea il nuovo cliente
    const nuovoCliente = new Cliente({
      nome: req.body.nome,
      cognome: req.body.cognome,
      email: req.body.email,
      telefono: req.body.telefono,
      dataNascita: req.body.dataNascita,
      indirizzo: req.body.indirizzo,
      note: req.body.note,
      consensoPrivacy: req.body.consensoPrivacy || false,
      consensoMarketing: req.body.consensoMarketing || false,
      classificazione: req.body.classificazione || 'nuovo'
    });
    
    await nuovoCliente.save();
    
    res.status(201).json(nuovoCliente);
  } catch (error) {
    console.error('Errore durante la creazione del cliente:', error);
    res.status(500).json({ message: 'Errore durante la creazione del cliente' });
  }
};

// Aggiorna un cliente esistente
exports.update = async (req, res) => {
  try {
    // Valida i dati di input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Verifica se l'email è già in uso da un altro cliente
    if (req.body.email) {
      const emailExists = await Cliente.findOne({ 
        email: req.body.email, 
        _id: { $ne: req.params.id } 
      });
      
      if (emailExists) {
        return res.status(400).json({ message: 'Email già registrata per un altro cliente' });
      }
    }
    
    // Trova e aggiorna il cliente
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente non trovato' });
    }
    
    res.status(200).json(cliente);
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del cliente:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del cliente' });
  }
};

// Elimina un cliente
exports.delete = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente non trovato' });
    }
    
    // Se il cliente ha una foto profilo, elimina anche il file
    if (cliente.fotoProfilo) {
      const filePath = path.join(__dirname, '../../uploads/profili', path.basename(cliente.fotoProfilo));
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Cliente.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Cliente eliminato con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione del cliente:', error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione del cliente' });
  }
};

// Cerca clienti per nome, cognome o email
exports.search = async (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query) {
      return res.status(400).json({ message: 'Parametro di ricerca mancante' });
    }
    
    const clienti = await Cliente.find({
      $or: [
        { nome: { $regex: query, $options: 'i' } },
        { cognome: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { telefono: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.status(200).json(clienti);
  } catch (error) {
    console.error('Errore durante la ricerca dei clienti:', error);
    res.status(500).json({ message: 'Errore durante la ricerca dei clienti' });
  }
};

// Ricerca avanzata clienti con filtri multipli
exports.searchAdvanced = async (req, res) => {
  try {
    const filters = {};
    
    // Filtri testuali
    if (req.query.nome) {
      filters.nome = { $regex: req.query.nome, $options: 'i' };
    }
    
    if (req.query.cognome) {
      filters.cognome = { $regex: req.query.cognome, $options: 'i' };
    }
    
    if (req.query.email) {
      filters.email = { $regex: req.query.email, $options: 'i' };
    }
    
    if (req.query.telefono) {
      filters.telefono = { $regex: req.query.telefono, $options: 'i' };
    }
    
    // Filtro per città
    if (req.query.citta) {
      filters['indirizzo.citta'] = { $regex: req.query.citta, $options: 'i' };
    }
    
    // Filtro per classificazione
    if (req.query.classificazione && req.query.classificazione !== 'tutti') {
      filters.classificazione = req.query.classificazione;
    }
    
    // Filtro per consensi
    if (req.query.consensoPrivacy) {
      filters.consensoPrivacy = req.query.consensoPrivacy === 'true';
    }
    
    if (req.query.consensoMarketing) {
      filters.consensoMarketing = req.query.consensoMarketing === 'true';
    }
    
    // Filtro per data di nascita (range)
    if (req.query.dataNascitaInizio || req.query.dataNascitaFine) {
      filters.dataNascita = {};
      
      if (req.query.dataNascitaInizio) {
        filters.dataNascita.$gte = new Date(req.query.dataNascitaInizio);
      }
      
      if (req.query.dataNascitaFine) {
        filters.dataNascita.$lte = new Date(req.query.dataNascitaFine);
      }
    }
    
    // Filtro per data di creazione (clienti nuovi)
    if (req.query.creatoDopoData) {
      filters.createdAt = { $gte: new Date(req.query.creatoDopoData) };
    }
    
    // Filtro per ultima visita
    if (req.query.ultimaVisitaPrimaDi) {
      const dataLimite = new Date(req.query.ultimaVisitaPrimaDi);
      filters.$or = [
        { ultimaVisita: { $lt: dataLimite } },
        { ultimaVisita: { $exists: false } }
      ];
    }
    
    // Paginazione
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Ordinamento
    const sortField = req.query.sort || 'cognome';
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const sortOptions = {};
    sortOptions[sortField] = sortOrder;
    
    // Conta totale per paginazione
    const total = await Cliente.countDocuments(filters);
    
    // Esegui query
    const clienti = await Cliente.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      clienti,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Errore durante la ricerca avanzata dei clienti:', error);
    res.status(500).json({ message: 'Errore durante la ricerca avanzata dei clienti' });
  }
};

// Carica foto profilo
exports.uploadFoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nessun file caricato' });
    }
    
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      // Elimina il file appena caricato se il cliente non esiste
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Cliente non trovato' });
    }
    
    // Se il cliente ha già una foto profilo, elimina il file vecchio
    if (cliente.fotoProfilo) {
      const oldFilePath = path.join(__dirname, '../../uploads/profili', path.basename(cliente.fotoProfilo));
      
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }
    
    // Imposta il percorso della nuova foto
    const fotoProfilo = `/uploads/profili/${req.file.filename}`;
    
    // Aggiorna il cliente con il nuovo percorso della foto
    cliente.fotoProfilo = fotoProfilo;
    await cliente.save();
    
    res.status(200).json({ fotoProfilo });
  } catch (error) {
    console.error('Errore durante il caricamento della foto:', error);
    res.status(500).json({ message: 'Errore durante il caricamento della foto' });
  }
};

// Ottieni statistiche generali sui clienti
exports.getStatistiche = async (req, res) => {
  try {
    const totaleClienti = await Cliente.countDocuments();
    
    const perClassificazione = await Cliente.aggregate([
      { $group: { _id: '$classificazione', count: { $sum: 1 } } }
    ]);
    
    const perConsensMarketing = await Cliente.countDocuments({ consensoMarketing: true });
    
    const nuoviUltimoMese = await Cliente.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    // Converti il risultato dell'aggregazione in un oggetto
    const classificazioneMap = {};
    perClassificazione.forEach(item => {
      classificazioneMap[item._id] = item.count;
    });
    
    res.status(200).json({
      totale: totaleClienti,
      perClassificazione: classificazioneMap,
      conConsensoMarketing: perConsensMarketing,
      nuoviUltimoMese
    });
  } catch (error) {
    console.error('Errore durante il recupero delle statistiche:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle statistiche' });
  }
};
