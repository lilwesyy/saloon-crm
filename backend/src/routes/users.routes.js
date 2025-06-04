const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const usersController = require('../controllers/users.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// Middleware di autenticazione per tutte le routes
router.use(verifyToken);

// GET /api/users - Ottieni tutti gli utenti (filtrable)
router.get('/', usersController.getAllUsers);

// GET /api/users/operators - Ottieni gli operatori attivi
router.get('/operators', usersController.getActiveOperators);

// GET /api/users/:id - Ottieni un utente specifico
router.get('/:id', usersController.getUserById);

// POST /api/users - Crea un nuovo utente (solo admin)
router.post('/', 
  adminMiddleware,
  [
    body('nome').notEmpty().withMessage('Nome richiesto'),
    body('cognome').notEmpty().withMessage('Cognome richiesto'),
    body('email').isEmail().withMessage('Email valida richiesta'),
    body('password').isLength({ min: 6 }).withMessage('Password deve essere di almeno 6 caratteri'),
    body('ruolo').isIn(['admin', 'operatore']).withMessage('Ruolo non valido'),
    body('telefono').optional().isMobilePhone('it-IT').withMessage('Numero di telefono non valido')
  ],
  usersController.createUser
);

// PUT /api/users/:id - Aggiorna un utente (solo admin)
router.put('/:id', 
  adminMiddleware,
  [
    body('email').optional().isEmail().withMessage('Email valida richiesta'),
    body('ruolo').optional().isIn(['admin', 'operatore']).withMessage('Ruolo non valido'),
    body('telefono').optional().isMobilePhone('it-IT').withMessage('Numero di telefono non valido')
  ],
  usersController.updateUser
);

// PATCH /api/users/:id/toggle-status - Attiva/disattiva un utente (solo admin)
router.patch('/:id/toggle-status', adminMiddleware, usersController.toggleUserStatus);

// PATCH /api/users/:id/password - Aggiorna password utente (solo admin)
router.patch('/:id/password',
  adminMiddleware,
  [
    body('newPassword').isLength({ min: 6 }).withMessage('Password deve essere di almeno 6 caratteri')
  ],
  usersController.updateUserPassword
);

// DELETE /api/users/:id - Elimina un utente (solo admin)
router.delete('/:id', adminMiddleware, usersController.deleteUser);

module.exports = router;
