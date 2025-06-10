const express = require('express');
const router = express.Router();
const prenotazioneOnlineController = require('../controllers/prenotazioneOnline.controller');
const {
  validateGetDisponibilita,
  validateCreaPrenotazione,
  validateConfermaPrenotazione,
  validateCancellaPrenotazione,
  sanitizeClienteData,
  rateLimitPrenotazioni
} = require('../middleware/prenotazioneOnline.validation');
const { checkPrenotazioniOnlineAbilitate } = require('../middleware/prenotazioneOnline.middleware');

// Middleware per rate limiting su tutte le routes
router.use(rateLimitPrenotazioni);

// Middleware per verificare se le prenotazioni online sono abilitate
router.use(checkPrenotazioniOnlineAbilitate);

// GET /api/prenotazione-online/servizi - Ottiene servizi disponibili
router.get('/servizi', prenotazioneOnlineController.getServiziDisponibili);

// GET /api/prenotazione-online/operatori - Ottiene operatori disponibili
router.get('/operatori', prenotazioneOnlineController.getOperatoriDisponibili);

// GET /api/prenotazione-online/disponibilita - Ottiene disponibilità
router.get('/disponibilita', validateGetDisponibilita, prenotazioneOnlineController.getDisponibilita);

// POST /api/prenotazione-online - Crea prenotazione
router.post('/', sanitizeClienteData, validateCreaPrenotazione, prenotazioneOnlineController.creaPrenotazioneOnline);

// PUT /api/prenotazione-online/:id/conferma - Conferma prenotazione
router.put('/:id/conferma', validateConfermaPrenotazione, prenotazioneOnlineController.confermaPrenotazione);

// DELETE /api/prenotazione-online/:id/cancella - Cancella prenotazione
router.delete('/:id/cancella', validateCancellaPrenotazione, prenotazioneOnlineController.cancellaPrenotazione);

module.exports = router;
