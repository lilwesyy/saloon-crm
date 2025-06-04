const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');

async function quickCheck() {
  try {
    // Connetti al database
    await mongoose.connect('mongodb://saloon-mongo:27017/esteticacrm');
    console.log('✅ Connesso');

    // Conta utenti
    const userCount = await User.countDocuments();
    console.log(`📊 Utenti totali: ${userCount}`);

    // Mostra tutti gli utenti
    const users = await User.find({}, 'nome cognome email ruolo attivo');
    users.forEach((user, i) => {
      console.log(`${i+1}. ${user.nome} ${user.cognome} - ${user.email} (${user.ruolo}) ${user.attivo ? '✅' : '❌'}`);
    });

    // Se non ci sono operatori, ne creiamo uno velocemente
    const operatori = users.filter(u => u.ruolo === 'operatore');
    if (operatori.length === 0) {
      console.log('\n🔧 Creando operatore di test...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      const operatore = new User({
        nome: 'Maria',
        cognome: 'Test',
        email: 'maria.test@estetica.com',
        password: hashedPassword,
        ruolo: 'operatore',
        attivo: true,
        telefono: '+39 329 1234567',
        orariLavoro: {
          lunedi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
          martedi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
          mercoledi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
          giovedi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
          venerdi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
          sabato: { attivo: true, oraInizio: '09:00', oraFine: '13:00' },
          domenica: { attivo: false }
        }
      });
      
      await operatore.save();
      console.log('✅ Operatore creato: Maria Test');
    } else {
      console.log(`\n👥 Operatori esistenti: ${operatori.length}`);
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Errore:', error.message);
    process.exit(1);
  }
}

quickCheck();
