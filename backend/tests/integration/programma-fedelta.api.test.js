const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const ProgrammaFedelta = require('../../src/models/programmaFedelta.model');
const Cliente = require('../../src/models/cliente.model');
const User = require('../../src/models/user.model');
const jwt = require('jsonwebtoken');

describe('API Programma Fedeltà Integration Test', () => {
  let adminToken;
  let operatorToken;
  let adminUser;
  let operatorUser;
  let cliente;
  let programmaId;
  
  // Prima di tutti i test, crea gli utenti, un cliente e i token
  beforeAll(async () => {
    // Crea un utente admin per i test
    adminUser = new User({
      nome: 'Admin',
      cognome: 'Test',
      email: 'admin.test.fedelta@example.com',
      password: 'password123',
      ruolo: 'admin'
    });
    await adminUser.save();
    
    // Crea un utente operatore per i test
    operatorUser = new User({
      nome: 'Operatore',
      cognome: 'Test',
      email: 'operatore.test.fedelta@example.com',
      password: 'password123',
      ruolo: 'operatore'
    });
    await operatorUser.save();
    
    // Genera token JWT per admin
    adminToken = jwt.sign(
      { userId: adminUser._id, ruolo: adminUser.ruolo },
      process.env.JWT_SECRET || 'test_secret_key',
      { expiresIn: '1h' }
    );
    
    // Genera token JWT per operatore
    operatorToken = jwt.sign(
      { userId: operatorUser._id, ruolo: operatorUser.ruolo },
      process.env.JWT_SECRET || 'test_secret_key',
      { expiresIn: '1h' }
    );
    
    // Crea un cliente di test
    cliente = new Cliente({
      nome: 'Cliente',
      cognome: 'Test Fedeltà',
      email: 'cliente.test.fedelta@example.com',
      telefono: '+39 123 456 7890',
      consensoPrivacy: true
    });
    await cliente.save();
  });
  
  // Dopo tutti i test, elimina i dati di test
  afterAll(async () => {
    await User.deleteMany({ email: { $regex: /test\.fedelta/ } });
    await Cliente.deleteMany({ email: { $regex: /test\.fedelta/ } });
    await ProgrammaFedelta.deleteMany({});
    await mongoose.connection.close();
  });
  
  // Test per creare un nuovo programma fedeltà per un cliente
  describe('POST /api/programma-fedelta', () => {
    it('dovrebbe creare un nuovo programma fedeltà', async () => {
      const programmaData = {
        cliente: cliente._id,
        puntiAccumulati: 0,
        livello: 'base',
        dataIscrizione: new Date().toISOString()
      };
      
      const response = await request(app)
        .post('/api/programma-fedelta')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(programmaData)
        .expect(201);
      
      expect(response.body.programma).toBeDefined();
      expect(response.body.programma.cliente.toString()).toBe(cliente._id.toString());
      expect(response.body.programma.puntiAccumulati).toBe(0);
      expect(response.body.programma.livello).toBe('base');
      
      // Salva l'ID per i prossimi test
      programmaId = response.body.programma._id;
    });
    
    it('non dovrebbe creare un programma fedeltà per un cliente già iscritto', async () => {
      const programmaData = {
        cliente: cliente._id,
        puntiAccumulati: 10,
        livello: 'base'
      };
      
      await request(app)
        .post('/api/programma-fedelta')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(programmaData)
        .expect(400);
    });
  });
  
  // Test per ottenere tutti i programmi fedeltà
  describe('GET /api/programma-fedelta', () => {
    it('dovrebbe ottenere tutti i programmi fedeltà', async () => {
      const response = await request(app)
        .get('/api/programma-fedelta')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body.programmi).toBeDefined();
      expect(Array.isArray(response.body.programmi)).toBeTruthy();
      expect(response.body.programmi.length).toBeGreaterThan(0);
    });
    
    it('dovrebbe filtrare i programmi per livello', async () => {
      const response = await request(app)
        .get('/api/programma-fedelta?livello=base')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body.programmi).toBeDefined();
      expect(Array.isArray(response.body.programmi)).toBeTruthy();
      // Tutti i programmi devono essere di livello "base"
      response.body.programmi.forEach(programma => {
        expect(programma.livello).toBe('base');
      });
    });
  });
  
  // Test per ottenere un singolo programma fedeltà
  describe('GET /api/programma-fedelta/:id', () => {
    it('dovrebbe ottenere un programma fedeltà specifico', async () => {
      const response = await request(app)
        .get(`/api/programma-fedelta/${programmaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body.programma).toBeDefined();
      expect(response.body.programma._id).toBe(programmaId);
    });
    
    it('dovrebbe restituire 404 per un ID non valido', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/programma-fedelta/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
  
  // Test per ottenere il programma fedeltà di un cliente
  describe('GET /api/programma-fedelta/cliente/:clienteId', () => {
    it('dovrebbe ottenere il programma fedeltà di un cliente specifico', async () => {
      const response = await request(app)
        .get(`/api/programma-fedelta/cliente/${cliente._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body.programma).toBeDefined();
      expect(response.body.programma.cliente._id || response.body.programma.cliente).toEqual(cliente._id.toString());
    });
    
    it('dovrebbe restituire 404 per un cliente senza programma fedeltà', async () => {
      const fakeClienteId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/programma-fedelta/cliente/${fakeClienteId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
  
  // Test per aggiungere punti ad un programma fedeltà
  describe('POST /api/programma-fedelta/:id/aggiungi-punti', () => {
    it('dovrebbe aggiungere punti ad un programma fedeltà', async () => {
      const data = {
        punti: 50,
        nota: 'Test aggiunta punti'
      };
      
      const response = await request(app)
        .post(`/api/programma-fedelta/${programmaId}/aggiungi-punti`)
        .set('Authorization', `Bearer ${operatorToken}`) // Anche l'operatore dovrebbe poter aggiungere punti
        .send(data)
        .expect(200);
      
      expect(response.body.programma).toBeDefined();
      expect(response.body.programma.puntiAccumulati).toBe(50);
      expect(response.body.programma.storicoPunti).toBeDefined();
      expect(response.body.programma.storicoPunti.length).toBeGreaterThan(0);
      expect(response.body.programma.storicoPunti[0].punti).toBe(50);
      expect(response.body.programma.storicoPunti[0].tipo).toBe('aggiunta');
    });
  });
  
  // Test per riscattare un premio
  describe('POST /api/programma-fedelta/:id/riscatta-premio', () => {
    it('dovrebbe riscattare un premio consumando punti', async () => {
      const data = {
        punti: 20,
        premio: 'Sconto 10€',
        nota: 'Test riscatto premio'
      };
      
      const response = await request(app)
        .post(`/api/programma-fedelta/${programmaId}/riscatta-premio`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(data)
        .expect(200);
      
      expect(response.body.programma).toBeDefined();
      expect(response.body.programma.puntiAccumulati).toBe(30); // 50 - 20 = 30
      expect(response.body.programma.storicoPremi).toBeDefined();
      expect(response.body.programma.storicoPremi.length).toBeGreaterThan(0);
      expect(response.body.programma.storicoPremi[0].punti).toBe(20);
      expect(response.body.programma.storicoPremi[0].premio).toBe('Sconto 10€');
    });
    
    it('non dovrebbe riscattare un premio se i punti sono insufficienti', async () => {
      const data = {
        punti: 100,
        premio: 'Premio Costoso',
        nota: 'Test punti insufficienti'
      };
      
      await request(app)
        .post(`/api/programma-fedelta/${programmaId}/riscatta-premio`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(data)
        .expect(400);
    });
  });
  
  // Test per aggiornare il livello di un programma fedeltà
  describe('PATCH /api/programma-fedelta/:id/aggiorna-livello', () => {
    it('dovrebbe aggiornare il livello del programma fedeltà', async () => {
      const data = {
        livello: 'silver',
        nota: 'Promozione a livello silver'
      };
      
      const response = await request(app)
        .patch(`/api/programma-fedelta/${programmaId}/aggiorna-livello`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(data)
        .expect(200);
      
      expect(response.body.programma).toBeDefined();
      expect(response.body.programma.livello).toBe('silver');
      expect(response.body.programma.storicoLivelli).toBeDefined();
      expect(response.body.programma.storicoLivelli.length).toBeGreaterThan(0);
      expect(response.body.programma.storicoLivelli[0].livello).toBe('silver');
    });
  });
  
  // Test per ottenere le statistiche del programma fedeltà
  describe('GET /api/programma-fedelta/statistiche/generale', () => {
    it('dovrebbe ottenere le statistiche generali del programma fedeltà', async () => {
      const response = await request(app)
        .get('/api/programma-fedelta/statistiche/generale')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body).toBeDefined();
      expect(response.body.totaleIscritti).toBeDefined();
      expect(response.body.puntiTotali).toBeDefined();
      expect(response.body.premiRiscattati).toBeDefined();
      expect(response.body.distribuzioneLivelli).toBeDefined();
    });
  });
  
  // Test per disattivare un programma fedeltà
  describe('DELETE /api/programma-fedelta/:id', () => {
    it('dovrebbe disattivare (non eliminare fisicamente) un programma fedeltà', async () => {
      const response = await request(app)
        .delete(`/api/programma-fedelta/${programmaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body.message).toBeDefined();
      
      // Verifica che il programma sia stato disattivato ma non eliminato
      const checkResponse = await request(app)
        .get(`/api/programma-fedelta/${programmaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(checkResponse.body.programma).toBeDefined();
      expect(checkResponse.body.programma.attivo).toBe(false);
    });
  });
});
