const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const campagneController = require('../controllers/campagne.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Proteggere tutte le rotte con autenticazione
router.use(authMiddleware.verifyToken);

// Validazioni per la creazione/modifica di una campagna
const campagnaValidation = [
  body('nome').notEmpty().withMessage('Il nome della campagna è obbligatorio'),
  body('tipo').isIn(['email', 'sms', 'promozione', 'compleanno', 'callback']).withMessage('Tipo campagna non valido'),
  body('stato').optional().isIn(['bozza', 'programmata', 'in_corso', 'completata', 'sospesa']).withMessage('Stato non valido'),
  body('segmentazione.tipo').isIn(['tutti', 'nuovi_clienti', 'clienti_fedeli', 'inattivi', 'compleanni', 'personalizzato']).withMessage('Tipo segmentazione non valido'),
  body('contenuto.oggetto').optional().isLength({ min: 1, max: 200 }).withMessage('Oggetto deve essere tra 1 e 200 caratteri'),
  body('contenuto.corpo').notEmpty().withMessage('Il contenuto della campagna è obbligatorio'),
  body('programmazione.dataInizio').optional().isISO8601().withMessage('Data inizio non valida'),
  body('programmazione.dataFine').optional().isISO8601().withMessage('Data fine non valida')
];

// Rotta per ottenere tutte le campagne
router.get('/', campagneController.getCampagne);

// Rotta per ottenere le statistiche delle campagne
router.get('/statistiche', campagneController.getStatistiche);

// Rotta per ottenere una campagna specifica
router.get('/:id', campagneController.getCampagnaById);

// Rotta per ottenere le statistiche di una campagna specifica
router.get('/:id/statistiche', campagneController.getStatisticheCampagna);

// Rotta per ottenere i clienti target di una campagna
router.get('/:id/clienti-target', campagneController.getClientiTarget);

// Rotta per creare una nuova campagna
router.post('/', campagnaValidation, campagneController.createCampagna);

// Rotta per aggiornare una campagna
router.put('/:id', campagnaValidation, campagneController.updateCampagna);

// Rotta per eliminare una campagna
router.delete('/:id', campagneController.deleteCampagna);

// Rotta per lanciare una campagna
router.post('/:id/lancia', campagneController.avviaCampagna);

// Rotta per sospendere una campagna
router.post('/:id/sospendi', campagneController.sospendiCampagna);

// Rotta per duplicare una campagna
router.post('/:id/duplica', campagneController.duplicaCampagna);

// Rotta per testare una campagna (invio di prova)
router.post('/:id/test', [
  body('emailTest').isEmail().withMessage('Email di test non valida')
], campagneController.testCampagna);

module.exports = router;
