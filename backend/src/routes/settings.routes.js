const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { body } = require('express-validator');

// Middleware per verificare che l'utente sia autenticato
router.use(authMiddleware.verifyToken);

// Ottiene le impostazioni di sistema (solo admin)
router.get('/system', 
  authMiddleware.isAdmin,
  settingsController.getSystemSettings
);

// Aggiorna le impostazioni di sistema (solo admin)
router.put('/system',
  authMiddleware.isAdmin,
  [
    body('businessName').optional().trim().isLength({ min: 2, max: 100 }),
    body('businessPhone').optional().trim().isLength({ min: 5, max: 20 }),
    body('businessEmail').optional().isEmail().normalizeEmail(),
    body('businessAddress').optional().trim().isLength({ min: 5, max: 200 }),
    body('openingHours').optional().trim().isLength({ min: 5, max: 500 })
  ],
  settingsController.updateSystemSettings
);

// Ottiene le impostazioni utente
router.get('/user', settingsController.getUserSettings);

// Aggiorna le impostazioni utente
router.put('/user', settingsController.updateUserSettings);

module.exports = router;
