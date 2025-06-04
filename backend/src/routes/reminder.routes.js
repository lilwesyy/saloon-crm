const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reminderController = require('../controllers/reminder.controller');

// POST /api/reminder/esegui - Esegue manualmente il processo di reminder
router.post('/esegui', reminderController.eseguiReminder);

// GET /api/reminder/stato - Ottiene lo stato dei reminder
router.get('/stato', reminderController.getStatoReminder);

// POST /api/reminder/appuntamento/:appuntamentoId/configura - Configura reminder personalizzati
router.post(
  '/appuntamento/:appuntamentoId/configura',
  [
    body('tipiReminder')
      .isArray({ min: 1 })
      .withMessage('Deve essere specificato almeno un tipo di reminder'),
    body('tipiReminder.*')
      .isIn(['24h', '2h', '30m'])
      .withMessage('Tipo reminder non valido'),
    body('messaggio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Il messaggio non può superare i 500 caratteri')
  ],
  reminderController.configuraReminder
);

// POST /api/reminder/appuntamento/:appuntamentoId/test - Test reminder per un appuntamento
router.post('/appuntamento/:appuntamentoId/test', reminderController.testReminder);

// PUT /api/reminder/appuntamento/:appuntamentoId/reset - Reset flag reminder
router.put('/appuntamento/:appuntamentoId/reset', reminderController.resetReminder);

// Route per la gestione dello scheduler
// GET /api/reminder/scheduler/status - Stato dello scheduler
router.get('/scheduler/status', reminderController.getSchedulerStatus);

// POST /api/reminder/scheduler/start - Avvia lo scheduler
router.post('/scheduler/start', reminderController.startScheduler);

// POST /api/reminder/scheduler/stop - Ferma lo scheduler
router.post('/scheduler/stop', reminderController.stopScheduler);

// POST /api/reminder/scheduler/test - Test immediato dello scheduler
router.post('/scheduler/test', reminderController.testScheduler);

module.exports = router;
