const mongoose = require('mongoose');
const Appuntamento = require('../src/models/appuntamento.model');
const crypto = require('crypto');

// Crea un token valido di 32 caratteri
async function createValidToken() {
  try {
    await mongoose.connect('mongodb://saloon-mongo:27017/esteticacrm');
    console.log('✅ Connesso al database');
    
    const appuntamento = await Appuntamento.findById('68406b3a2f1e983d0f23da3a')
      .populate('cliente', 'nome cognome email');
      
    if (!appuntamento) {
      console.log('❌ Prenotazione non trovata');
      return;
    }
    
    console.log('📋 Prenotazione trovata:');
    console.log(`- Cliente: ${appuntamento.cliente.nome} ${appuntamento.cliente.cognome}`);
    console.log(`- Email: ${appuntamento.cliente.email}`);
    console.log(`- Stato: ${appuntamento.stato}`);
    
    // Creiamo un token di 32 caratteri con MD5 (solo per test)
    const prenotazioneId = appuntamento._id.toString();
    const clienteEmail = appuntamento.cliente.email;
    const originalToken = Buffer.from(prenotazioneId + clienteEmail).toString('base64');
    console.log(`Token originale: ${originalToken}`);
    
    // Creiamo un token compatibile con la validazione (32 caratteri)
    const tokenMd5 = crypto.createHash('md5').update(prenotazioneId + clienteEmail).digest('hex');
    console.log(`Token MD5 (32 caratteri): ${tokenMd5}`);
    
    // Aggiungiamo temporaneamente un campo token al documento per facilitare il test
    appuntamento.tokenTest = tokenMd5;
    await appuntamento.save();
    console.log(`✅ Token salvato nel documento per test`);
    
    // URL per la conferma
    console.log(`\n🔗 URL per confermare la prenotazione:`);
    console.log(`http://localhost:3000/api/prenotazione-online/${prenotazioneId}/conferma?token=${tokenMd5}`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Errore:', error.message);
  }
}

createValidToken();
