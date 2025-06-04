// Middleware per verificare che l'utente abbia ruolo admin
const adminMiddleware = (req, res, next) => {
  try {
    // Il middleware auth deve essere eseguito prima di questo
    if (!req.user) {
      return res.status(401).json({ message: 'Accesso non autorizzato' });
    }
    
    // Verifica che l'utente abbia ruolo admin
    if (req.user.ruolo !== 'admin') {
      return res.status(403).json({ 
        message: 'Accesso negato: sono richiesti privilegi di amministratore' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Errore nel middleware admin:', error);
    res.status(500).json({ message: 'Errore di autorizzazione' });
  }
};

module.exports = adminMiddleware;
