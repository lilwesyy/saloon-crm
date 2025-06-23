const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Importazione delle routes
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const clientiRoutes = require('./routes/clienti.routes');
const appuntamentiRoutes = require('./routes/appuntamenti.routes');
const serviziRoutes = require('./routes/servizi.routes');
const pagamentiRoutes = require('./routes/pagamenti.routes');
const campagneRoutes = require('./routes/campagne.routes');
const programmaFedeltaRoutes = require('./routes/programmaFedelta.routes');
const reminderRoutes = require('./routes/reminder.routes');
const salaRoutes = require('./routes/sala.routes');
const prenotazioneOnlineRoutes = require('./routes/prenotazioneOnline.routes');
const settingsRoutes = require('./routes/settings.routes');
const reportsRoutes = require('./routes/reports.routes');

// Inizializzazione dell'app Express
const app = express();

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, process.env.PUBLIC_URL] 
    : ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// In ambiente di test, disabilita il logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/clienti', clientiRoutes);
app.use('/api/appuntamenti', appuntamentiRoutes);
app.use('/api/servizi', serviziRoutes);
app.use('/api/pagamenti', pagamentiRoutes);
app.use('/api/campagne', campagneRoutes);
app.use('/api/programma-fedelta', programmaFedeltaRoutes);
app.use('/api/reminder', reminderRoutes);
app.use('/api/sale', salaRoutes);
app.use('/api/prenotazione-online', prenotazioneOnlineRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reports', reportsRoutes);

// Route base
app.get('/api', (req, res) => {
  res.json({ message: 'API CRM Centro Estetico' });
});

// Gestione errori
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Si è verificato un errore',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;
