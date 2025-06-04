const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/user.model');
const Servizio = require('../src/models/servizio.model');

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/esteticacrm');
    console.log('✅ Connesso al database');

    // Prima controlliamo se ci sono già utenti
    const existingUsers = await User.countDocuments();
    console.log(`📊 Utenti esistenti: ${existingUsers}`);

    if (existingUsers > 0) {
      console.log('ℹ️  Ci sono già utenti nel database. Mostriamo gli esistenti:');
      const users = await User.find({}, 'nome cognome email ruolo attivo');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.nome} ${user.cognome} (${user.email})`);
        console.log(`   Ruolo: ${user.ruolo}, Attivo: ${user.attivo ? '✅' : '❌'}`);
      });
      return;
    }

    // Otteniamo alcuni servizi per assegnarli agli operatori
    const servizi = await Servizio.find({}).limit(5);
    console.log(`📋 Servizi disponibili: ${servizi.length}`);

    // Creiamo utenti di esempio
    const usersToCreate = [
      {
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@estetica.com',
        password: await bcrypt.hash('password123', 10),
        ruolo: 'admin',
        telefono: '123-456-7890',
        attivo: true,
        servizi: servizi.map(s => s._id)
      },
      {
        nome: 'Laura',
        cognome: 'Bianchi',
        email: 'laura.bianchi@estetica.com',
        password: await bcrypt.hash('password123', 10),
        ruolo: 'operatore',
        telefono: '123-456-7891',
        attivo: true,
        servizi: servizi.slice(0, 3).map(s => s._id)
      },
      {
        nome: 'Giulia',
        cognome: 'Verdi',
        email: 'giulia.verdi@estetica.com',
        password: await bcrypt.hash('password123', 10),
        ruolo: 'operatore',
        telefono: '123-456-7892',
        attivo: true,
        servizi: servizi.slice(2, 5).map(s => s._id)
      },
      {
        nome: 'Sara',
        cognome: 'Neri',
        email: 'sara.neri@estetica.com',
        password: await bcrypt.hash('password123', 10),
        ruolo: 'receptionist',
        telefono: '123-456-7893',
        attivo: true,
        servizi: []
      }
    ];

    console.log('🔄 Inserimento utenti...');
    const createdUsers = await User.insertMany(usersToCreate);
    
    console.log(`✅ ${createdUsers.length} utenti creati con successo!`);
    
    console.log('\n👥 Utenti creati:');
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nome} ${user.cognome} (${user.email})`);
      console.log(`   Ruolo: ${user.ruolo}, Servizi assegnati: ${user.servizi.length}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Errore:', error.message);
    process.exit(1);
  }
}

seedUsers();
