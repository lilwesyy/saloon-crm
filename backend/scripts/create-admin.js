const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Carica le variabili d'ambiente
dotenv.config();

// Importa il modello User
const User = require('../src/models/user.model');

const createAdminUser = async () => {
  try {
    // Connetti al database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/esteticacrm', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connesso al database MongoDB');

    // Verifica quanti admin esistono già
    const existingAdmins = await User.find({ ruolo: 'admin' });
    
    if (existingAdmins.length > 0) {
      console.log(`ℹ️  Esistono già ${existingAdmins.length} amministratori nel sistema:`);
      existingAdmins.forEach((admin, index) => {
        console.log(`  ${index + 1}. ${admin.nome} ${admin.cognome} (${admin.email})`);
      });
      console.log('✨ Creazione di un nuovo amministratore...');
    }

    // Crea l'utente amministratore predefinito
    const adminUser = new User({
      nome: 'Amministratore',
      cognome: 'Sistema',
      email: 'admin@estetica.com',
      password: 'admin123', // Password predefinita - CAMBIARE IN PRODUZIONE!
      ruolo: 'admin',
      telefono: '+39 123 456 7890',
      attivo: true
    });

    await adminUser.save();

    console.log('✅ Utente amministratore creato con successo!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔐 Password:', 'admin123');
    console.log('⚠️  IMPORTANTE: Cambia la password al primo accesso!');

  } catch (error) {
    console.error('❌ Errore durante la creazione dell\'utente admin:', error);
  } finally {
    // Chiudi la connessione al database
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Esegui lo script
createAdminUser();
