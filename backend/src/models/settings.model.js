const mongoose = require('mongoose');

// Schema per le impostazioni di sistema
const settingsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['system', 'user'],
    default: 'system'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.type === 'user'; }
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware pre-save per aggiornare il campo updatedAt
settingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Impostazioni di sistema predefinite
settingsSchema.statics.getDefaultSystemSettings = function() {
  return {
    businessName: 'Centro Estetico Bellezza',
    businessPhone: '+39 123 456 7890',
    businessEmail: 'info@centroestetico.it',
    businessAddress: 'Via Roma 123, 00100 Roma, Italia',
    openingHours: 'Lun-Ven: 9:00-19:00\nSabato: 9:00-13:00\nDomenica: Chiuso',
    onlineBookingEnabled: true
  };
};

// Impostazioni utente predefinite
settingsSchema.statics.getDefaultUserSettings = function() {
  return {
    notifications: {
      email: true,
      desktop: false
    }
  };
};

module.exports = mongoose.model('Settings', settingsSchema);
