const mongoose = require('mongoose');
const Servizio = require('../src/models/servizio.model');

// Configurazione database
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/esteticacrm';

// Servizi di esempio per centro estetico
const serviziEsempio = [
  {
    nome: 'Pulizia del Viso',
    descrizione: 'Trattamento di pulizia profonda del viso con estratzione comedoni',
    durata: 60,
    prezzo: 50,
    categoria: 'Viso',
    prenotabileOnline: true,
    attivo: true
  },
  {
    nome: 'Manicure',
    descrizione: 'Manicure completa con taglio, limatura e smalto',
    durata: 45,
    prezzo: 25,
    categoria: 'Mani',
    prenotabileOnline: true,
    attivo: true
  },
  {
    nome: 'Pedicure',
    descrizione: 'Pedicure completa con taglio, limatura e smalto',
    durata: 60,
    prezzo: 30,
    categoria: 'Piedi',
    prenotabileOnline: true,
    attivo: true
  },
  {
    nome: 'Trattamento Anti-età',
    descrizione: 'Trattamento viso specifico per contrastare i segni del tempo',
    durata: 75,
    prezzo: 80,
    categoria: 'Viso',
    prenotabileOnline: true,
    attivo: true
  },
  {
    nome: 'Massaggio Rilassante',
    descrizione: 'Massaggio corpo rilassante per sciogliere tensioni e stress',
    durata: 60,
    prezzo: 60,
    categoria: 'Corpo',
    prenotabileOnline: true,
    attivo: true
  },
  {
    nome: 'Epilazione Gambe',
    descrizione: 'Epilazione completa gambe con ceretta a caldo',
    durata: 45,
    prezzo: 35,
    categoria: 'Epilazione',
    prenotabileOnline: true,
    attivo: true
  },
  {
    nome: 'Sopracciglia',
    descrizione: 'Sistemazione e definizione sopracciglia',
    durata: 30,
    prezzo: 15,
    categoria: 'Viso',
    prenotabileOnline: true,
    attivo: true
  },
  {
    nome: 'Extension Ciglia',
    descrizione: 'Applicazione extension ciglia per uno sguardo intenso',
    durata: 90,
    prezzo: 70,
    categoria: 'Viso',
    prenotabileOnline: true,
    attivo: true
  }
];

async function seedServizi() {
  try {
    // Connessione al database
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connesso al database MongoDB');
    
    // Cancella servizi esistenti (opzionale)
    await Servizio.deleteMany({});
    console.log('Servizi esistenti cancellati');
    
    // Inserisci nuovi servizi
    const serviziInseriti = await Servizio.insertMany(serviziEsempio);
    console.log(`${serviziInseriti.length} servizi inseriti con successo:`);
    
    serviziInseriti.forEach(servizio => {
      console.log(`- ${servizio.nome} (${servizio.categoria}) - €${servizio.prezzo}`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('Errore durante il seeding dei servizi:', error);
    process.exit(1);
  }
}

// Esegui il seeding
seedServizi();
