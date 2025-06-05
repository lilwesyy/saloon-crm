const mongoose = require('mongoose');

async function simpleCheck() {
  try {
    console.log('Starting simple check...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/saloon-crm');
    console.log('Connected to database');
    
    // Carica i modelli
    require('../src/models/cliente.model');
    require('../src/models/servizio.model');
    const Appuntamento = require('../src/models/appuntamento.model');
    
    console.log('Models loaded');
    
    const count = await Appuntamento.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    console.log('Today:', today.toISOString());
    console.log('Tomorrow:', tomorrow.toISOString());
    
    const todayCount = await Appuntamento.countDocuments({
      dataOraInizio: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    console.log('Appointments today:', todayCount);
    
    if (todayCount > 0) {
      const appointments = await Appuntamento.find({
        dataOraInizio: {
          $gte: today,
          $lt: tomorrow
        }
      });
      
      console.log('Today appointments details:');
      appointments.forEach((app, i) => {
        console.log(`${i + 1}. ${app.dataOraInizio} - State: ${app.stato}`);
      });
    }
    
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

simpleCheck();
