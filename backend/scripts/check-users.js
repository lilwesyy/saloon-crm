const mongoose = require('mongoose');
const User = require('../src/models/user.model');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/esteticacrm', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connesso al database');
    
    const users = await User.find({}, 'nome cognome email ruolo attivo');
    console.log(`\n📊 Utenti trovati: ${users.length}`);
    
    if (users.length === 0) {
      console.log('❌ Nessun utente trovato nel database');
    } else {
      console.log('\n👥 Lista utenti:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.nome} ${user.cognome} (${user.email})`);
        console.log(`   Ruolo: ${user.ruolo}, Attivo: ${user.attivo ? '✅' : '❌'}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore:', error.message);
    process.exit(1);
  }
}

checkUsers();
