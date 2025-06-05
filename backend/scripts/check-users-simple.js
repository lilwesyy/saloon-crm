const mongoose = require('mongoose');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/esteticacrm');
    console.log('Connected to MongoDB');
    
    const User = require('../src/models/user.model');
    
    const users = await User.find({});
    console.log('Total users found:', users.length);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}, Role: ${user.role}, Active: ${user.isActive}`);
    });
    
    const adminUsers = await User.find({ role: 'admin' });
    console.log('\nAdmin users found:', adminUsers.length);
    
    adminUsers.forEach((user, index) => {
      console.log(`Admin ${index + 1}. Username: ${user.username}, Active: ${user.isActive}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUsers();
