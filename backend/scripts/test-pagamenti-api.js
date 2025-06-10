const mongoose = require('mongoose');
require('dotenv').config();

async function testPagamentiAPI() {
  try {
    console.log('🧪 Test API Pagamenti...');
    
    // Connetti al database
    await mongoose.connect('mongodb://localhost:27017/esteticacrm');
    console.log('✅ Connesso al database');
    
    // Importa i modelli
    const Pagamento = require('../src/models/pagamento.model');
    const Cliente = require('../src/models/cliente.model');
    const Servizio = require('../src/models/servizio.model');
    
    // Verifica quanti pagamenti esistono
    const pagamentiCount = await Pagamento.countDocuments();
    console.log(`📊 Pagamenti esistenti: ${pagamentiCount}`);
    
    if (pagamentiCount === 0) {
      console.log('🔧 Creazione di alcuni pagamenti di test...');
      
      // Trova cliente e servizio
      const cliente = await Cliente.findOne();
      const servizio = await Servizio.findOne();
      
      if (!cliente) {
        console.log('❌ Nessun cliente trovato. Crea prima alcuni clienti.');
        return;
      }
      
      // Crea alcuni pagamenti di test
      const pagamentiTest = [
        {
          cliente: cliente._id,
          servizio: servizio ? servizio._id : undefined,
          importo: 80.00,
          metodo: 'carta',
          tipo: 'servizio',
          stato: 'completato',
          dataPagamento: new Date(),
          note: 'Pagamento di test 1'
        },
        {
          cliente: cliente._id,
          servizio: servizio ? servizio._id : undefined,
          importo: 120.00,
          metodo: 'contanti',
          tipo: 'servizio',
          stato: 'completato',
          dataPagamento: new Date(Date.now() - 24 * 60 * 60 * 1000), // ieri
          note: 'Pagamento di test 2'
        },
        {
          cliente: cliente._id,
          importo: 50.00,
          metodo: 'bonifico',
          tipo: 'prodotto',
          stato: 'rimborsato',
          dataPagamento: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 giorni fa
          note: 'Pagamento rimborsato'
        }
      ];
      
      const risultato = await Pagamento.insertMany(pagamentiTest);
      console.log(`✅ Creati ${risultato.length} pagamenti di test`);
    }
    
    // Ora testa l'API
    console.log('\n🌐 Test chiamate API...');
    
    // Test GET /api/pagamenti
    const http = require('http');
    const User = require('../src/models/user.model');
    const jwt = require('jsonwebtoken');
    
    // Trova un utente admin per generare il token
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ Nessun utente admin trovato');
      return;
    }
    
    const token = jwt.sign(
      { userId: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    // Test API call
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/pagamenti',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📡 Status Code: ${res.statusCode}`);
        
        try {
          const jsonData = JSON.parse(data);
          console.log(`📊 Pagamenti ricevuti: ${jsonData.length || 0}`);
          
          if (jsonData.length > 0) {
            console.log('\n📝 Primo pagamento:');
            console.log(`- Cliente: ${jsonData[0].cliente?.nome} ${jsonData[0].cliente?.cognome}`);
            console.log(`- Importo: €${jsonData[0].importo}`);
            console.log(`- Metodo: ${jsonData[0].metodo}`);
            console.log(`- Stato: ${jsonData[0].stato}`);
          }
          
          console.log('\n✅ Test API completato con successo!');
        } catch (e) {
          console.log('❌ Errore parsing JSON:', e.message);
          console.log('Raw response:', data);
        }
        
        mongoose.connection.close();
      });
    });
    
    req.on('error', (e) => {
      console.error('❌ Errore richiesta:', e.message);
      mongoose.connection.close();
    });
    
    req.end();
    
  } catch (error) {
    console.error('❌ Errore:', error);
    mongoose.connection.close();
  }
}

testPagamentiAPI();
