const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Controller per l'autenticazione
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verifica se l'utente esiste
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email o password non corretti' });
    }
    
    // Verifica se l'account è attivo
    if (!user.attivo) {
      return res.status(401).json({ message: 'Account disattivato. Contatta l\'amministratore.' });
    }
    
    // Verifica la password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email o password non corretti' });
    }
    
    // Aggiorna l'ultimo accesso
    user.ultimoAccesso = new Date();
    await user.save();
    
    // Genera il token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, ruolo: user.ruolo },
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
      { expiresIn: '24h' }
    );
    
    // Invia risposta con token e dati utente (esclusa la password)
    res.status(200).json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        ruolo: user.ruolo,
        fotoProfilo: user.fotoProfilo
      }
    });
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ message: 'Errore durante il login' });
  }
};

// Controller per la registrazione di nuovi utenti
exports.register = async (req, res) => {
  try {
    // Valida i dati di input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { nome, cognome, email, password, ruolo = 'operatore', telefono } = req.body;
    
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
      attivo: true
    });
    
    await user.save();
    
    // Risposta di successo
    res.status(201).json({ 
      message: 'Utente registrato con successo',
      user: {
        id: user._id,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        ruolo: user.ruolo
      }
    });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ message: 'Errore durante la registrazione' });
  }
};

// Controller per ottenere l'utente corrente
exports.getCurrentUser = async (req, res) => {
  try {
    // L'ID dell'utente proviene dal middleware di autenticazione
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    res.status(200).json({
      id: user._id,
      nome: user.nome,
      cognome: user.cognome,
      email: user.email,
      ruolo: user.ruolo,
      fotoProfilo: user.fotoProfilo,
      telefono: user.telefono
    });
  } catch (error) {
    console.error('Errore durante il recupero dei dati utente:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei dati utente' });
  }
};

// Controller per l'aggiornamento della password
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    // Verifica che entrambe le password siano state fornite
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Vecchia e nuova password richieste' });
    }
    
    // Recupera l'utente dal database
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    // Verifica la vecchia password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'La vecchia password non è corretta' });
    }
    
    // Aggiorna la password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password aggiornata con successo' });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della password:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento della password' });
  }
};

// Controller per la richiesta di reset password
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email richiesta' });
    }
    
    // Cerca l'utente corrispondente all'email
    const user = await User.findOne({ email });
    
    // Per sicurezza, rispondiamo sempre allo stesso modo anche se l'utente non esiste
    if (!user) {
      return res.status(200).json({ message: 'Se l\'email è registrata, riceverai un link per il reset della password' });
    }
    
    // In una implementazione reale, qui genereremmo un token e invieremmo una email
    // Per questa demo, restituiamo solo una risposta di successo
    
    res.status(200).json({ message: 'Se l\'email è registrata, riceverai un link per il reset della password' });
  } catch (error) {
    console.error('Errore durante la richiesta di reset password:', error);
    res.status(500).json({ message: 'Errore durante la richiesta di reset password' });
  }
};

// Controller per il reset della password con token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token e nuova password richiesti' });
    }
    
    // In una implementazione reale, qui verificheremmo il token e permetteremmo il reset
    // Per questa demo, restituiamo solo una risposta di errore
    
    res.status(400).json({ message: 'Funzionalità non implementata nella demo' });
  } catch (error) {
    console.error('Errore durante il reset della password:', error);
    res.status(500).json({ message: 'Errore durante il reset della password' });
  }
};

// Controller per ottenere utenti filtrati per ruolo
exports.getUsersByRole = async (req, res) => {
  try {
    const { ruolo, attivo } = req.query;
    
    const filter = {};
    if (ruolo) filter.ruolo = ruolo;
    if (attivo !== undefined) filter.attivo = attivo === 'true';
    
    const users = await User.find(filter).select('-password');
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Errore durante il recupero degli utenti:', error);
    res.status(500).json({ message: 'Errore durante il recupero degli utenti' });
  }
};

// Controller per ottenere un utente specifico per ID
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
