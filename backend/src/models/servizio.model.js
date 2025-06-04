const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema per i servizi/trattamenti
const servizioSchema = new Schema({
  nome: { type: String, required: true },
  descrizione: { type: String },
  durata: { type: Number, required: true }, // durata in minuti
  prezzo: { type: Number, required: true },
  categoria: { type: String, required: true },
  immagine: String,
  attivo: { type: Boolean, default: true },
  prenotabileOnline: { type: Boolean, default: false }, // se il servizio è prenotabile online
  tempoRecupero: { type: Number, default: 0 }, // tempo di recupero in minuti
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware pre-save per aggiornare il campo updatedAt
servizioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Servizio', servizioSchema);
