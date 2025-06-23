const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');  // Assumendo che tu abbia un file app.js separato
const Cliente = require('../../src/models/cliente.model');
const User = require('../../src/models/user.model');
const jwt = require('jsonwebtoken');

describe('API Clienti Integration Test', () => {
  let token;
  let userId;
  
  // Prima di tutti i test, crea un utente e genera un token
  beforeAll(async () => {
    // Crea un utente admin per i test
    const adminUser = new User({
      nome: 'Admin',
      cognome: 'Test',
      email: 'admin.test@example.com',
      password: 'password123',
      ruolo: 'admin'
    });
    
    await adminUser.save();
    userId = adminUser._id;
    
    // Genera token JWT
    token = jwt.sign(
      { userId: adminUser._id, ruolo: adminUser.ruolo },
      process.env.JWT_SECRET || 'test_secret_key',
      { expiresIn: '1h' }
    );
  });
  
  // Dopo tutti i test, rimuovi l'utente
  afterAll(async () => {
    await User.deleteMany({});
  });
  
  // Prima di ogni test, pulisci la collezione clienti
  beforeEach(async () => {
    await Cliente.deleteMany({});
  });
  
  describe('GET /api/clienti', () => {
    it('dovrebbe recuperare la lista di clienti vuota', async () => {
      const response = await request(app)
        .get('/api/clienti')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.clienti).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });
    
    it('dovrebbe recuperare clienti con paginazione', async () => {
      // Crea alcuni clienti di test
      const clienti = [
        {
          nome: 'Mario',
          cognome: 'Rossi',
          email: 'mario.rossi@example.com',
          telefono: '+39 123 456 7890',
          consensoPrivacy: true
        },
        {
          nome: 'Luigi',
          cognome: 'Verdi',
          email: 'luigi.verdi@example.com',
          telefono: '+39 987 654 3210',
          consensoPrivacy: true
        },
        {
          nome: 'Anna',
          cognome: 'Bianchi',
          email: 'anna.bianchi@example.com',
          telefono: '+39 555 666 7777',
          consensoPrivacy: true
        }
      ];
      
      await Cliente.insertMany(clienti);
      
      const response = await request(app)
        .get('/api/clienti?page=1&limit=2')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.clienti.length).toBe(2);
      expect(response.body.pagination.total).toBe(3);
      expect(response.body.pagination.pages).toBe(2);
    });
    
    it('dovrebbe filtrare i clienti per classificazione', async () => {
      // Crea alcuni clienti di test con classificazioni diverse
      await Cliente.insertMany([
        {
          nome: 'Mario',
          cognome: 'Rossi',
          email: 'mario.rossi@example.com',
          telefono: '+39 123 456 7890',
          consensoPrivacy: true,
          classificazione: 'nuovo'
        },
        {
          nome: 'Luigi',
          cognome: 'Verdi',
          email: 'luigi.verdi@example.com',
          telefono: '+39 987 654 3210',
          consensoPrivacy: true,
          classificazione: 'fedele'
        },
        {
          nome: 'Anna',
          cognome: 'Bianchi',
          email: 'anna.bianchi@example.com',
          telefono: '+39 555 666 7777',
          consensoPrivacy: true,
          classificazione: 'inattivo'
        }
      ]);
      
      const response = await request(app)
        .get('/api/clienti?classificazione=fedele')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.clienti.length).toBe(1);
      expect(response.body.clienti[0].nome).toBe('Luigi');
      expect(response.body.clienti[0].classificazione).toBe('fedele');
    });
  });
  
  describe('GET /api/clienti/:id', () => {
    it('dovrebbe recuperare un cliente specifico', async () => {
      // Crea un cliente di test
      const cliente = new Cliente({
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890',
        consensoPrivacy: true
      });
      
      await cliente.save();
      
      const response = await request(app)
        .get(`/api/clienti/${cliente._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body._id).toBe(cliente._id.toString());
      expect(response.body.nome).toBe(cliente.nome);
      expect(response.body.cognome).toBe(cliente.cognome);
      expect(response.body.email).toBe(cliente.email);
      expect(response.body.telefono).toBe(cliente.telefono);
    });
    
    it('dovrebbe restituire 404 per ID non valido', async () => {
      const response = await request(app)
        .get('/api/clienti/6123456789abcdef01234567')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
      
      expect(response.body.message).toBe('Cliente non trovato');
    });
  });
  
  describe('POST /api/clienti', () => {
    it('dovrebbe creare un nuovo cliente', async () => {
      const nuovoCliente = {
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890',
        consensoPrivacy: true
      };
      
      const response = await request(app)
        .post('/api/clienti')
        .set('Authorization', `Bearer ${token}`)
        .send(nuovoCliente)
        .expect(201);
      
      expect(response.body._id).toBeDefined();
      expect(response.body.nome).toBe(nuovoCliente.nome);
      expect(response.body.cognome).toBe(nuovoCliente.cognome);
      expect(response.body.email).toBe(nuovoCliente.email);
      expect(response.body.telefono).toBe(nuovoCliente.telefono);
      expect(response.body.classificazione).toBe('nuovo');
      
      // Verifica che il cliente sia stato effettivamente salvato nel database
      const clienteSalvato = await Cliente.findById(response.body._id);
      expect(clienteSalvato).toBeTruthy();
      expect(clienteSalvato.nome).toBe(nuovoCliente.nome);
    });
    
    it('dovrebbe rifiutare un cliente con dati mancanti', async () => {
      const clienteIncompleto = {
        nome: 'Mario',
        // cognome mancante
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890'
      };
      
      await request(app)
        .post('/api/clienti')
        .set('Authorization', `Bearer ${token}`)
        .send(clienteIncompleto)
        .expect(400);
    });
    
    it('dovrebbe rifiutare un cliente con email già esistente', async () => {
      // Crea il primo cliente
      const cliente1 = new Cliente({
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890',
        consensoPrivacy: true
      });
      
      await cliente1.save();
      
      // Tenta di creare un secondo cliente con la stessa email
      const cliente2 = {
        nome: 'Luigi',
        cognome: 'Verdi',
        email: 'mario.rossi@example.com', // Stessa email
        telefono: '+39 987 654 3210',
        consensoPrivacy: true
      };
      
      const response = await request(app)
        .post('/api/clienti')
        .set('Authorization', `Bearer ${token}`)
        .send(cliente2)
        .expect(400);
      
      expect(response.body.message).toBe('Email già registrata per un altro cliente');
    });
  });
  
  // Altri test per PUT, DELETE, ecc.
});
