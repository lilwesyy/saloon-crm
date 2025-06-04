const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema per le campagne di marketing
const campagnaSchema = new Schema({
  nome: { type: String, required: true },
  descrizione: String,
  tipo: { 
    type: String, 
    enum: ['email', 'sms', 'promozione', 'compleanno', 'richiamo'],
    default: 'email'
  },
  stato: { 
    type: String, 
    enum: ['bozza', 'programmata', 'in_corso', 'completata', 'sospesa'],
    default: 'bozza'
  },
  
  // Contenuto della campagna
  oggetto: String, // Per email
  messaggio: { type: String, required: true },
  templateHtml: String, // Per email HTML
  
  // Programmazione
  dataInizio: Date,
  dataFine: Date,
  oraInvio: String, // Formato HH:MM
  ricorrenza: {
    tipo: { 
      type: String, 
      enum: ['nessuna', 'giornaliera', 'settimanale', 'mensile', 'annuale'],
      default: 'nessuna'
    },
    giorni: [Number], // Per ricorrenza settimanale (0-6, 0=domenica)
    giornoMese: Number, // Per ricorrenza mensile (1-31)
    giornoAnno: String // Per ricorrenza annuale (MM-DD)
  },
  
  // Targeting
  segmenti: [{
    tipo: { 
      type: String, 
      enum: ['tutti', 'nuovi_clienti', 'clienti_fedeli', 'clienti_inattivi', 'compleanno', 'custom']
    },
    criteri: Schema.Types.Mixed // Criteri di filtro personalizzati
  }],
  
  clientiTarget: [{ type: Schema.Types.ObjectId, ref: 'Cliente' }],
  
  // Statistiche
  statistiche: {
    invii: { type: Number, default: 0 },
    aperture: { type: Number, default: 0 }, // Per email
    click: { type: Number, default: 0 },
    risposte: { type: Number, default: 0 }, // Per SMS
    conversioni: { type: Number, default: 0 } // Appuntamenti prenotati
  },
  
  // Metadata
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  attiva: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indici per ottimizzazione query
campagnaSchema.index({ tipo: 1, stato: 1 });
campagnaSchema.index({ dataInizio: 1, dataFine: 1 });
campagnaSchema.index({ createdBy: 1 });

// Middleware per aggiornare updatedAt
campagnaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Campagna', campagnaSchema);
