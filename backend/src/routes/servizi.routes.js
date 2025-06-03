const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const serviziController = require('../controllers/servizi.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware per proteggere tutte le route
router.use(authMiddleware.verifyToken);

// GET /api/servizi - Lista servizi
router.get('/', serviziController.getAllServizi);

// GET /api/servizi/:id - Dettaglio servizio
router.get('/:id', serviziController.getServizioById);

// POST /api/servizi - Crea nuovo servizio
router.post(
  '/',
  [
    authMiddleware.isAdmin, // Solo admin può creare servizi
    body('nome').notEmpty().withMessage('Il nome del servizio è obbligatorio'),
    body('prezzo').isNumeric().withMessage('Il prezzo deve essere un numero'),
    body('durata').isInt({ min: 1 }).withMessage('La durata deve essere un numero intero positivo'),
    body('categoria').notEmpty().withMessage('La categoria è obbligatoria')
  ],
  serviziController.createServizio
);

// PUT /api/servizi/:id - Modifica servizio
router.put(
  '/:id',
  [
    authMiddleware.isAdmin, // Solo admin può modificare servizi
    body('nome').optional().notEmpty().withMessage('Il nome del servizio è obbligatorio'),
    body('prezzo').optional().isNumeric().withMessage('Il prezzo deve essere un numero'),
    body('durata').optional().isInt({ min: 1 }).withMessage('La durata deve essere un numero intero positivo'),
    body('categoria').optional().notEmpty().withMessage('La categoria è obbligatoria')
  ],
  serviziController.updateServizio
);

// DELETE /api/servizi/:id - Elimina servizio
router.delete('/:id', authMiddleware.isAdmin, serviziController.deleteServizio);

// GET /api/servizi/categoria/:categoria - Servizi per categoria
router.get('/categoria/:categoria', serviziController.getServiziByCategoria);

// PUT /api/servizi/:id/attivo - Attiva/disattiva servizio
router.put(
  '/:id/attivo',
  [
    authMiddleware.isAdmin,
    body('attivo').isBoolean().withMessage('Il campo attivo deve essere true o false')
  ],
  serviziController.toggleServizioAttivo
);

module.exports = router;
