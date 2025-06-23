const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema per i clienti
const clienteSchema = new Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Inserire un indirizzo email valido'] 
  },
  telefono: { type: String, required: true },
  dataNascita: { type: Date },
  indirizzo: {
    via: String,
    citta: String,
    cap: String,
    provincia: String
  },
  note: String,
  consensoPrivacy: { type: Boolean, default: false },
  consensoMarketing: { type: Boolean, default: false },
  fotoProfilo: String,
  classificazione: {
    type: String,
    enum: ['nuovo', 'attivo', 'fedele', 'inattivo'],
    default: 'nuovo'
  },
  ultimaVisita: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware pre-save per aggiornare il campo updatedAt
clienteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cliente', clienteSchema);
