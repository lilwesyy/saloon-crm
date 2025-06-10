const mongoose = require('mongoose');
require('dotenv').config();

async function createTestPagamenti() {
  try {
    console.log('🔧 Creazione pagamenti di test...');
    
    // Connetti al database usando la stringa di connessione del container
    await mongoose.connect('mongodb://mongodb:27017/esteticacrm');
    console.log('✅ Connesso al database');
    
    const Cliente = require('../src/models/cliente.model');
    const Servizio = require('../src/models/servizio.model');
    const Pagamento = require('../src/models/pagamento.model');
    
    // Controlla se esistono già pagamenti
    const existingCount = await Pagamento.countDocuments();
    console.log(`📊 Pagamenti esistenti: ${existingCount}`);
    
    if (existingCount > 0) {
      console.log('ℹ️  Pagamenti già presenti, skippo la creazione');
      await mongoose.connection.close();
      return;
    }
    
    // Trova clienti
    const clienti = await Cliente.find().limit(5);
    console.log(`👥 Clienti trovati: ${clienti.length}`);
    
    if (clienti.length === 0) {
      // Crea un cliente di test se non esiste
      const clienteTest = new Cliente({
        nome: 'Mario',
        cognome: 'Rossi',
        telefono: '+39 123 456 7890',
        email: 'mario.rossi@email.com',
        consensoPrivacy: true
      });
      await clienteTest.save();
      clienti.push(clienteTest);
      console.log('✅ Creato cliente di test');
    }
    
    // Trova servizi
    const servizi = await Servizio.find().limit(5);
    console.log(`🛍️  Servizi trovati: ${servizi.length}`);
    
    if (servizi.length === 0) {
      // Crea un servizio di test se non esiste
      const servizioTest = new Servizio({
        nome: 'Manicure Base',
        descrizione: 'Trattamento unghie base',
        prezzo: 25.00,
        durata: 60,
        categoria: 'Mani',
        attivo: true
      });
      await servizioTest.save();
      servizi.push(servizioTest);
      console.log('✅ Creato servizio di test');
    }
    
    // Crea pagamenti di test
    const pagamentiTest = [
      {
        cliente: clienti[0]._id,
        servizio: servizi[0]._id,
        importo: 85.50,
        metodo: 'carta',
        tipo: 'servizio',
        stato: 'completato',
        dataPagamento: new Date(),
        note: 'Trattamento viso completo'
      },
      {
        cliente: clienti[0]._id,
        servizio: servizi[0]._id,
        importo: 120.00,
        metodo: 'contanti',
        tipo: 'servizio',
        stato: 'completato',
        dataPagamento: new Date(Date.now() - 24*60*60*1000), // ieri
        note: 'Manicure deluxe'
      },
      {
        cliente: clienti[0]._id,
        importo: 65.00,
        metodo: 'bonifico',
        tipo: 'prodotto',
        stato: 'rimborsato',
        dataPagamento: new Date(Date.now() - 7*24*60*60*1000), // una settimana fa
        note: 'Crema viso - rimborsata per difetto'
      },
      {
        cliente: clienti[0]._id,
        servizio: servizi[0]._id,
        importo: 45.00,
        metodo: 'carta',
        tipo: 'servizio',
        stato: 'annullato',
        dataPagamento: new Date(Date.now() - 3*24*60*60*1000), // 3 giorni fa
        note: 'Appuntamento cancellato dal cliente'
      },
      {
        cliente: clienti[0]._id,
        importo: 150.00,
        metodo: 'contanti',
        tipo: 'abbonamento',
        stato: 'completato',
        dataPagamento: new Date(Date.now() - 10*24*60*60*1000), // 10 giorni fa
        note: 'Pacchetto 5 trattamenti'
      }
    ];
    
    const result = await Pagamento.insertMany(pagamentiTest);
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
    
    console.log('\n📊 Statistiche pagamenti:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} pagamenti, €${stat.totale.toFixed(2)}`);
    });
    
  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Connessione chiusa');
  }
}

createTestPagamenti();
