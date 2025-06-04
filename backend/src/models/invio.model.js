const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema per tracciare gli invii delle campagne
const invioSchema = new Schema({
  campagna: { type: Schema.Types.ObjectId, ref: 'Campagna', required: true },
  cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
  
  tipo: { 
    type: String, 
    enum: ['email', 'sms'],
    required: true
  },
  
  // Contenuto inviato
  oggetto: String, // Per email
  messaggio: { type: String, required: true },
  destinatario: { type: String, required: true }, // Email o numero di telefono
  
  // Stato dell'invio
  stato: { 
    type: String, 
    enum: ['in_coda', 'inviato', 'consegnato', 'fallito', 'rimbalzato'],
    default: 'in_coda'
  },
  
  // Tracking
  dataInvio: Date,
  dataConsegna: Date,
  dataApertura: Date, // Per email
  dataClick: Date,
  dataRisposta: Date, // Per SMS
  
  // Errori
  errore: String,
  codiceErrore: String,
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indici per ottimizzazione query
invioSchema.index({ campagna: 1, cliente: 1 });
invioSchema.index({ stato: 1, dataInvio: 1 });
invioSchema.index({ destinatario: 1 });
invioSchema.index({ dataInvio: 1 });

// Middleware per aggiornare updatedAt
invioSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Invio', invioSchema);
