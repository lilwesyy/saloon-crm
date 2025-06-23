// Configurazione dell'ambiente di test
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Disattiva i log durante i test per avere un output più pulito
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// Estende i matcher di Jest
expect.extend({
  toBeValidMongoId(received) {
    const pass = mongoose.Types.ObjectId.isValid(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid MongoDB ObjectId`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid MongoDB ObjectId`,
        pass: false,
      };
    }
  },
});

// Connessione al database di test prima di tutti i test
beforeAll(async () => {
  // Usa MongoDB in-memory server o un server esterno in base alla configurazione
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb://')) {
    // Usa un database esterno specificato in MONGODB_URI
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connesso al database di test esterno');
  } else {
    // Avvia un MongoDB in-memory server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connesso al database MongoDB in-memory');
  }
});

// Pulisci il database dopo ogni test
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Disconnettiti dal database dopo tutti i test
afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
    console.log('Database in-memory fermato');
  }
  console.log('Connessione al database di test chiusa');
});
