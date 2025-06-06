const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

// Import dei modelli
const Appuntamento = require('../src/models/appuntamento.model');
const Cliente = require('../src/models/cliente.model');
const Servizio = require('../src/models/servizio.model');
const User = require('../src/models/user.model');

// Configurazione database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/esteticacrm';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📊 Connesso al database MongoDB');
  } catch (error) {
    console.error('❌ Errore connessione database:', error);
    process.exit(1);
  }
}

async function seedAppuntamenti() {
  try {
    await connectDB();

    // Ottieni clienti, servizi e operatori esistenti
    const clienti = await Cliente.find({});
    const servizi = await Servizio.find({});
    const operatori = await User.find({ ruolo: 'operatore' });

    if (clienti.length === 0 || servizi.length === 0 || operatori.length === 0) {
      console.error('❌ Mancano dati di base (clienti, servizi, operatori)');
      process.exit(1);
    }

    console.log(`📌 Clienti disponibili: ${clienti.length}`);
    console.log(`📌 Servizi disponibili: ${servizi.length}`);
    console.log(`📌 Operatori disponibili: ${operatori.length}`);

    // Cancella appuntamenti esistenti
    await Appuntamento.deleteMany({});
    console.log('🗑️  Appuntamenti esistenti cancellati');

    const appuntamenti = [];
    const numeroAppuntamenti = 100;
    const numeroAppuntamentiOggi = 15; // Appuntamenti per oggi

    console.log(`🚀 Generazione di ${numeroAppuntamenti} appuntamenti...`);

    // Prima generiamo alcuni appuntamenti per oggi
    console.log(`📅 Generazione di ${numeroAppuntamentiOggi} appuntamenti per oggi...`);
    
    for (let i = 0; i < numeroAppuntamentiOggi; i++) {
      const oggi = new Date();
      oggi.setHours(0, 0, 0, 0); // Inizia dalla mezzanotte di oggi
      
      // Orari lavorativi: dalle 9:00 alle 19:00
      const orarioMinimo = 9; // 9:00
      const orarioMassimo = 19; // 19:00
      const orario = orarioMinimo + Math.floor(Math.random() * (orarioMassimo - orarioMinimo));
      const minuti = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
      
      const dataInizio = new Date(oggi);
      dataInizio.setHours(orario, minuti, 0, 0);
      
      const clienteRandom = clienti[Math.floor(Math.random() * clienti.length)];
      const servizioRandom = servizi[Math.floor(Math.random() * servizi.length)];
      const operatoreRandom = operatori[Math.floor(Math.random() * operatori.length)];
      
      const serviziAppuntamento = [{
        servizio: servizioRandom._id,
        prezzo: servizioRandom.prezzo,
        durata: servizioRandom.durata || 60
      }];
      
      const durataTotale = serviziAppuntamento.reduce((total, s) => total + s.durata, 0);
      const dataFine = new Date(dataInizio.getTime() + durataTotale * 60000);
      
      // Stati possibili per gli appuntamenti di oggi
      const statiOggi = ['confermato', 'prenotato', 'completato'];
      const statoRandom = statiOggi[Math.floor(Math.random() * statiOggi.length)];
      
      const appuntamento = {
        cliente: clienteRandom._id,
        operatore: operatoreRandom._id,
        servizi: serviziAppuntamento,
        dataOraInizio: dataInizio,
        dataOraFine: dataFine,
        stato: statoRandom,
        note: faker.lorem.sentence(),
        createdAt: faker.date.past(),
        updatedAt: new Date()
      };
      
      appuntamenti.push(appuntamento);
    }

    // Poi generiamo gli altri appuntamenti con date random
    for (let i = 0; i < numeroAppuntamenti - numeroAppuntamentiOggi; i++) {
      // Data random negli ultimi 3 mesi
      const dataInizio = faker.date.between({
        from: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000),
        to: new Date()
      });

      dataInizio.setHours(faker.number.int({ min: 9, max: 18 }));
      dataInizio.setMinutes(faker.helpers.arrayElement([0, 15, 30, 45]));
      dataInizio.setSeconds(0);

      const cliente = faker.helpers.arrayElement(clienti);
      const operatore = faker.helpers.arrayElement(operatori);
      const servizio = faker.helpers.arrayElement(servizi);
      
      const serviziAppuntamento = [{
        servizio: servizio._id,
        prezzo: servizio.prezzo,
        durata: servizio.durata || 60
      }];

      const durataTotale = serviziAppuntamento.reduce((total, s) => total + s.durata, 0);
      const dataFine = new Date(dataInizio.getTime() + durataTotale * 60000);

      const stato = faker.helpers.weightedArrayElement([
        { weight: 85, value: 'completato' },
        { weight: 10, value: 'confermato' },
        { weight: 5, value: 'cancellato' }
      ]);

      const appuntamento = {
        cliente: cliente._id,
        operatore: operatore._id,
        servizi: serviziAppuntamento,
        dataOraInizio: dataInizio,
        dataOraFine: dataFine,
        stato: stato,
        note: faker.lorem.sentence(),
        createdAt: new Date(dataInizio.getTime() - 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      };

      appuntamenti.push(appuntamento);
    }

    await Appuntamento.insertMany(appuntamenti);
    
    console.log(`✅ ${appuntamenti.length} appuntamenti creati con successo!`);
    console.log(`📅 Appuntamenti di oggi: ${numeroAppuntamentiOggi}`);
    
    const completati = appuntamenti.filter(a => a.stato === 'completato').length;
    const confermati = appuntamenti.filter(a => a.stato === 'confermato').length;
    const prenotati = appuntamenti.filter(a => a.stato === 'prenotato').length;
    
    console.log(`📊 Statistiche:`);
    console.log(`   - Completati: ${completati}`);
    console.log(`   - Confermati: ${confermati}`);
    console.log(`   - Prenotati: ${prenotati}`);

  } catch (error) {
    console.error('❌ Errore durante il seeding degli appuntamenti:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connessione al database chiusa');
  }
}

if (require.main === module) {
  seedAppuntamenti();
}

module.exports = seedAppuntamenti;
