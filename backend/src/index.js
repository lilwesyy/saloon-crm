const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Caricamento variabili d'ambiente
dotenv.config();

// Import dell'app Express
const app = require('./app');

// Importazione servizi
const schedulerService = require('./services/scheduler.service');

const PORT = process.env.PORT || 3000;

// Connessione al database
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/esteticacrm', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('Connessione a MongoDB stabilita');
    
    // Auto-inizializzazione del database al primo avvio
    if (process.env.NODE_ENV !== 'test') {
      try {
        const initDb = require('../scripts/init-db');
        await initDb(false); // Non disconnettere, mantieni la connessione attiva
      } catch (error) {
        console.warn('⚠️  Inizializzazione database saltata:', error.message);
      }
    }
  })
  .catch((err) => console.error('Errore di connessione a MongoDB:', err));

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
  
  // Avvia il scheduler per i reminder automatici
  if (process.env.NODE_ENV !== 'test') {
    setTimeout(() => {
      schedulerService.start();
    }, 5000); // Attende 5 secondi dopo l'avvio del server
  }
});
