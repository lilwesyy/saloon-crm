const mongoose = require('mongoose');
require('dotenv').config();

// Connetti al database
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/esteticacrm')
  .then(() => console.log('Connesso a MongoDB'))
  .catch(err => console.error('Errore connessione MongoDB:', err));

const Cliente = require('../src/models/cliente.model');
const Servizio = require('../src/models/servizio.model');
const Pagamento = require('../src/models/pagamento.model');

async function seedPagamenti() {
  try {
    console.log('🔧 Creazione pagamenti di test...');

    // Verifica se esistono già pagamenti
    const existingPagamenti = await Pagamento.countDocuments();
    if (existingPagamenti > 0) {
      console.log(`ℹ️  Esistono già ${existingPagamenti} pagamenti. Skippo la creazione.`);
      return;
    }

    // Ottieni alcuni clienti esistenti
    const clienti = await Cliente.find().limit(10);
    if (clienti.length === 0) {
      console.log('❌ Nessun cliente trovato. Esegui prima lo script seed-clienti.js');
      return;
    }

    // Ottieni alcuni servizi esistenti
    const servizi = await Servizio.find().limit(10);
    if (servizi.length === 0) {
      console.log('❌ Nessun servizio trovato. Esegui prima lo script seed-servizi.js');
      return;
    }

    // Array di metodi di pagamento
    const metodiPagamento = ['contanti', 'carta', 'bonifico', 'assegno', 'altro'];
    const tipiPagamento = ['servizio', 'prodotto', 'abbonamento', 'altro'];
    const statiPagamento = ['completato', 'rimborsato', 'annullato'];

    const pagamenti = [];

    // Genera pagamenti degli ultimi 3 mesi
    for (let i = 0; i < 50; i++) {
      // Data casuale negli ultimi 90 giorni
      const dataRandom = new Date();
      dataRandom.setDate(dataRandom.getDate() - Math.floor(Math.random() * 90));

      const clienteRandom = clienti[Math.floor(Math.random() * clienti.length)];
      const servizioRandom = Math.random() > 0.2 ? servizi[Math.floor(Math.random() * servizi.length)] : null; // 20% senza servizio
      const metodoRandom = metodiPagamento[Math.floor(Math.random() * metodiPagamento.length)];
      const tipoRandom = tipiPagamento[Math.floor(Math.random() * tipiPagamento.length)];
      
      // 85% completati, 10% rimborsati, 5% annullati
      let statoRandom = 'completato';
      const rand = Math.random();
      if (rand < 0.05) statoRandom = 'annullato';
      else if (rand < 0.15) statoRandom = 'rimborsato';

      // Importo tra 20 e 200 euro
      const importo = Math.floor(Math.random() * 180) + 20;

      const pagamento = {
        cliente: clienteRandom._id,
        servizio: servizioRandom ? servizioRandom._id : undefined,
        importo: importo,
        metodo: metodoRandom,
        tipo: tipoRandom,
        stato: statoRandom,
        dataPagamento: dataRandom,
        note: i % 5 === 0 ? `Note per pagamento ${i + 1}` : undefined
      };

      pagamenti.push(pagamento);
    }

    // Inserisci pagamenti nel database
    const result = await Pagamento.insertMany(pagamenti);
    console.log(`✅ Creati ${result.length} pagamenti di test`);

    // Mostra statistiche
    const stats = await Pagamento.aggregate([
      {
        $group: {
          _id: '$stato',
          count: { $sum: 1 },
          totale: { $sum: '$importo' }
        }
      }
    ]);

    console.log('\n📊 Statistiche pagamenti creati:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} pagamenti, €${stat.totale.toFixed(2)}`);
    });

  } catch (error) {
    console.error('❌ Errore durante la creazione dei pagamenti:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedPagamenti();
