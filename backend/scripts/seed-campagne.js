const mongoose = require('mongoose');
const { Faker, it, en } = require('@faker-js/faker');
const Campagna = require('../src/models/campagna.model');
const User = require('../src/models/user.model');
const Cliente = require('../src/models/cliente.model');

// Configurazione database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/esteticacrm';

// Configurazione faker con fallback per moduli mancanti
const faker = new Faker({ 
  locale: [it, en], // Usa italiano come priorità, inglese come fallback
  fallback: en 
});

// Template di esempio per campagne
const templateCampagne = [
  {
    email: {
      nomi: [
        'Benvenuto nel nostro centro estetico',
        'Offerta speciale per nuovi clienti',
        'È tempo di prenderti cura di te',
        'Trattamenti esclusivi per la tua bellezza',
        'Primavera: rinnova la tua pelle'
      ],
      oggetti: [
        'Benvenuto/a nel mondo della bellezza! 🌸',
        'Offerta speciale -30% per te',
        'È ora di coccolarti: scopri i nostri trattamenti',
        'Nuovo: trattamento viso antiage innovativo',
        'Primavera in bellezza: offerte imperdibili'
      ],
      messaggi: [
        'Ciao {{nome}}, benvenuto/a nel nostro centro estetico! Siamo felici di averti come nuovo cliente. Ti aspetta un mondo di trattamenti esclusivi per la tua bellezza.',
        'Caro/a {{nome}}, abbiamo un\'offerta speciale per te! Sconto del 30% su tutti i trattamenti viso per i nuovi clienti. Prenota subito!',
        'È arrivato il momento di prenderti cura di te, {{nome}}. Scopri i nostri trattamenti rilassanti e rigeneranti. Il tuo benessere è la nostra priorità.',
        'Novità esclusiva per te {{nome}}! Abbiamo introdotto il nuovo trattamento viso antiage con tecnologia avanzata. Prenota una consulenza gratuita.',
        'Primavera è sinonimo di rinnovamento, {{nome}}! Approfitta delle nostre offerte speciali per preparare la tua pelle alla bella stagione.'
      ]
    },
    sms: {
      nomi: [
        'Promemoria appuntamento',
        'Offerta flash weekend',
        'Compleanno speciale',
        'Richiamo trattamento',
        'Nuova promozione'
      ],
      messaggi: [
        'Ciao {{nome}}, ti ricordiamo il tuo appuntamento domani alle {{ora}}. A presto!',
        'FLASH WEEKEND {{nome}}! 20% di sconto su tutti i trattamenti. Solo oggi e domani! Prenota: 123-456-7890',
        'Tanti auguri {{nome}}! 🎉 Per il tuo compleanno ti regaliamo il 25% di sconto. Valido tutto il mese!',
        'Ciao {{nome}}, è passato un po\' dal tuo ultimo trattamento. Che ne dici di prenotare? Ti aspettiamo!',
        'Novità {{nome}}! Nuovo trattamento corpo detox disponibile. Info e prenotazioni: 123-456-7890'
      ]
    },
    promozione: {
      nomi: [
        'Promo Primavera - Pelle Radiosa',
        'Sconto Fedeltà Cliente',
        'Pacchetto Benessere Completo',
        'Offerta Duo - Porta un\'amica',
        'Settimana della Bellezza'
      ],
      oggetti: [
        'Primavera 2024: Pelle radiosa a -40%! 🌺',
        'Grazie per la tua fedeltà: sconto speciale',
        'Pacchetto Benessere: 5 trattamenti a prezzo speciale',
        'Porta un\'amica e risparmiate insieme!',
        'Settimana della Bellezza: 7 giorni di offerte esclusive'
      ],
      messaggi: [
        'Ciao {{nome}}! La primavera è arrivata ed è tempo di far risplendere la tua pelle. Approfitta del 40% di sconto sui trattamenti viso illuminanti!',
        'Gentile {{nome}}, la tua fedeltà è preziosa per noi. Ecco un 20% di sconto dedicato solo a te sui prossimi trattamenti.',
        'Pacchetto Benessere Completo per te {{nome}}: 5 trattamenti personalizzati a un prezzo speciale. Il tuo momento di relax ti aspetta!',
        'Ciao {{nome}}! Porta la tua migliore amica e ottenete entrambe il 25% di sconto sui trattamenti. Condividere la bellezza è ancora più bello!',
        'È iniziata la Settimana della Bellezza {{nome}}! 7 giorni di offerte esclusive su tutti i nostri servizi. Non perdere questa occasione!'
      ]
    },
    compleanno: {
      nomi: [
        'Buon Compleanno - Regalo Speciale',
        'Auguri di Bellezza',
        'Il tuo giorno speciale',
        'Compleanno VIP'
      ],
      oggetti: [
        'Buon Compleanno {{nome}}! 🎂 Un regalo speciale ti aspetta',
        'Auguri {{nome}}! La bellezza è il miglior regalo',
        'Oggi è il tuo giorno speciale {{nome}}! 🎉',
        'Compleanno VIP per {{nome}} - Trattamento omaggio'
      ],
      messaggi: [
        'Buon Compleanno {{nome}}! 🎂 Nel tuo giorno speciale ti regaliamo un trattamento viso gratuito. Prenota entro il mese!',
        'Tanti auguri {{nome}}! 🎉 Per celebrare il tuo compleanno abbiamo un regalo speciale: 50% di sconto su tutti i trattamenti corpo!',
        'Oggi è il tuo giorno {{nome}}! Cosa c\'è di meglio di coccolarsi nel giorno del compleanno? Ti aspetta un regalo di bellezza esclusivo!',
        'Compleanno VIP per te {{nome}}! 👑 Trattamento viso antiage in omaggio + 30% su tutti gli altri servizi. Buon compleanno!'
      ]
    }
  }
];

// Configurazioni di segmentazione
const segmentazioni = [
  { tipo: 'tutti', descrizione: 'Tutti i clienti' },
  { tipo: 'nuovi_clienti', descrizione: 'Clienti registrati negli ultimi 30 giorni' },
  { tipo: 'clienti_fedeli', descrizione: 'Clienti con più di 5 appuntamenti' },
  { tipo: 'clienti_inattivi', descrizione: 'Clienti senza appuntamenti da 60+ giorni' },
  { tipo: 'compleanno', descrizione: 'Clienti che compiono gli anni oggi' }
];

// Funzione per generare statistiche realistiche
function generaStatistiche(tipo, stato) {
  const base = {
    invii: 0,
    aperture: 0,
    click: 0,
    risposte: 0,
    conversioni: 0
  };

  if (stato === 'bozza' || stato === 'programmata') {
    return base;
  }

  // Genera statistiche basate sul tipo e stato
  const invii = faker.number.int({ min: 50, max: 500 });
  const aperture = Math.floor(invii * faker.number.float({ min: 0.15, max: 0.45 }));
  const click = Math.floor(aperture * faker.number.float({ min: 0.05, max: 0.25 }));
  const risposte = tipo === 'sms' ? Math.floor(invii * faker.number.float({ min: 0.02, max: 0.15 })) : 0;
  const conversioni = Math.floor(click * faker.number.float({ min: 0.05, max: 0.30 }));

  return {
    invii,
    aperture,
    click,
    risposte,
    conversioni
  };
}

// Funzione per generare una campagna
function generaCampagna(createdBy, template, tipo) {
  const stati = ['bozza', 'programmata', 'in_corso', 'completata', 'sospesa'];
  const stato = faker.helpers.arrayElement(stati);
  
  const tipoTemplate = template[tipo];
  const nomeIndex = faker.number.int({ min: 0, max: tipoTemplate.nomi.length - 1 });
  
  let campagna = {
    nome: tipoTemplate.nomi[nomeIndex],
    descrizione: faker.lorem.sentences(2),
    tipo: tipo,
    stato: stato,
    messaggio: tipoTemplate.messaggi[nomeIndex],
    createdBy: createdBy,
    statistiche: generaStatistiche(tipo, stato)
  };

  // Aggiungi oggetto per email e promozioni
  if (tipo === 'email' || tipo === 'promozione' || tipo === 'compleanno') {
    campagna.oggetto = tipoTemplate.oggetti[nomeIndex];
    campagna.templateHtml = `<html><body><h2>${campagna.oggetto}</h2><p>${campagna.messaggio}</p><p>Cordiali saluti,<br/>Il team del Centro Estetico</p></body></html>`;
  }

  // Aggiungi segmentazione
  const segmentazione = faker.helpers.arrayElement(segmentazioni);
  campagna.segmenti = [{
    tipo: segmentazione.tipo,
    criteri: segmentazione.tipo === 'custom' ? { 
      classificazione: faker.helpers.arrayElement(['nuovo', 'attivo', 'fedele']) 
    } : null
  }];

  // Aggiungi programmazione per campagne non in bozza
  if (stato !== 'bozza') {
    const dataInizio = faker.date.between({ 
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
    });
    
    campagna.dataInizio = dataInizio;
    campagna.oraInvio = faker.helpers.arrayElement(['09:00', '10:30', '14:00', '16:30', '18:00']);
    
    if (faker.datatype.boolean(0.3)) {
      campagna.dataFine = faker.date.future({ days: 30, refDate: dataInizio });
      campagna.ricorrenza = {
        tipo: faker.helpers.arrayElement(['settimanale', 'mensile']),
        giorni: tipo === 'settimanale' ? [1, 3, 5] : undefined,
        giornoMese: tipo === 'mensile' ? faker.number.int({ min: 1, max: 28 }) : undefined
      };
    }
  }

  // Aggiungi timestamp realistici
  const createdAt = faker.date.between({ 
    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), 
    to: new Date() 
  });
  
  campagna.createdAt = createdAt;
  campagna.updatedAt = faker.date.between({ from: createdAt, to: new Date() });

  return campagna;
}

// Funzione principale per eseguire il seed
async function seedCampagne() {
  try {
    // Connetti al database
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('📊 Connesso al database MongoDB');

    // Verifica se esistono utenti admin
    const adminUsers = await User.find({ ruolo: 'admin' });
    if (adminUsers.length === 0) {
      console.log('❌ Nessun utente admin trovato. Esegui prima create-admin.js');
      process.exit(1);
    }

    // Ottieni il conteggio attuale delle campagne
    const campagneCount = await Campagna.countDocuments();
    console.log(`📌 Campagne esistenti nel database: ${campagneCount}`);

    // Chiedi quante campagne generare
    const numCampagne = process.argv[2] ? parseInt(process.argv[2]) : 20;
    
    if (numCampagne <= 0) {
      console.log('❌ Numero di campagne non valido');
      process.exit(1);
    }

    console.log(`🎯 Generazione di ${numCampagne} campagne di esempio...`);

    // Genera campagne
    const campagneDaInserire = [];
    const tipiCampagna = ['email', 'sms', 'promozione', 'compleanno'];
    
    for (let i = 0; i < numCampagne; i++) {
      const createdBy = faker.helpers.arrayElement(adminUsers)._id;
      const tipo = faker.helpers.arrayElement(tipiCampagna);
      
      const campagna = generaCampagna(createdBy, templateCampagne[0], tipo);
      campagneDaInserire.push(campagna);
    }

    // Inserisci le campagne nel database
    const campagneInserite = await Campagna.insertMany(campagneDaInserire);
    
    console.log(`✅ ${campagneInserite.length} campagne inserite con successo!`);
    
    // Mostra statistiche per tipo
    const statistichePerTipo = {};
    campagneInserite.forEach(campagna => {
      if (!statistichePerTipo[campagna.tipo]) {
        statistichePerTipo[campagna.tipo] = 0;
      }
      statistichePerTipo[campagna.tipo]++;
    });

    console.log('\n📈 Statistiche per tipo:');
    Object.keys(statistichePerTipo).forEach(tipo => {
      console.log(`   ${tipo}: ${statistichePerTipo[tipo]} campagne`);
    });

    // Mostra statistiche per stato
    const statistichePerStato = {};
    campagneInserite.forEach(campagna => {
      if (!statistichePerStato[campagna.stato]) {
        statistichePerStato[campagna.stato] = 0;
      }
      statistichePerStato[campagna.stato]++;
    });

    console.log('\n🎯 Statistiche per stato:');
    Object.keys(statistichePerStato).forEach(stato => {
      console.log(`   ${stato}: ${statistichePerStato[stato]} campagne`);
    });

    console.log('\n🎉 Seeding delle campagne completato!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Errore durante il seeding delle campagne:', error);
    process.exit(1);
  }
}

// Gestione dei segnali per chiusura pulita
process.on('SIGINT', async () => {
  console.log('\n⚠️ Interruzione rilevata, chiusura connessione...');
  await mongoose.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️ Terminazione rilevata, chiusura connessione...');
  await mongoose.disconnect();
  process.exit(0);
});

// Esegui il seeding se il file è chiamato direttamente
if (require.main === module) {
  seedCampagne();
}

module.exports = seedCampagne;
