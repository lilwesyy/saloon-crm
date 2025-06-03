const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const appuntamentiController = require('../controllers/appuntamenti.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware per proteggere tutte le route
router.use(authMiddleware.verifyToken);

// GET /api/appuntamenti - Lista appuntamenti con filtri
router.get('/', appuntamentiController.getAppuntamenti);

// GET /api/appuntamenti/:id - Dettaglio appuntamento
router.get('/:id', appuntamentiController.getAppuntamentoById);

// POST /api/appuntamenti - Crea nuovo appuntamento
router.post(
  '/',
  [
    body('cliente').notEmpty().withMessage('Il cliente è obbligatorio'),
    body('servizi').isArray({ min: 1 }).withMessage('Deve essere selezionato almeno un servizio'),
    body('operatore').notEmpty().withMessage('L\'operatore è obbligatorio'),
    body('dataOraInizio').isISO8601().withMessage('Data e ora di inizio non valida'),
    body('dataOraFine').isISO8601().withMessage('Data e ora di fine non valida')
  ],
  appuntamentiController.createAppuntamento
);

// PUT /api/appuntamenti/:id - Modifica appuntamento
router.put(
  '/:id',
  [
    body('cliente').optional().notEmpty().withMessage('Il cliente è obbligatorio'),
    body('servizi').optional().isArray({ min: 1 }).withMessage('Deve essere selezionato almeno un servizio'),
    body('operatore').optional().notEmpty().withMessage('L\'operatore è obbligatorio'),
    body('dataOraInizio').optional().isISO8601().withMessage('Data e ora di inizio non valida'),
    body('dataOraFine').optional().isISO8601().withMessage('Data e ora di fine non valida'),
    body('stato').optional().isIn(['prenotato', 'confermato', 'completato', 'cancellato', 'noshow']).withMessage('Stato non valido')
  ],
  appuntamentiController.updateAppuntamento
);

// DELETE /api/appuntamenti/:id - Elimina appuntamento
router.delete('/:id', appuntamentiController.deleteAppuntamento);

// PUT /api/appuntamenti/:id/stato - Aggiorna stato appuntamento
router.put(
  '/:id/stato',
  [
    body('stato').isIn(['prenotato', 'confermato', 'completato', 'cancellato', 'noshow']).withMessage('Stato non valido')
  ],
  appuntamentiController.updateStatoAppuntamento
);

// GET /api/appuntamenti/calendario/:anno/:mese - Appuntamenti del mese per calendario
router.get('/calendario/:anno/:mese', appuntamentiController.getAppuntamentiCalendario);

// GET /api/appuntamenti/operatore/:operatoreId - Appuntamenti per operatore
router.get('/operatore/:operatoreId', appuntamentiController.getAppuntamentiByOperatore);

// POST /api/appuntamenti/:id/pagamento - Registra pagamento
router.post(
  '/:id/pagamento',
  [
    body('metodo').isIn(['contanti', 'carta', 'abbonamento', 'altro']).withMessage('Metodo di pagamento non valido'),
    body('importo').isNumeric().withMessage('L\'importo deve essere un numero'),
    body('stato').isIn(['non_pagato', 'parziale', 'completato']).withMessage('Stato pagamento non valido')
  ],
  appuntamentiController.registraPagamento
);

module.exports = router;
