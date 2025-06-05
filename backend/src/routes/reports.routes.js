const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware per proteggere tutte le route - TEMPORARILY DISABLED FOR TESTING
// router.use(authMiddleware.verifyToken);

// GET /api/reports - Ottiene i dati dei reports
router.get('/', reportsController.getReportsData);

// GET /api/reports/export - Esporta report in CSV
router.get('/export', reportsController.exportReport);

module.exports = router;
