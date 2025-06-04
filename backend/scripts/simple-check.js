const mongoose = require('mongoose');
const User = require('../src/models/user.model');

mongoose.connect('mongodb://saloon-mongo:27017/esteticacrm')
  .then(async () => {
    console.log('Connected to MongoDB');
    const users = await User.find();
    console.log('Users count:', users.length);
    
    if (users.length > 0) {
      console.log('\nUsers details:');
      users.forEach((user, i) => {
        console.log(`${i+1}. ${user.nome} ${user.cognome} - ${user.email} (${user.ruolo})`);
      });
    }
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
