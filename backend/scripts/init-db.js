const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/user.model');

const initializeDatabase = async (shouldDisconnect = true) => {
  try {
    // Solo connetti se non siamo già connessi
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/esteticacrm', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }

    console.log('📦 Inizializzazione database...');

    // Verifica se esistono già utenti
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('👤 Creazione utente amministratore predefinito...');
      
      // Crea utente admin predefinito
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const adminUser = new User({
        nome: 'Amministratore',
        cognome: 'Sistema',
        email: 'admin@estetica.com',
        password: hashedPassword,
        ruolo: 'admin',
        telefono: '',
        dataCreazione: new Date()
      });

      await adminUser.save();
      
      console.log('✅ Utente amministratore creato:');
      console.log('   📧 Email: admin@estetica.com');
      console.log('   🔐 Password: admin123');
      console.log('   ⚠️  IMPORTANTE: Cambia la password al primo accesso!');
    } else {
      console.log(`ℹ️  Database già inizializzato con ${userCount} utenti`);
    }

    // Solo disconnetti se eseguito come script standalone
    if (shouldDisconnect) {
      await mongoose.disconnect();
    }
    console.log('✅ Inizializzazione completata');
    
  } catch (error) {
    console.error('❌ Errore durante l\'inizializzazione:', error);
    process.exit(1);
  }
};

// Esegui solo se chiamato direttamente
if (require.main === module) {
  initializeDatabase(true); // Disconnetti quando eseguito come script standalone
}

module.exports = initializeDatabase;
