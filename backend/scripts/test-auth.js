const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testAuth() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/esteticacrm');
    console.log('✅ Connected to MongoDB');
    
    const User = require('../src/models/user.model');
    
    // Find all users
    const users = await User.find({}).select('username email ruolo isActive attivo');
    console.log('📋 Users found:', users.length);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. User: ${user.username || user.email}, Role: ${user.ruolo}, Active: ${user.isActive || user.attivo}`);
    });
    
    // Find admin user
    const adminUser = await User.findOne({ ruolo: 'admin' });
    
    if (adminUser) {
      console.log('\n✅ Admin user found:', adminUser.username || adminUser.email);
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: adminUser._id, email: adminUser.email, ruolo: adminUser.ruolo },
        process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
        { expiresIn: '24h' }
      );
      
      console.log('🔑 JWT Token generated successfully');
      console.log('Token length:', token.length);
      console.log('Token:', token.substring(0, 50) + '...');
      
      // Test token verification
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production');
        console.log('✅ Token verification successful');
        console.log('Decoded payload:', decoded);
      } catch (err) {
        console.log('❌ Token verification failed:', err.message);
      }
      
    } else {
      console.log('❌ No admin user found');
      
      // Let's check what users exist with different field names
      const allUsers = await User.find({});
      console.log('\n📋 All users with all fields:');
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}.`, JSON.stringify(user.toObject(), null, 2));
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testAuth();
