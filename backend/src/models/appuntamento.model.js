const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema per gli appuntamenti
const appuntamentoSchema = new Schema({
  cliente: { 
    type: Schema.Types.ObjectId, 
    ref: 'Cliente',
    required: true 
  },
  servizi: [{ 
    servizio: { type: Schema.Types.ObjectId, ref: 'Servizio', required: true },
    prezzo: { type: Number, required: true } // prezzo applicato (potrebbe essere scontato)
  }],
  operatore: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  dataOraInizio: { type: Date, required: true },
  dataOraFine: { type: Date, required: true },
  sala: { type: String },
  stato: { 
    type: String, 
    enum: ['prenotato', 'confermato', 'completato', 'cancellato', 'noshow'],
    default: 'prenotato'
  },
  note: String,
  reminderInviato: { type: Boolean, default: false },
  reminderConfig: {
    attivo: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    tempi: [{
      tipo: { type: String, enum: ['24h', '2h', '30m'], required: true },
      inviato: { type: Boolean, default: false }
    }]
  },
  pagamento: {
    stato: { type: String, enum: ['non_pagato', 'parziale', 'completato'], default: 'non_pagato' },
    metodo: { type: String, enum: ['contanti', 'carta', 'abbonamento', 'altro'] },
    importo: { type: Number },
    dataOra: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware pre-save per aggiornare il campo updatedAt
appuntamentoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indice per migliorare la performance della ricerca per data
appuntamentoSchema.index({ dataOraInizio: 1 });
appuntamentoSchema.index({ cliente: 1 });
appuntamentoSchema.index({ operatore: 1 });

module.exports = mongoose.model('Appuntamento', appuntamentoSchema);
