const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/user.model');

const operatori = [
  {
    nome: 'Maria',
    cognome: 'Rossi',
    email: 'maria.rossi@estetica.com',
    telefono: '+39 329 1234567',
    ruolo: 'operatore',
    attivo: true,
    password: 'password123',
    specializzazioni: ['Viso', 'Mani'],
    orariLavoro: {
      lunedi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
      martedi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
      mercoledi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
      giovedi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
      venerdi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
      sabato: { attivo: true, oraInizio: '09:00', oraFine: '13:00' },
      domenica: { attivo: false }
    }
  },
  {
    nome: 'Giulia',
    cognome: 'Bianchi',
    email: 'giulia.bianchi@estetica.com',
    telefono: '+39 340 7654321',
    ruolo: 'operatore',
    attivo: true,
    password: 'password123',
    specializzazioni: ['Corpo', 'Epilazione'],
    orariLavoro: {
      lunedi: { attivo: true, oraInizio: '10:00', oraFine: '19:00' },
      martedi: { attivo: true, oraInizio: '10:00', oraFine: '19:00' },
      mercoledi: { attivo: false },
      giovedi: { attivo: true, oraInizio: '10:00', oraFine: '19:00' },
      venerdi: { attivo: true, oraInizio: '10:00', oraFine: '19:00' },
      sabato: { attivo: true, oraInizio: '09:00', oraFine: '17:00' },
      domenica: { attivo: false }
    }
  },
  {
    nome: 'Anna',
    cognome: 'Verdi',
    email: 'anna.verdi@estetica.com',
    telefono: '+39 333 9876543',
    ruolo: 'operatore',
    attivo: true,
    password: 'password123',
    specializzazioni: ['Piedi', 'Mani', 'Viso'],
    orariLavoro: {
      lunedi: { attivo: true, oraInizio: '08:00', oraFine: '16:00' },
      martedi: { attivo: true, oraInizio: '08:00', oraFine: '16:00' },
      mercoledi: { attivo: true, oraInizio: '08:00', oraFine: '16:00' },
      giovedi: { attivo: true, oraInizio: '08:00', oraFine: '16:00' },
      venerdi: { attivo: true, oraInizio: '08:00', oraFine: '16:00' },
      sabato: { attivo: false },
      domenica: { attivo: false }
    }
  }
];

async function seedOperatori() {
  try {
    await mongoose.connect('mongodb://saloon-mongo:27017/esteticacrm');
    console.log('✅ Connesso al database');

    // Controlla se gli operatori esistono già
    for (const operatore of operatori) {
      const esistente = await User.findOne({ email: operatore.email });
      
      if (!esistente) {
        // Cripta la password
        const salt = await bcrypt.genSalt(10);
        operatore.password = await bcrypt.hash(operatore.password, salt);
        
        const nuovoOperatore = new User(operatore);
        await nuovoOperatore.save();
        console.log(`✅ Creato operatore: ${operatore.nome} ${operatore.cognome}`);
      } else {
        console.log(`⚠️  Operatore già esistente: ${operatore.nome} ${operatore.cognome}`);
      }
    }

    // Mostra riepilogo finale
    const tuttiUtenti = await User.find({}, 'nome cognome email ruolo attivo');
    console.log(`\n📊 Totale utenti nel database: ${tuttiUtenti.length}`);
    
    const operatoriAttivi = tuttiUtenti.filter(u => u.ruolo === 'operatore' && u.attivo);
    console.log(`👥 Operatori attivi: ${operatoriAttivi.length}`);
    
    operatoriAttivi.forEach((op, i) => {
      console.log(`  ${i+1}. ${op.nome} ${op.cognome} (${op.email})`);
    });

    await mongoose.disconnect();
    console.log('\n🎉 Seeding operatori completato!');
    
  } catch (error) {
    console.error('❌ Errore durante il seeding:', error.message);
    process.exit(1);
  }
}

seedOperatori();
