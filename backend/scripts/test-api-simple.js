const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

async function testAPI() {
  console.log('=== INIZIO Test API Appuntamenti semplice ===');
  try {
    console.log('=== Test API Appuntamenti semplice ===');
    
    // Connect to MongoDB per verificare i dati
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/esteticacrm');
    console.log('Connected to MongoDB');
    
    const Appuntamento = require('../src/models/appuntamento.model');
    const Cliente = require('../src/models/cliente.model');
    
    // Prima controlla direttamente nel DB
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    console.log('Checking appointments for:', today.toISOString().split('T')[0]);
    
    const appointmentsInDB = await Appuntamento.find({
      dataOraInizio: { $gte: today, $lt: tomorrow }
    }).populate('cliente', 'nome cognome');
    
    console.log('Appointments found in DB:', appointmentsInDB.length);
    appointmentsInDB.forEach((app, index) => {
      console.log(`${index + 1}. ${app.dataOraInizio.toISOString()} - Cliente: ${app.cliente?.nome} ${app.cliente?.cognome} - Stato: ${app.stato}`);
    });
    
    // Ora test l'API usando Node.js built-in http
    // Prima generiamo un token JWT valido
    const User = require('../src/models/user.model');
    const jwt = require('jsonwebtoken');
    
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found');
      return;
    }
    
    const token = jwt.sign(
      { userId: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    console.log('Generated JWT token for user:', adminUser.username);
    const todayStr = today.toISOString().split('T')[0];
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/appuntamenti?data=${todayStr}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    console.log('\n=== Testing API call ===');
    console.log('URL:', `http://localhost:3000${options.path}`);
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('API Response Status:', res.statusCode);
        console.log('API Response Headers:', res.headers);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('API Response Data:', JSON.stringify(jsonData, null, 2));
          console.log('Number of appointments from API:', jsonData.appuntamenti?.length || 0);
        } catch (e) {
          console.log('Raw response data:', data);
          console.log('Parse error:', e.message);
        }
        
        mongoose.connection.close();
      });
    });
    
    req.on('error', (e) => {
      console.error('API request error:', e.message);
      mongoose.connection.close();
    });
    
    req.end();
    
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

testAPI();
