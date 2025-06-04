const express = require('express');
const router = express.Router();
const salaController = require('../controllers/sala.controller');

// Middleware di autenticazione (da implementare se necessario)
// const auth = require('../middleware/auth');

/**
 * @route GET /api/sale
 * @desc Ottieni tutte le sale con le loro configurazioni
 * @access Private
 */
router.get('/', salaController.getSale);

/**
 * @route GET /api/sale/:id
 * @desc Ottieni dettagli di una sala specifica
 * @access Private
 */
router.get('/:id', salaController.getSalaById);

/**
 * @route POST /api/sale/:salaId/disponibilita
 * @desc Verifica disponibilità di una sala per un periodo specifico
 * @access Private
 */
router.post('/:salaId/disponibilita', salaController.verificaDisponibilita);

/**
 * @route POST /api/sale/suggerimenti
 * @desc Ottieni suggerimenti di sale per un servizio
 * @access Private
 */
router.post('/suggerimenti', salaController.suggerisciSala);

/**
 * @route GET /api/sale/:salaId/pianificazione-settimanale
 * @desc Ottieni la pianificazione settimanale di una sala
 * @access Private
 */
router.get('/:salaId/pianificazione-settimanale', salaController.getPlanningSettimanale);

/**
 * @route GET /api/sale/statistiche/utilizzo
 * @desc Ottieni statistiche di utilizzo di tutte le sale
 * @access Private
 */
router.get('/statistiche/utilizzo', salaController.getStatistiche);

/**
 * @route GET /api/sale/ottimizzazione/suggerimenti
 * @desc Ottieni suggerimenti per l'ottimizzazione dell'uso delle sale
 * @access Private
 */
router.get('/ottimizzazione/suggerimenti', salaController.getSuggerimentiOttimizzazione);

/**
 * @route POST /api/sale/:salaId/prenota
 * @desc Prenota una sala per un appuntamento (logica semplificata)
 * @access Private
 */
router.post('/:salaId/prenota', salaController.prenotaSala);

/**
 * @route DELETE /api/sale/:salaId/prenota/:appuntamentoId
 * @desc Libera una sala da un appuntamento
 * @access Private
 */
router.delete('/:salaId/prenota/:appuntamentoId', salaController.liberaSala);

/**
 * @route GET /api/sale/:salaId/appuntamenti
 * @desc Ottieni tutti gli appuntamenti di una sala per un periodo
 * @access Private
 */
router.get('/:salaId/appuntamenti', salaController.ottieniAppuntamentiSala);

/**
 * @route POST /api/sale/conflitti/rileva
 * @desc Rileva conflitti potenziali nella prenotazione delle sale
 * @access Private
 */
router.post('/conflitti/rileva', salaController.rilevaConflitti);

module.exports = router;
