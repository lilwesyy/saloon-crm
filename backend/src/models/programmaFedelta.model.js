const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema per il programma fedeltà
const programmFedeltaSchema = new Schema({
  cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true, unique: true },
  
  // Punti fedeltà
  punti: { type: Number, default: 0 },
  puntiTotaliGuadagnati: { type: Number, default: 0 },
  puntiUtilizzati: { type: Number, default: 0 },
  
  // Livello fedeltà
  livello: { 
    type: String, 
    enum: ['bronzo', 'argento', 'oro', 'platino'],
    default: 'bronzo'
  },
  
  // Storico movimenti punti
  movimenti: [{
    tipo: { 
      type: String, 
      enum: ['guadagno', 'utilizzo', 'scadenza', 'bonus', 'rettifica']
    },
    punti: Number,
    descrizione: String,
    appuntamento: { type: Schema.Types.ObjectId, ref: 'Appuntamento' },
    data: { type: Date, default: Date.now }
  }],
  
  // Premi utilizzati
  premiUtilizzati: [{
    nome: String,
    puntiUtilizzati: Number,
    dataUtilizzo: Date,
    appuntamento: { type: Schema.Types.ObjectId, ref: 'Appuntamento' }
  }],
  
  // Statistiche
  statistiche: {
    ultimoGuadagno: Date,
    ultimoUtilizzo: Date,
    mediaGuadagnoMensile: { type: Number, default: 0 },
    appuntamentiTotali: { type: Number, default: 0 },
    spesaTotale: { type: Number, default: 0 }
  },
  
  // Metadata
  attivo: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Metodi per calcolare il livello fedeltà
programmFedeltaSchema.methods.calcolaLivello = function() {
  const puntiTotali = this.puntiTotaliGuadagnati;
  
  if (puntiTotali >= 5000) return 'platino';
  if (puntiTotali >= 2000) return 'oro';
  if (puntiTotali >= 500) return 'argento';
  return 'bronzo';
};

// Metodi per aggiungere punti
programmFedeltaSchema.methods.aggiungiPunti = function(punti, descrizione, appuntamentoId = null) {
  this.punti += punti;
  this.puntiTotaliGuadagnati += punti;
  
  this.movimenti.push({
    tipo: 'guadagno',
    punti: punti,
    descrizione: descrizione,
    appuntamento: appuntamentoId
  });
  
  this.livello = this.calcolaLivello();
  this.statistiche.ultimoGuadagno = new Date();
  this.updatedAt = new Date();
};

// Metodi per utilizzare punti
programmFedeltaSchema.methods.utilizzaPunti = function(punti, descrizione, appuntamentoId = null) {
  if (this.punti < punti) {
    throw new Error('Punti insufficienti');
  }
  
  this.punti -= punti;
  this.puntiUtilizzati += punti;
  
  this.movimenti.push({
    tipo: 'utilizzo',
    punti: -punti,
    descrizione: descrizione,
    appuntamento: appuntamentoId
  });
  
  this.statistiche.ultimoUtilizzo = new Date();
  this.updatedAt = new Date();
};

// Indici per ottimizzazione query
programmFedeltaSchema.index({ cliente: 1 });
programmFedeltaSchema.index({ livello: 1, punti: -1 });
programmFedeltaSchema.index({ 'statistiche.ultimoGuadagno': 1 });

// Middleware per aggiornare updatedAt
programmFedeltaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ProgrammaFedelta', programmFedeltaSchema);
