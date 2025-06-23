const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');

// Test completo del flusso principale dell'applicazione
describe('Test E2E: Flusso principale', () => {
  let token;
  let adminId;
  let clienteId;
  let operatoreId;
  let servizioId;
  let appuntamentoId;
  
  // Prima di tutti i test, prepara un ambiente pulito
  beforeAll(async () => {
    // Connessione al database
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/esteticacrm_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
    
    // Pulisci il database
    await mongoose.connection.dropDatabase();
    
    // Crea un token di test
    adminId = new mongoose.Types.ObjectId();
    token = jwt.sign(
      { userId: adminId, ruolo: 'admin' },
      process.env.JWT_SECRET || 'test_secret_key',
      { expiresIn: '1d' }
    );
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  describe('1. Creazione e gestione utente', () => {
    it('dovrebbe creare un utente amministratore', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Admin',
          cognome: 'Test',
          email: 'admin.e2e@example.com',
          password: 'Password123!',
          ruolo: 'admin'
        })
        .expect(201);
      
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('admin.e2e@example.com');
      expect(response.body.token).toBeDefined();
      
      // Salva il token per i test successivi
      token = response.body.token;
    });
    
    it('dovrebbe creare un operatore', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Operatore',
          cognome: 'Test',
          email: 'operatore.e2e@example.com',
          password: 'Password123!',
          ruolo: 'operatore'
        })
        .expect(201);
      
      expect(response.body._id).toBeDefined();
      expect(response.body.email).toBe('operatore.e2e@example.com');
      expect(response.body.ruolo).toBe('operatore');
      
      // Salva l'ID dell'operatore
      operatoreId = response.body._id;
    });
  });
  
  describe('2. Creazione e gestione cliente', () => {
    it('dovrebbe creare un nuovo cliente', async () => {
      const response = await request(app)
        .post('/api/clienti')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Cliente',
          cognome: 'E2E',
          email: 'cliente.e2e@example.com',
          telefono: '+39 333 1234567',
          consensoPrivacy: true,
          consensoMarketing: true
        })
        .expect(201);
      
      expect(response.body._id).toBeDefined();
      expect(response.body.email).toBe('cliente.e2e@example.com');
      expect(response.body.classificazione).toBe('nuovo');
      
      // Salva l'ID del cliente
      clienteId = response.body._id;
    });
    
    it('dovrebbe recuperare il cliente creato', async () => {
      const response = await request(app)
        .get(`/api/clienti/${clienteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body._id).toBe(clienteId);
      expect(response.body.nome).toBe('Cliente');
      expect(response.body.cognome).toBe('E2E');
    });
  });
  
  describe('3. Creazione e gestione servizio', () => {
    it('dovrebbe creare un nuovo servizio', async () => {
      const response = await request(app)
        .post('/api/servizi')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Trattamento E2E',
          descrizione: 'Servizio di test per E2E',
          durata: 60,
          prezzo: 50,
          categoria: 'Test'
        })
        .expect(201);
      
      expect(response.body._id).toBeDefined();
      expect(response.body.nome).toBe('Trattamento E2E');
      expect(response.body.durata).toBe(60);
      expect(response.body.prezzo).toBe(50);
      
      // Salva l'ID del servizio
      servizioId = response.body._id;
    });
    
    it('dovrebbe recuperare il servizio creato', async () => {
      const response = await request(app)
        .get(`/api/servizi/${servizioId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body._id).toBe(servizioId);
      expect(response.body.nome).toBe('Trattamento E2E');
    });
  });
  
  describe('4. Creazione e gestione appuntamento', () => {
    it('dovrebbe creare un nuovo appuntamento', async () => {
      const dataInizio = new Date();
      dataInizio.setDate(dataInizio.getDate() + 1); // Domani
      const dataFine = new Date(dataInizio.getTime() + 60 * 60000); // +60 minuti
      
      const response = await request(app)
        .post('/api/appuntamenti')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cliente: clienteId,
          servizi: [{ servizio: servizioId, prezzo: 50 }],
          operatore: operatoreId,
          dataOraInizio: dataInizio.toISOString(),
          dataOraFine: dataFine.toISOString(),
          stato: 'prenotato',
          note: 'Appuntamento creato tramite test E2E'
        })
        .expect(201);
      
      expect(response.body._id).toBeDefined();
      expect(response.body.cliente).toBe(clienteId);
      expect(response.body.stato).toBe('prenotato');
      
      // Salva l'ID dell'appuntamento
      appuntamentoId = response.body._id;
    });
    
    it('dovrebbe aggiornare lo stato dell\'appuntamento', async () => {
      const response = await request(app)
        .put(`/api/appuntamenti/${appuntamentoId}/stato`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          stato: 'confermato'
        })
        .expect(200);
      
      expect(response.body.stato).toBe('confermato');
    });
  });
  
  describe('5. Creazione e gestione pagamento', () => {
    it('dovrebbe registrare un pagamento per l\'appuntamento', async () => {
      const response = await request(app)
        .post(`/api/pagamenti`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          cliente: clienteId,
          servizio: servizioId,
          importo: 50,
          metodo: 'carta',
          tipo: 'servizio',
          stato: 'completato',
          note: 'Pagamento test E2E'
        })
        .expect(201);
      
      expect(response.body._id).toBeDefined();
      expect(response.body.cliente).toBe(clienteId);
      expect(response.body.importo).toBe(50);
      expect(response.body.stato).toBe('completato');
    });
  });
  
  describe('6. Programma fedeltà', () => {
    it('dovrebbe creare un programma fedeltà per il cliente', async () => {
      const response = await request(app)
        .post('/api/programma-fedelta')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cliente: clienteId,
          punti: 50
        })
        .expect(201);
      
      expect(response.body._id).toBeDefined();
      expect(response.body.cliente).toBe(clienteId);
      expect(response.body.punti).toBe(50);
      expect(response.body.livello).toBe('bronzo');
    });
  });
});
