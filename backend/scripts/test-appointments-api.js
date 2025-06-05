const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// First let's check what the API returns directly
async function testAppointmentsAPI() {
  try {
    console.log('=== Test diretto API Appuntamenti ===');
    
    // Generate a test token first
    const User = require('../src/models/user.model');
    const jwt = require('jsonwebtoken');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/esteticacrm');
    console.log('Connected to MongoDB');
    
    // Find any admin user to generate token
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found');
      return;
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    console.log('Generated token for user:', adminUser.username);
    
    // Test API call
    const today = new Date().toISOString().split('T')[0];
    console.log('Calling API for date:', today);
    
    const response = await axios.get('http://localhost:3001/api/appuntamenti', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        data: today
      }
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));
    console.log('Number of appointments returned:', response.data.appuntamenti?.length || 0);
    
    // Also test without date filter to see all appointments
    console.log('\n=== Test without date filter ===');
    const responseAll = await axios.get('http://localhost:3001/api/appuntamenti', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('All appointments count:', responseAll.data.appuntamenti?.length || 0);
    
    // Show first few appointments with dates
    if (responseAll.data.appuntamenti && responseAll.data.appuntamenti.length > 0) {
      console.log('\nFirst 3 appointments:');
      responseAll.data.appuntamenti.slice(0, 3).forEach((app, index) => {
        console.log(`${index + 1}. Date: ${app.dataOraInizio}, Client: ${app.cliente?.nome} ${app.cliente?.cognome}, Status: ${app.stato}`);
      });
    }
    
  } catch (error) {
    console.error('Error testing API:', error.response?.data || error.message);
  } finally {
    mongoose.connection.close();
  }
}

testAppointmentsAPI();
