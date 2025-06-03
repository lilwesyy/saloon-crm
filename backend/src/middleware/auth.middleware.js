const jwt = require('jsonwebtoken');

// Middleware per verificare il token JWT
exports.verifyToken = (req, res, next) => {
  try {
    // Ottieni il token dall'header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Autenticazione richiesta' });
    }
    
    // Formato atteso: "Bearer [token]"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Formato token non valido' });
    }
    
    const token = parts[1];
    
    // Verifica il token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production'
    );
    
    // Aggiungi l'utente decodificato all'oggetto request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token non valido' });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token scaduto' });
    } else {
      console.error('Errore durante la verifica del token:', error);
      return res.status(500).json({ message: 'Errore di autenticazione' });
    }
  }
};

// Middleware per verificare se l'utente è admin
exports.isAdmin = (req, res, next) => {
  // L'utente è stato già verificato dal middleware verifyToken
  if (req.user && req.user.ruolo === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accesso negato: richiesti privilegi da amministratore' });
  }
};

// Middleware per verificare se l'utente è manager o admin
exports.isManagerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.ruolo === 'admin' || req.user.ruolo === 'manager')) {
    next();
  } else {
    res.status(403).json({ message: 'Accesso negato: richiesti privilegi da manager o amministratore' });
  }
};
