/**
 * Script per inizializzare le impostazioni di sistema
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Carica le variabili d'ambiente
dotenv.config();

// Importa il modello Settings
const Settings = require('../src/models/settings.model');

// Funzione per inizializzare le impostazioni
const initSystemSettings = async () => {
  try {
    // Connetti al database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/esteticacrm', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connesso al database MongoDB');

    // Verifica se esistono già impostazioni di sistema
    const existingSettings = await Settings.findOne({ type: 'system' });
    
    if (existingSettings) {
      console.log('✅ Le impostazioni di sistema esistono già:');
      console.log(existingSettings.settings);
      process.exit(0);
    }

    // Crea le impostazioni di sistema predefinite
    const systemSettings = new Settings({
      type: 'system',
      settings: Settings.getDefaultSystemSettings()
    });

    await systemSettings.save();

    console.log('✅ Impostazioni di sistema create con successo:');
    console.log(systemSettings.settings);

  } catch (error) {
    console.error('❌ Errore durante l\'inizializzazione delle impostazioni di sistema:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Esegui lo script
initSystemSettings();
