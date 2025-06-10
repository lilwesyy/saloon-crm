const mongoose = require('mongoose');
require('dotenv').config();

// Connetti al database
// Quando lo script è eseguito in Docker l'hostname per MongoDB deve essere il nome del servizio
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/esteticacrm';

console.log(`🔌 Tentativo di connessione a MongoDB: ${MONGODB_URI}`);
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connesso a MongoDB'))
  .catch(err => console.error('❌ Errore connessione MongoDB:', err));

const Cliente = require('../src/models/cliente.model');
const Servizio = require('../src/models/servizio.model');
const Pagamento = require('../src/models/pagamento.model');

// Dati forniti: Cliente, indice servizio (0=primo servizio, 1=secondo servizio), importo, data
const datiPagamenti = [
  { nome: 'Wanda', cognome: 'Pischedda', indiceServizio: 1, importo: 140.00, data: '05/06/2025' },
  { nome: 'Serena', cognome: 'Marcelli', indiceServizio: 1, importo: 120.00, data: '18/05/2025' },
  { nome: 'Marita', cognome: 'Silvestro', indiceServizio: 1, importo: 95.00, data: '02/06/2025' },
  { nome: 'Cirino', cognome: 'Ferrarotti', indiceServizio: 0, importo: 80.00, data: '21/05/2025' },
  { nome: 'Irene', cognome: 'Rambaldi', indiceServizio: 1, importo: 80.00, data: '02/06/2025' }
];

function parseDataItaliana(dataString) {
  // Formato italiano: gg/mm/yyyy
  const parti = dataString.split('/');
  return new Date(`${parti[2]}-${parti[1]}-${parti[0]}`);
}

async function creaCliente(nome, cognome) {
  // Controlla se il cliente esiste già
  let cliente = await Cliente.findOne({ 
    nome: { $regex: new RegExp('^' + nome + '$', 'i') },
    cognome: { $regex: new RegExp('^' + cognome + '$', 'i') }
  });

  // Se non esiste, crealo
  if (!cliente) {
    console.log(`Cliente ${nome} ${cognome} non trovato, lo creo...`);
    cliente = new Cliente({
      nome: nome,
      cognome: cognome,
      email: `${nome.toLowerCase()}.${cognome.toLowerCase()}@example.com`,
      telefono: '+39' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0'),
      classificazione: 'attivo',
      dataNascita: new Date('1980-01-01'), // Data di nascita fittizia
      indirizzo: 'Via degli Esempi, 123',
      citta: 'Roma',
      cap: '00100',
      note: 'Cliente creato da script di seeding'
    });
    await cliente.save();
    console.log(`✅ Creato nuovo cliente: ${cliente.nome} ${cliente.cognome}`);
  } else {
    console.log(`✅ Cliente esistente: ${cliente.nome} ${cliente.cognome}`);
  }

  return cliente;
}

async function seedPagamentiSpecifici() {
  try {
    console.log('🔧 Avvio creazione pagamenti specifici...');

    // Recupera i servizi
    const servizi = await Servizio.find().sort({ _id: 1 }).limit(5);
    if (servizi.length === 0) {
      console.error('❌ Nessun servizio trovato! Esegui prima lo script seed-servizi.js');
      process.exit(1);
    }

    console.log(`📋 Trovati ${servizi.length} servizi: ${servizi.map(s => s.nome).join(', ')}`);

    const pagamentiCreati = [];

    // Crea ogni pagamento specifico
    for (const dato of datiPagamenti) {
      try {
        // 1. Trova o crea il cliente
        const cliente = await creaCliente(dato.nome, dato.cognome);

        // 2. Seleziona il servizio corretto dall'indice
        const servizioIndex = dato.indiceServizio;
        const servizio = servizi[servizioIndex] || null;

        if (!servizio && servizioIndex > 0) {
          console.warn(`⚠️ Servizio con indice ${servizioIndex} non trovato, uso il primo disponibile`);
        }

        // 3. Crea il pagamento
        const dataPagamento = parseDataItaliana(dato.data);
        
        const nuovoPagamento = new Pagamento({
          cliente: cliente._id,
          servizio: servizio ? servizio._id : undefined,
          importo: dato.importo,
          metodo: 'contanti',
          tipo: 'servizio',
          stato: 'completato',
          dataPagamento: dataPagamento,
          note: `Pagamento per ${cliente.nome} ${cliente.cognome} del ${dato.data}`
        });

        await nuovoPagamento.save();
        
        console.log(`✅ Creato pagamento: ${cliente.nome} ${cliente.cognome} - €${dato.importo.toFixed(2)} - ${dato.data}`);
        
        // Aggiungi al array dei pagamenti creati
        pagamentiCreati.push(nuovoPagamento);
      } catch (err) {
        console.error(`❌ Errore durante la creazione del pagamento per ${dato.nome} ${dato.cognome}:`, err);
      }
    }

    // Mostra dettagli dei pagamenti creati
    console.log('\n📊 Riepilogo pagamenti creati:');
    
    for (const pagamento of pagamentiCreati) {
      // Popola i riferimenti per la visualizzazione
      const pagamentoPopulato = await Pagamento.findById(pagamento._id)
        .populate('cliente')
        .populate('servizio');
      
      console.log(`- Cliente: ${pagamentoPopulato.cliente.nome} ${pagamentoPopulato.cliente.cognome}`);
      console.log(`  Servizio: ${pagamentoPopulato.servizio ? pagamentoPopulato.servizio.nome : 'N/A'}`);
      console.log(`  Importo: €${pagamentoPopulato.importo.toFixed(2)}`);
      console.log(`  Data: ${pagamentoPopulato.dataPagamento.toLocaleDateString('it-IT')}`);
      console.log(`  Stato: ${pagamentoPopulato.stato}`);
      console.log('  ---');
    }

    console.log(`\n✨ Creati con successo ${pagamentiCreati.length} pagamenti specifici`);

  } catch (error) {
    console.error('❌ Errore durante il seeding dei pagamenti specifici:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Esegui il seeding
seedPagamentiSpecifici();
