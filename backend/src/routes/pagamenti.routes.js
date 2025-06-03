const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const pagamentiController = require('../controllers/pagamenti.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware per proteggere tutte le route
router.use(authMiddleware.verifyToken);

// GET /api/pagamenti - Lista pagamenti con filtri
router.get('/', pagamentiController.getPagamenti);

// GET /api/pagamenti/:id - Dettaglio pagamento
router.get('/:id', pagamentiController.getPagamentoById);

// POST /api/pagamenti - Registra nuovo pagamento
router.post(
  '/',
  [
    body('cliente').notEmpty().withMessage('Il cliente è obbligatorio'),
    body('importo').isNumeric().withMessage('L\'importo deve essere un numero'),
    body('metodo').isIn(['contanti', 'carta', 'bonifico', 'assegno', 'altro']).withMessage('Metodo di pagamento non valido'),
    body('tipo').isIn(['servizio', 'prodotto', 'abbonamento', 'altro']).withMessage('Tipo pagamento non valido')
  ],
  pagamentiController.createPagamento
);

// PUT /api/pagamenti/:id - Modifica pagamento
router.put(
  '/:id',
  [
    body('importo').optional().isNumeric().withMessage('L\'importo deve essere un numero'),
    body('metodo').optional().isIn(['contanti', 'carta', 'bonifico', 'assegno', 'altro']).withMessage('Metodo di pagamento non valido'),
    body('tipo').optional().isIn(['servizio', 'prodotto', 'abbonamento', 'altro']).withMessage('Tipo pagamento non valido'),
    body('stato').optional().isIn(['completato', 'rimborsato', 'annullato']).withMessage('Stato pagamento non valido')
  ],
  pagamentiController.updatePagamento
);

// DELETE /api/pagamenti/:id - Elimina pagamento
router.delete('/:id', authMiddleware.isAdmin, pagamentiController.deletePagamento);

// GET /api/pagamenti/cliente/:clienteId - Pagamenti per cliente
router.get('/cliente/:clienteId', pagamentiController.getPagamentiByCliente);

// GET /api/pagamenti/stats - Statistiche pagamenti
router.get('/stats/overview', pagamentiController.getStatsOverview);

// GET /api/pagamenti/stats/mensili - Statistiche mensili
router.get('/stats/mensili', pagamentiController.getStatsMensili);

// POST /api/pagamenti/:id/rimborso - Rimborsa pagamento
router.post(
  '/:id/rimborso',
  [
    authMiddleware.isAdmin,
    body('motivo').notEmpty().withMessage('Il motivo del rimborso è obbligatorio'),
    body('importo').optional().isNumeric().withMessage('L\'importo deve essere un numero')
  ],
  pagamentiController.rimborsaPagamento
);

module.exports = router;
