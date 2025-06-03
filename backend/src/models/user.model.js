const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

// Schema per gli utenti (operatori, amministratori)
const userSchema = new Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ruolo: { 
    type: String, 
    enum: ['admin', 'manager', 'operatore', 'receptionist'],
    default: 'operatore'
  },
  telefono: String,
  fotoProfilo: String,
  attivo: { type: Boolean, default: true },
  servizi: [{ type: Schema.Types.ObjectId, ref: 'Servizio' }], // servizi che l'operatore può svolgere
  ultimoAccesso: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware pre-save per la cifratura della password
userSchema.pre('save', function(next) {
  const user = this;
  
  // Aggiorna il campo updatedAt
  user.updatedAt = Date.now();
  
  // Se la password non è stata modificata, procedi
  if (!user.isModified('password')) return next();
  
  // Genera il salt e cifra la password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      
      // Sostituisci la password in chiaro con quella cifrata
      user.password = hash;
      next();
    });
  });
});

// Metodo per confrontare le password
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
