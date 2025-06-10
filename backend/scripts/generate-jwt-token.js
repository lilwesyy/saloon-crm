const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function generateValidToken() {
  try {
    // Connetti al database
    await mongoose.connect('mongodb://localhost:27017/esteticacrm');
    
    const User = require('../src/models/user.model');
    
    // Trova un utente admin
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ Nessun utente admin trovato');
      return;
    }
    
    // Genera JWT token
    const token = jwt.sign(
      { 
        userId: adminUser._id, 
        role: adminUser.role,
        email: adminUser.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    console.log('✅ Token JWT generato:');
    console.log(token);
    console.log('\n👤 Utente:', adminUser.email);
    
    mongoose.connection.close();
    
    return token;
    
  } catch (error) {
    console.error('❌ Errore:', error);
    mongoose.connection.close();
  }
}

generateValidToken();
