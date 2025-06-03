const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Route per il login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Inserisci un indirizzo email valido'),
    body('password').notEmpty().withMessage('La password è obbligatoria')
  ],
  authController.login
);

// Route per la registrazione (solo admin può farlo)
router.post(
  '/register',
  [
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    body('nome').notEmpty().withMessage('Il nome è obbligatorio'),
    body('cognome').notEmpty().withMessage('Il cognome è obbligatorio'),
    body('email').isEmail().withMessage('Inserisci un indirizzo email valido'),
    body('password').isLength({ min: 6 }).withMessage('La password deve essere di almeno 6 caratteri')
  ],
  authController.register
);

// Route per ottenere l'utente corrente
router.get('/me', authMiddleware.verifyToken, authController.getCurrentUser);

// Route per aggiornare la password
router.post(
  '/update-password',
  [
    authMiddleware.verifyToken,
    body('oldPassword').notEmpty().withMessage('La vecchia password è obbligatoria'),
    body('newPassword').isLength({ min: 6 }).withMessage('La nuova password deve essere di almeno 6 caratteri')
  ],
  authController.updatePassword
);

// Route per richiedere il reset della password
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Inserisci un indirizzo email valido')
  ],
  authController.requestPasswordReset
);

// Route per effettuare il reset della password
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token richiesto'),
    body('newPassword').isLength({ min: 6 }).withMessage('La nuova password deve essere di almeno 6 caratteri')
  ],
  authController.resetPassword
);

module.exports = router;
