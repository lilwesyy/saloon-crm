const mongoose = require('mongoose');

async function checkAppointments() {
  try {
    console.log('🔗 Tentando connessione al database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/saloon-crm');
    console.log('✅ Connesso al database');
    
    console.log('📁 Caricando modelli...');
    const Appuntamento = require('../src/models/appuntamento.model');
    const Cliente = require('../src/models/cliente.model');
    const Servizio = require('../src/models/servizio.model');
    console.log('✅ Modelli caricati con successo');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    console.log('📅 Data di oggi:', today.toISOString());
    console.log('📅 Data di domani:', tomorrow.toISOString());
    
    const todayAppointments = await Appuntamento.find({
      dataOraInizio: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('cliente').populate('servizi.servizio');
    
    console.log('📊 Appuntamenti di oggi trovati:', todayAppointments.length);
    
    if (todayAppointments.length > 0) {
      console.log('\n📅 Lista appuntamenti di oggi:');
      todayAppointments.forEach((app, index) => {
        console.log(`\n${index + 1}. Appuntamento:`);
        console.log('  - ID:', app._id);
        console.log('  - Data/Ora:', app.dataOraInizio);
        console.log('  - Cliente:', app.cliente ? app.cliente.nome + ' ' + app.cliente.cognome : 'Nessun cliente');
        console.log('  - Stato:', app.stato);
        console.log('  - Servizi:', app.servizi.length);
        if (app.servizi.length > 0) {
          app.servizi.forEach((serv, i) => {
            console.log(`    ${i + 1}. ${serv.servizio ? serv.servizio.nome : 'Servizio non trovato'}`);
          });
        }
      });
    } else {
      console.log('\n❌ Nessun appuntamento trovato per oggi');
      
      // Controlliamo se ci sono appuntamenti in generale
      const totalAppointments = await Appuntamento.countDocuments();
      console.log('📊 Totale appuntamenti nel database:', totalAppointments);
      
      if (totalAppointments > 0) {
        const latestAppointments = await Appuntamento.find().sort({ dataOraInizio: -1 }).limit(3);
        console.log('\n📅 Ultimi 3 appuntamenti nel database:');
        latestAppointments.forEach((app, index) => {
          console.log(`${index + 1}. ${app.dataOraInizio} - Stato: ${app.stato}`);
        });
      }
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Errore:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkAppointments();
