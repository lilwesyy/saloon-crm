const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Pagamento = require('../../src/models/pagamento.model');
const Cliente = require('../../src/models/cliente.model');
const User = require('../../src/models/user.model');
const Servizio = require('../../src/models/servizio.model');
const jwt = require('jsonwebtoken');

describe('API Pagamenti Integration Test', () => {
  let token;
  let adminUser;
  let cliente;
  let servizio;
  let pagamentoId;
  
  // Prima di tutti i test, crea un utente e genera un token
  beforeAll(async () => {
    // Crea un utente admin per i test
    adminUser = new User({
      nome: 'Admin',
      cognome: 'Test',
      email: 'admin.test.pagamenti@example.com',
      password: 'password123',
      ruolo: 'admin'
    });
    
    await adminUser.save();
    
    // Genera token JWT
    token = jwt.sign(
      { userId: adminUser._id, ruolo: adminUser.ruolo },
      process.env.JWT_SECRET || 'test_secret_key',
      { expiresIn: '1h' }
    );
    
    // Crea un cliente di test
    cliente = new Cliente({
      nome: 'Cliente',
      cognome: 'Test Pagamenti',
      email: 'cliente.test.pagamenti@example.com',
      telefono: '+39 123 456 7890',
      consensoPrivacy: true
    });
    await cliente.save();
    
    // Crea un servizio di test
    servizio = new Servizio({
      nome: 'Servizio Test Pagamenti',
      descrizione: 'Servizio per test pagamenti',
      prezzo: 50.00,
      durata: 60,
      categoria: 'Test'
    });
    await servizio.save();
  });
  
  // Dopo tutti i test, elimina gli utenti di test
  afterAll(async () => {
    await User.deleteMany({ email: { $regex: /test\.pagamenti/ } });
    await Cliente.deleteMany({ email: { $regex: /test\.pagamenti/ } });
    await Servizio.deleteMany({ nome: { $regex: /Test Pagamenti/ } });
    await Pagamento.deleteMany({});
    
    await mongoose.connection.close();
  });
  
  // Test per la creazione di un nuovo pagamento
  describe('POST /api/pagamenti', () => {
    it('dovrebbe creare un nuovo pagamento', async () => {
      const pagamentoData = {
        cliente: cliente._id,
        servizio: servizio._id,
        importo: 50.00,
        metodo: 'carta',
        tipo: 'servizio',
        stato: 'completato',
        note: 'Pagamento di test'
      };
      
      const response = await request(app)
        .post('/api/pagamenti')
        .set('Authorization', `Bearer ${token}`)
        .send(pagamentoData)
        .expect(201);
      
      expect(response.body.pagamento).toBeDefined();
      expect(response.body.pagamento.importo).toBe(50);
      expect(response.body.pagamento.cliente).toBe(cliente._id.toString());
      
      // Salva l'ID per i prossimi test
      pagamentoId = response.body.pagamento._id;
    });
    
    it('non dovrebbe creare un pagamento con dati mancanti', async () => {
      const pagamentoData = {
        // Mancano campi obbligatori
        importo: 50.00
      };
      
      const response = await request(app)
        .post('/api/pagamenti')
        .set('Authorization', `Bearer ${token}`)
        .send(pagamentoData)
        .expect(400);
      
      expect(response.body.errors).toBeDefined();
    });
  });
  
  // Test per ottenere tutti i pagamenti
  describe('GET /api/pagamenti', () => {
    it('dovrebbe ottenere tutti i pagamenti', async () => {
      const response = await request(app)
        .get('/api/pagamenti')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.pagamenti).toBeDefined();
      expect(Array.isArray(response.body.pagamenti)).toBeTruthy();
      expect(response.body.pagamenti.length).toBeGreaterThan(0);
    });
    
    it('dovrebbe filtrare pagamenti per cliente', async () => {
      const response = await request(app)
        .get(`/api/pagamenti?cliente=${cliente._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.pagamenti).toBeDefined();
      expect(Array.isArray(response.body.pagamenti)).toBeTruthy();
      expect(response.body.pagamenti.length).toBeGreaterThan(0);
      // Tutti i pagamenti devono essere per questo cliente
      response.body.pagamenti.forEach(pagamento => {
        expect(pagamento.cliente._id || pagamento.cliente).toBe(cliente._id.toString());
      });
    });
  });
  
  // Test per ottenere un singolo pagamento
  describe('GET /api/pagamenti/:id', () => {
    it('dovrebbe ottenere un pagamento specifico', async () => {
      const response = await request(app)
        .get(`/api/pagamenti/${pagamentoId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.pagamento).toBeDefined();
      expect(response.body.pagamento._id).toBe(pagamentoId);
    });
    
    it('dovrebbe restituire 404 per ID non esistente', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/pagamenti/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
  
  // Test per aggiornare un pagamento
  describe('PUT /api/pagamenti/:id', () => {
    it('dovrebbe aggiornare un pagamento esistente', async () => {
      const updatedData = {
        importo: 75.00,
        metodo: 'contanti',
        note: 'Pagamento aggiornato'
      };
      
      const response = await request(app)
        .put(`/api/pagamenti/${pagamentoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect(200);
      
      expect(response.body.pagamento).toBeDefined();
      expect(response.body.pagamento.importo).toBe(75);
      expect(response.body.pagamento.metodo).toBe('contanti');
      expect(response.body.pagamento.note).toBe('Pagamento aggiornato');
    });
  });
  
  // Test per il rimborso di un pagamento
  describe('POST /api/pagamenti/:id/rimborso', () => {
    it('dovrebbe rimborsare un pagamento', async () => {
      const rimborsoData = {
        motivo: 'Cliente insoddisfatto',
        importo: 75.00 // rimborso totale
      };
      
      const response = await request(app)
        .post(`/api/pagamenti/${pagamentoId}/rimborso`)
        .set('Authorization', `Bearer ${token}`)
        .send(rimborsoData)
        .expect(200);
      
      expect(response.body.pagamento).toBeDefined();
      expect(response.body.pagamento.stato).toBe('rimborsato');
      expect(response.body.pagamento.rimborso).toBeDefined();
      expect(response.body.pagamento.rimborso.motivo).toBe('Cliente insoddisfatto');
    });
  });
  
  // Test per le statistiche dei pagamenti
  describe('GET /api/pagamenti/stats', () => {
    it('dovrebbe ottenere le statistiche generali dei pagamenti', async () => {
      const response = await request(app)
        .get('/api/pagamenti/stats/overview')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body).toBeDefined();
      expect(response.body.totaleIncassi).toBeDefined();
      expect(response.body.conteggiPerMetodo).toBeDefined();
    });
    
    it('dovrebbe ottenere le statistiche mensili dei pagamenti', async () => {
      const response = await request(app)
        .get('/api/pagamenti/stats/mensili')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });
  
  // Test per eliminare un pagamento
  describe('DELETE /api/pagamenti/:id', () => {
    it('dovrebbe eliminare un pagamento', async () => {
      await request(app)
        .delete(`/api/pagamenti/${pagamentoId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      // Verifica che il pagamento sia stato eliminato
      const checkResponse = await request(app)
        .get(`/api/pagamenti/${pagamentoId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
