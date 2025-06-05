const mongoose = require('mongoose');
require('dotenv').config();

async function testTodayAPI() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/esteticacrm');
    console.log('✅ Connected to MongoDB');
    
    const Appuntamento = require('../src/models/appuntamento.model');
    const Cliente = require('../src/models/cliente.model');
    const Servizio = require('../src/models/servizio.model');
    const User = require('../src/models/user.model');
    
    // Check today's date format that API expects
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    console.log('📅 Today date string:', todayString);
    
    // Check appointments for today with the same filter the API uses
    const startOfDay = new Date(todayString);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(todayString);
    endOfDay.setHours(23, 59, 59, 999);
    
    console.log('📅 Date range:', {
      start: startOfDay.toISOString(),
      end: endOfDay.toISOString()
    });
    
    const todayAppointments = await Appuntamento.find({
      dataOraInizio: { $gte: startOfDay, $lte: endOfDay }
    })
    .populate('cliente', 'nome cognome email telefono')
    .populate('operatore', 'nome cognome')
    .populate('servizi.servizio', 'nome durata prezzo')
    .sort({ dataOraInizio: 1 });
    
    console.log('📋 Today appointments found:', todayAppointments.length);
    
    if (todayAppointments.length > 0) {
      console.log('\n📝 First 3 appointments:');
      todayAppointments.slice(0, 3).forEach((app, index) => {
        console.log(`${index + 1}. ${app.dataOraInizio.toISOString()} - Cliente: ${app.cliente?.nome} ${app.cliente?.cognome} - Stato: ${app.stato}`);
      });
      
      // Check the exact structure of the first appointment
      console.log('\n🔍 Structure of first appointment:');
      console.log(JSON.stringify(todayAppointments[0], null, 2));
    }
    
    // Now check how the API response would look
    console.log('\n📡 Simulating API response structure:');
    const apiResponse = {
      appuntamenti: todayAppointments,
      pagination: {
        current: 1,
        pages: Math.ceil(todayAppointments.length / 50),
        total: todayAppointments.length
      }
    };
    
    console.log('API Response pagination:', apiResponse.pagination);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testTodayAPI();
