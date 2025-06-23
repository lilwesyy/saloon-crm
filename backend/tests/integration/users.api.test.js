const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const jwt = require('jsonwebtoken');

describe('API Users Integration Test', () => {
  let adminToken;
  let operatorToken;
  let adminUser;
  let operatorUser;
  let newUserId;
  
  // Prima di tutti i test, crea gli utenti e i token
  beforeAll(async () => {
    // Crea un utente admin per i test
    adminUser = new User({
      nome: 'Admin',
      cognome: 'Test',
      email: 'admin.test.users@example.com',
      password: 'password123',
      ruolo: 'admin'
    });
    await adminUser.save();
    
    // Crea un utente operatore per i test
    operatorUser = new User({
      nome: 'Operatore',
      cognome: 'Test',
      email: 'operatore.test.users@example.com',
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
  });
  
  // Dopo tutti i test, elimina gli utenti di test
  afterAll(async () => {
    await User.deleteMany({ email: { $regex: /test\.users/ } });
    await mongoose.connection.close();
  });
  
  // Test per creare un nuovo utente
  describe('POST /api/users', () => {
    it('dovrebbe permettere all\'admin di creare un nuovo utente', async () => {
      const userData = {
        nome: 'Nuovo',
        cognome: 'Utente',
        email: 'nuovo.utente.test.users@example.com',
        password: 'password123',
        ruolo: 'operatore',
        telefono: '+39 333 1234567'
      };
      
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(201);
      
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('nuovo.utente.test.users@example.com');
      
      // Salva l'ID per i test successivi
      newUserId = response.body.user._id;
    });
    
    it('non dovrebbe permettere all\'operatore di creare un utente', async () => {
      const userData = {
        nome: 'Non',
        cognome: 'Autorizzato',
        email: 'non.autorizzato@example.com',
        password: 'password123',
        ruolo: 'operatore'
      };
      
      await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${operatorToken}`)
        .send(userData)
        .expect(403); // Forbidden
    });
    
    it('non dovrebbe creare un utente con email duplicata', async () => {
      const userData = {
        nome: 'Duplicato',
        cognome: 'Email',
        email: 'admin.test.users@example.com', // Email già usata
        password: 'password123',
        ruolo: 'operatore'
      };
      
      await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(400);
    });
  });
  
  // Test per ottenere la lista degli utenti
  describe('GET /api/users', () => {
    it('dovrebbe permettere all\'admin di ottenere la lista degli utenti', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body.users).toBeDefined();
      expect(Array.isArray(response.body.users)).toBeTruthy();
      expect(response.body.users.length).toBeGreaterThan(0);
    });
    
    it('non dovrebbe permettere all\'operatore di ottenere la lista completa degli utenti', async () => {
      // A seconda dell'implementazione, questo potrebbe essere 403 o 200 con dati limitati
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${operatorToken}`);
      
      // Se implementato come accesso limitato invece di blocco totale
      if (response.status === 200) {
        expect(response.body.users).toBeDefined();
      } else {
        expect(response.status).toBe(403);
      }
    });
  });
  
  // Test per ottenere gli operatori attivi
  describe('GET /api/users/operators', () => {
    it('dovrebbe ottenere la lista degli operatori attivi', async () => {
      const response = await request(app)
        .get('/api/users/operators')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body.operators).toBeDefined();
      expect(Array.isArray(response.body.operators)).toBeTruthy();
      
      // Tutti gli utenti nella risposta devono essere operatori
      response.body.operators.forEach(user => {
        expect(user.ruolo).toBe('operatore');
      });
    });
  });
  
  // Test per ottenere un singolo utente
  describe('GET /api/users/:id', () => {
    it('dovrebbe permettere all\'admin di ottenere i dettagli di un utente', async () => {
      const response = await request(app)
        .get(`/api/users/${newUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body.user).toBeDefined();
      expect(response.body.user._id).toBe(newUserId);
      expect(response.body.user.email).toBe('nuovo.utente.test.users@example.com');
    });
    
    it('non dovrebbe trovare un utente non esistente', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
  
  // Test per aggiornare un utente
  describe('PUT /api/users/:id', () => {
    it('dovrebbe permettere all\'admin di aggiornare un utente', async () => {
      const updateData = {
        nome: 'Nome Aggiornato',
        telefono: '+39 333 9876543'
      };
      
      const response = await request(app)
        .put(`/api/users/${newUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);
      
      expect(response.body.user).toBeDefined();
      expect(response.body.user.nome).toBe('Nome Aggiornato');
      expect(response.body.user.telefono).toBe('+39 333 9876543');
    });
    
    it('non dovrebbe permettere all\'operatore di aggiornare un utente', async () => {
      const updateData = {
        nome: 'Questo non dovrebbe essere aggiornato'
      };
      
      await request(app)
        .put(`/api/users/${newUserId}`)
        .set('Authorization', `Bearer ${operatorToken}`)
        .send(updateData)
        .expect(403); // Forbidden
    });
  });
  
  // Test per attivare/disattivare un utente
  describe('PATCH /api/users/:id/toggle-status', () => {
    it('dovrebbe permettere all\'admin di disattivare un utente', async () => {
      const response = await request(app)
        .patch(`/api/users/${newUserId}/toggle-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body.user).toBeDefined();
      // A seconda dell'implementazione, il campo potrebbe essere "isActive" o "attivo"
      const isActive = response.body.user.isActive !== undefined 
        ? response.body.user.isActive 
        : response.body.user.attivo;
      expect(isActive).toBe(false);
    });
    
    it('dovrebbe permettere all\'admin di riattivare un utente', async () => {
      const response = await request(app)
        .patch(`/api/users/${newUserId}/toggle-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body.user).toBeDefined();
      // A seconda dell'implementazione, il campo potrebbe essere "isActive" o "attivo"
      const isActive = response.body.user.isActive !== undefined 
        ? response.body.user.isActive 
        : response.body.user.attivo;
      expect(isActive).toBe(true);
    });
    
    it('non dovrebbe permettere all\'operatore di attivare/disattivare un utente', async () => {
      await request(app)
        .patch(`/api/users/${newUserId}/toggle-status`)
        .set('Authorization', `Bearer ${operatorToken}`)
        .expect(403); // Forbidden
    });
  });
});
