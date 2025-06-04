const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Controller per ottenere tutti gli utenti con filtri
exports.getAllUsers = async (req, res) => {
  try {
    const { 
      ruolo, 
      attivo, 
      search, 
      sortBy = 'nome', 
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;
    
    // Costruisci il filtro
    const filter = {};
    if (ruolo && ruolo !== 'all') filter.ruolo = ruolo;
    if (attivo !== undefined && attivo !== 'all') filter.attivo = attivo === 'true';
    
    // Filtro di ricerca
    if (search) {
      filter.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { cognome: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Costruisci l'ordinamento
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calcola la paginazione
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Esegui la query
    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Conta il totale per la paginazione
    const total = await User.countDocuments(filter);
    
    res.status(200).json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Errore durante il recupero degli utenti:', error);
    res.status(500).json({ message: 'Errore durante il recupero degli utenti' });
  }
};

// Controller per ottenere un utente specifico
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Errore durante il recupero dell\'utente:', error);
    res.status(500).json({ message: 'Errore durante il recupero dell\'utente' });
  }
};

// Controller per creare un nuovo utente
exports.createUser = async (req, res) => {
  try {
    // Valida i dati di input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { 
      nome, 
      cognome, 
      email, 
      password, 
      ruolo = 'operatore', 
      telefono,
      orariLavoro,
      servizi = []
    } = req.body;
    
    // Verifica se l'email è già in uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già registrata' });
    }
    
    // Crea il nuovo utente
    const user = new User({
      nome,
      cognome,
      email,
      password,
      ruolo,
      telefono,
      orariLavoro,
      servizi,
      attivo: true
    });
    
    await user.save();
    
    // Restituisci l'utente senza password
    const userResponse = await User.findById(user._id).select('-password');
    
    res.status(201).json({ 
      message: 'Utente creato con successo',
      user: userResponse
    });
  } catch (error) {
    console.error('Errore durante la creazione dell\'utente:', error);
    res.status(500).json({ message: 'Errore durante la creazione dell\'utente' });
  }
};

// Controller per aggiornare un utente
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Rimuovi la password dall'aggiornamento se presente (usa endpoint separato)
    delete updates.password;
    
    // Se si sta aggiornando l'email, verifica che non sia già in uso
    if (updates.email) {
      const existingUser = await User.findOne({ 
        email: updates.email, 
        _id: { $ne: id } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email già in uso da un altro utente' });
      }
    }
    
    const user = await User.findByIdAndUpdate(
      id, 
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    res.status(200).json({
      message: 'Utente aggiornato con successo',
      user
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'utente:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'utente' });
  }
};

// Controller per attivare/disattivare un utente
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    user.attivo = !user.attivo;
    await user.save();
    
    const userResponse = await User.findById(id).select('-password');
    
    res.status(200).json({
      message: `Utente ${user.attivo ? 'attivato' : 'disattivato'} con successo`,
      user: userResponse
    });
  } catch (error) {
    console.error('Errore durante il cambio stato dell\'utente:', error);
    res.status(500).json({ message: 'Errore durante il cambio stato dell\'utente' });
  }
};

// Controller per eliminare un utente
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verifica che l'utente non sia l'admin principale
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    if (user.email === 'admin@estetica.com') {
      return res.status(403).json({ message: 'Non è possibile eliminare l\'amministratore principale' });
    }
    
    await User.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Utente eliminato con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'utente:', error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'utente' });
  }
};

// Controller per ottenere gli operatori attivi (per dropdown, ecc.)
exports.getActiveOperators = async (req, res) => {
  try {
    const operators = await User.find({ 
      ruolo: 'operatore', 
      attivo: true 
    }).select('nome cognome email telefono orariLavoro servizi');
    
    res.status(200).json(operators);
  } catch (error) {
    console.error('Errore durante il recupero degli operatori:', error);
    res.status(500).json({ message: 'Errore durante il recupero degli operatori' });
  }
};

// Controller per aggiornare la password di un utente (solo admin)
exports.updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ message: 'Nuova password richiesta' });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password aggiornata con successo' });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della password:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento della password' });
  }
};
