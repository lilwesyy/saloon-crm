const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware per proteggere tutte le route
router.use(authMiddleware.verifyToken);

// GET /api/reports - Ottiene i dati dei reports
router.get('/', (req, res) => reportsController.getReportsData(req, res));

// GET /api/reports/export - Esporta report in CSV
router.get('/export', (req, res) => reportsController.exportReport(req, res));

module.exports = router;
