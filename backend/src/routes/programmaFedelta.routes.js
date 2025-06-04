const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const programmaFedeltaController = require('../controllers/programmaFedelta.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Proteggere tutte le rotte con autenticazione
router.use(authMiddleware.verifyToken);

// Validazioni per la creazione/modifica di un programma fedeltà
const programmaFedeltaValidation = [
  body('cliente').isMongoId().withMessage('ID cliente non valido'),
  body('punti').optional().isInt({ min: 0 }).withMessage('I punti devono essere un numero non negativo'),
  body('livello').optional().isIn(['bronze', 'silver', 'gold', 'platinum']).withMessage('Livello non valido'),
  body('stato').optional().isIn(['attivo', 'inattivo', 'sospeso']).withMessage('Stato non valido')
];

// Validazioni per l'aggiunta/riscatto punti
const puntiValidation = [
  body('punti').isInt({ min: 1 }).withMessage('Il numero di punti deve essere positivo'),
  body('motivo').optional().isLength({ min: 1, max: 200 }).withMessage('Motivo deve essere tra 1 e 200 caratteri'),
  body('appuntamento').optional().isMongoId().withMessage('ID appuntamento non valido'),
  body('pagamento').optional().isMongoId().withMessage('ID pagamento non valido')
];

// Rotta per ottenere tutti i programmi fedeltà
router.get('/', programmaFedeltaController.getAll);

// Rotta per ottenere le statistiche generali
router.get('/statistiche', programmaFedeltaController.getStatistiche);

// Rotta per ottenere un programma fedeltà specifico
router.get('/:id', programmaFedeltaController.getById);

// Rotta per ottenere il programma fedeltà di un cliente
router.get('/cliente/:clienteId', programmaFedeltaController.getByCliente);

// Rotta per creare un nuovo programma fedeltà
router.post('/', programmaFedeltaValidation, programmaFedeltaController.create);

// Rotta per aggiornare un programma fedeltà
router.put('/:id', programmaFedeltaValidation, programmaFedeltaController.update);

// Rotta per eliminare un programma fedeltà
router.delete('/:id', programmaFedeltaController.delete);

// Rotta per aggiungere punti
router.post('/:id/aggiungi-punti', puntiValidation, programmaFedeltaController.aggiungiPunti);

// Rotta per riscattare punti
router.post('/:id/riscatta-punti', [
  ...puntiValidation,
  body('premio').optional().isLength({ min: 1, max: 200 }).withMessage('Descrizione premio deve essere tra 1 e 200 caratteri')
], programmaFedeltaController.riscattaPunti);

// Rotta per sincronizzare i punti con pagamenti e appuntamenti
router.post('/cliente/:clienteId/sincronizza', programmaFedeltaController.sincronizzaPunti);

module.exports = router;
