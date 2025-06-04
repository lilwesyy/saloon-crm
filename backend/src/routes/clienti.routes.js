const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const clientiController = require('../controllers/clienti.controller');
const authMiddleware = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');

// Proteggere tutte le rotte con autenticazione
router.use(authMiddleware.verifyToken);

// Rotta per ottenere tutti i clienti (con supporto paginazione e filtri)
router.get('/', clientiController.getAll);

// Rotta per le statistiche generali sui clienti
router.get('/statistiche', clientiController.getStatistiche);

// Rotta per ricerca semplice (per compatibilità)
router.get('/search', clientiController.search);

// Rotta per ricerca avanzata con filtri multipli
router.get('/search/advanced', clientiController.searchAdvanced);

// Rotta per ottenere un cliente specifico
router.get('/:id', clientiController.getById);

// Rotta per creare un nuovo cliente
router.post(
  '/',
  [
    body('nome').notEmpty().withMessage('Il nome è obbligatorio'),
    body('cognome').notEmpty().withMessage('Il cognome è obbligatorio'),
    body('email').optional().isEmail().withMessage('Inserisci un indirizzo email valido'),
    body('telefono').notEmpty().withMessage('Il telefono è obbligatorio')
  ],
  clientiController.create
);

// Rotta per aggiornare un cliente
router.put(
  '/:id',
  [
    body('email').optional().isEmail().withMessage('Inserisci un indirizzo email valido')
  ],
  clientiController.update
);

// Rotta per eliminare un cliente
router.delete('/:id', clientiController.delete);

// Rotta per caricare la foto profilo
router.post(
  '/:id/foto',
  uploadMiddleware.profilo.single('foto'),
  clientiController.uploadFoto
);

module.exports = router;
