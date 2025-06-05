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

async function seedAppuntamentiOggi() {
  try {
    await connectDB();

    // Ottieni clienti, servizi e operatori esistenti
    const clienti = await Cliente.find({});
    const servizi = await Servizio.find({});
    const operatori = await User.find({ ruolo: 'operatore' });

    if (clienti.length === 0 || servizi.length === 0 || operatori.length === 0) {
      console.error('❌ Mancano dati di base (clienti, servizi, operatori)');
      console.log('💡 Esegui prima i seeder per clienti, servizi e operatori');
      process.exit(1);
    }

    console.log(`📌 Clienti disponibili: ${clienti.length}`);
    console.log(`📌 Servizi disponibili: ${servizi.length}`);
    console.log(`📌 Operatori disponibili: ${operatori.length}`);

    // Rimuovi eventuali appuntamenti di oggi esistenti
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    const domani = new Date(oggi);
    domani.setDate(domani.getDate() + 1);

    await Appuntamento.deleteMany({
      dataOraInizio: {
        $gte: oggi,
        $lt: domani
      }
    });
    console.log('🗑️  Appuntamenti di oggi esistenti cancellati');

    const appuntamenti = [];
    const numeroAppuntamentiOggi = 12; // Appuntamenti per oggi

    console.log(`📅 Generazione di ${numeroAppuntamentiOggi} appuntamenti per oggi (${oggi.toLocaleDateString('it-IT')})...`);
    
    // Orari predefiniti per una distribuzione più realistica
    const orariDisponibili = [
      { ora: 9, minuti: 0 },
      { ora: 9, minuti: 30 },
      { ora: 10, minuti: 0 },
      { ora: 10, minuti: 30 },
      { ora: 11, minuti: 0 },
      { ora: 11, minuti: 30 },
      { ora: 14, minuti: 0 },
      { ora: 14, minuti: 30 },
      { ora: 15, minuti: 0 },
      { ora: 15, minuti: 30 },
      { ora: 16, minuti: 0 },
      { ora: 16, minuti: 30 },
      { ora: 17, minuti: 0 },
      { ora: 17, minuti: 30 },
      { ora: 18, minuti: 0 },
      { ora: 18, minuti: 30 }
    ];

    // Mescola gli orari per una distribuzione casuale
    const orariMescolati = faker.helpers.shuffle([...orariDisponibili]);
    
    for (let i = 0; i < numeroAppuntamentiOggi; i++) {
      const orario = orariMescolati[i % orariMescolati.length];
      
      const dataInizio = new Date(oggi);
      dataInizio.setHours(orario.ora, orario.minuti, 0, 0);
      
      const clienteRandom = faker.helpers.arrayElement(clienti);
      const servizioRandom = faker.helpers.arrayElement(servizi);
      const operatoreRandom = faker.helpers.arrayElement(operatori);
      
      const serviziAppuntamento = [{
        servizio: servizioRandom._id,
        prezzo: servizioRandom.prezzo,
        durata: servizioRandom.durata || 60
      }];
      
      const durataTotale = serviziAppuntamento.reduce((total, s) => total + s.durata, 0);
      const dataFine = new Date(dataInizio.getTime() + durataTotale * 60000);
      
      // Stati realistici per appuntamenti di oggi
      let stato;
      const oraCorrente = new Date().getHours();
      
      if (dataInizio.getHours() < oraCorrente - 1) {
        // Appuntamenti passati sono probabilmente completati
        stato = faker.helpers.weightedArrayElement([
          { weight: 90, value: 'completato' },
          { weight: 10, value: 'cancellato' }
        ]);
      } else if (dataInizio.getHours() <= oraCorrente + 1) {
        // Appuntamenti vicini all'ora corrente sono confermati
        stato = faker.helpers.weightedArrayElement([
          { weight: 70, value: 'confermato' },
          { weight: 30, value: 'completato' }
        ]);
      } else {
        // Appuntamenti futuri sono confermati
        stato = 'confermato';
      }
      
      const appuntamento = {
        cliente: clienteRandom._id,
        operatore: operatoreRandom._id,
        servizi: serviziAppuntamento,
        dataOraInizio: dataInizio,
        dataOraFine: dataFine,
        stato: stato,
        note: faker.helpers.arrayElement([
          'Cliente abituale',
          'Prima volta',
          'Richiede trattamento specifico',
          'Cliente VIP',
          'Appuntamento di controllo',
          'Consigliato da altro cliente'
        ]),
        createdAt: faker.date.recent({ days: 7 }),
        updatedAt: new Date()
      };
      
      appuntamenti.push(appuntamento);
    }

    // Ordina gli appuntamenti per orario
    appuntamenti.sort((a, b) => a.dataOraInizio - b.dataOraInizio);

    await Appuntamento.insertMany(appuntamenti);
    
    console.log(`✅ ${appuntamenti.length} appuntamenti di oggi creati con successo!`);
    
    // Statistiche
    const completati = appuntamenti.filter(a => a.stato === 'completato').length;
    const confermati = appuntamenti.filter(a => a.stato === 'confermato').length;
    const prenotati = appuntamenti.filter(a => a.stato === 'prenotato').length;
    const cancellati = appuntamenti.filter(a => a.stato === 'cancellato').length;
    
    console.log(`📊 Statistiche appuntamenti di oggi:`);
    console.log(`   - Completati: ${completati}`);
    console.log(`   - Confermati: ${confermati}`);
    console.log(`   - Prenotati: ${prenotati}`);
    console.log(`   - Cancellati: ${cancellati}`);
    
    console.log(`⏰ Orari degli appuntamenti:`);
    appuntamenti.forEach(app => {
      const cliente = clienti.find(c => c._id.toString() === app.cliente.toString());
      const servizio = servizi.find(s => s._id.toString() === app.servizi[0].servizio.toString());
      console.log(`   ${app.dataOraInizio.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} - ${cliente.nome} ${cliente.cognome} - ${servizio.nome} (${app.stato})`);
    });

  } catch (error) {
    console.error('❌ Errore durante il seeding degli appuntamenti di oggi:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connessione al database chiusa');
  }
}

if (require.main === module) {
  seedAppuntamentiOggi();
}

module.exports = seedAppuntamentiOggi;
