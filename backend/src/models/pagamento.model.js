const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pagamentoSchema = new Schema({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  servizio: {
    type: Schema.Types.ObjectId,
    ref: 'Servizio'
  },
  importo: {
    type: Number,
    required: true
  },
  metodo: {
    type: String,
    enum: ['contanti', 'carta', 'bonifico', 'assegno', 'altro'],
    default: 'contanti'
  },
  tipo: {
    type: String,
    enum: ['servizio', 'prodotto', 'abbonamento', 'altro'],
    default: 'servizio'
  },
  stato: {
    type: String,
    enum: ['completato', 'rimborsato', 'annullato'],
    default: 'completato'
  },
  dataPagamento: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indici per migliorare le performance delle queries frequenti
pagamentoSchema.index({ cliente: 1, dataPagamento: -1 });
pagamentoSchema.index({ dataPagamento: -1 });
pagamentoSchema.index({ stato: 1 });

const Pagamento = mongoose.model('Pagamento', pagamentoSchema);

module.exports = Pagamento;
