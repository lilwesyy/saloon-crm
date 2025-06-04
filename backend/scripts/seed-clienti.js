const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker/locale/it');

// Carica le variabili d'ambiente
dotenv.config();

// Importa il modello Cliente
const Cliente = require('../src/models/cliente.model');

// Funzione per generare un cliente casuale
const generaCliente = () => {
  const cognome = faker.person.lastName();
  const nome = faker.person.firstName();
  const genere = Math.random() > 0.5 ? 'female' : 'male';
  
  // Calcola una data casuale tra 18 e 80 anni fa
  const oggi = new Date();
  const anni = Math.floor(Math.random() * 62) + 18; // Età tra 18 e 80 anni
  const dataNascita = new Date(oggi);
  dataNascita.setFullYear(oggi.getFullYear() - anni);
  
  // Calcola una data casuale per ultima visita (da 1 giorno a 1 anno fa)
  const giorniIndietro = Math.floor(Math.random() * 365) + 1;
  const ultimaVisita = new Date();
  ultimaVisita.setDate(ultimaVisita.getDate() - giorniIndietro);
  
  // Determina la classificazione in base all'ultima visita
  let classificazione;
  if (giorniIndietro <= 30) {
    classificazione = 'attivo';
  } else if (giorniIndietro <= 90) {
    classificazione = 'fedele';
  } else if (giorniIndietro <= 180) {
    classificazione = Math.random() > 0.5 ? 'attivo' : 'inattivo';
  } else {
    classificazione = 'inattivo';
  }
  
  // Per i client nuovi (15% di probabilità)
  if (Math.random() < 0.15) {
    classificazione = 'nuovo';
  }

  return {
    nome,
    cognome,
    email: faker.internet.email({ firstName: nome, lastName: cognome }).toLowerCase(),
    telefono: faker.phone.number('+39 ### ### ####'),
    dataNascita,
    indirizzo: {
      via: faker.location.street(),
      citta: faker.location.city(),
      cap: faker.location.zipCode('#####'),
      provincia: faker.location.state().substring(0, 2).toUpperCase() // Prime due lettere della provincia
    },
    note: Math.random() < 0.7 ? faker.lorem.paragraph(1) : '',
    consensoPrivacy: Math.random() > 0.05, // 95% di probabilità di dare consenso privacy
    consensoMarketing: Math.random() > 0.4, // 60% di probabilità di dare consenso marketing
    fotoProfilo: Math.random() < 0.3 ? faker.image.url({
      height: 500,
      width: 500
    }) : '', // 30% ha una foto profilo
    classificazione,
    ultimaVisita: classificazione !== 'nuovo' ? ultimaVisita : null,
    createdAt: classificazione === 'nuovo' ? new Date() : new Date(ultimaVisita),
    updatedAt: new Date()
  };
};

// Funzione principale per eseguire il seed
const seedClienti = async () => {
  try {
    // Connetti al database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/esteticacrm', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('📊 Connesso al database MongoDB');

    // Ottieni il conteggio attuale dei clienti
    const clientiCount = await Cliente.countDocuments();
    console.log(`📌 Clienti esistenti nel database: ${clientiCount}`);

    // Chiedi quanti clienti generare se non specificato come argomento
    const numClienti = process.argv[2] ? parseInt(process.argv[2]) : 50;
    console.log(`🚀 Generazione di ${numClienti} nuovi clienti...`);

    const clienti = [];
    for (let i = 0; i < numClienti; i++) {
      clienti.push(generaCliente());
    }

    // Inserisci i clienti nel database
    const clientiInseriti = await Cliente.insertMany(clienti);
    console.log(`✅ ${clientiInseriti.length} clienti inseriti con successo!`);

    // Chiudi la connessione
    await mongoose.connection.close();
    console.log('🔌 Connessione al database chiusa');

    process.exit(0);
  } catch (error) {
    console.error('❌ Errore durante la generazione dei clienti:', error);
    process.exit(1);
  }
};

// Esegui la funzione di seed
seedClienti();
