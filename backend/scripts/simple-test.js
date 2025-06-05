console.log('Test script running...');
console.log('Node version:', process.version);
console.log('Working directory:', process.cwd());
console.log('Environment MONGODB_URI:', process.env.MONGODB_URI);

try {
  const mongoose = require('mongoose');
  console.log('Mongoose loaded successfully');
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/saloon-crm')
    .then(() => {
      console.log('Connected to MongoDB');
      
      // Simple count query
      mongoose.connection.db.collection('appuntamentos').countDocuments()
        .then(count => {
          console.log('Total appointments in database:', count);
          process.exit(0);
        })
        .catch(err => {
          console.error('Error counting documents:', err);
          process.exit(1);
        });
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
} catch (error) {
  console.error('Error loading mongoose:', error);
  process.exit(1);
}
