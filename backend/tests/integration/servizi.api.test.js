const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Servizio = require('../../src/models/servizio.model');
const User = require('../../src/models/user.model');
const jwt = require('jsonwebtoken');

describe('API Servizi Integration Test', () => {
  let token;
  let adminToken;
  let operatorToken;
  let adminUser;
  let operatorUser;
  let servizioId;

  // Prima di tutti i test, crea gli utenti di test e genera i token
  beforeAll(async () => {
    // Crea un utente admin per i test
    adminUser = new User({
      nome: 'Admin',
      cognome: 'Test',
      email: 'admin.test.servizi@example.com',
      password: 'password123',
      ruolo: 'admin'
    });
    await adminUser.save();
    
    // Crea un utente operatore per i test
    operatorUser = new User({
      nome: 'Operatore',
      cognome: 'Test',
      email: 'operatore.test.servizi@example.com',
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
    
    // Per default, usa il token admin
    token = adminToken;
  });
  
  // Dopo tutti i test, rimuovi i dati di test
  afterAll(async () => {
    await User.deleteMany({ email: { $regex: /test\.servizi/ } });
    await Servizio.deleteMany({ nome: { $regex: /Test Servizio/ } });
    await mongoose.connection.close();
  });
  
  // Test per la creazione di un servizio
  describe('POST /api/servizi', () => {
    it('dovrebbe permettere all\'admin di creare un servizio', async () => {
      const servizioData = {
        nome: 'Test Servizio 1',
        descrizione: 'Servizio di test per integrazione',
        prezzo: 75.50,
        durata: 60,
        categoria: 'Test'
      };
      
      const response = await request(app)
        .post('/api/servizi')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(servizioData)
        .expect(201);
      
      expect(response.body.servizio).toBeDefined();
      expect(response.body.servizio.nome).toBe('Test Servizio 1');
      expect(response.body.servizio.prezzo).toBe(75.5);
      
      // Salva l'ID per i prossimi test
      servizioId = response.body.servizio._id;
    });
    
    it('non dovrebbe permettere all\'operatore di creare un servizio', async () => {
      const servizioData = {
        nome: 'Test Servizio Operatore',
        descrizione: 'Questo non dovrebbe essere creato',
        prezzo: 50,
        durata: 30,
        categoria: 'Test'
      };
      
      await request(app)
        .post('/api/servizi')
        .set('Authorization', `Bearer ${operatorToken}`)
        .send(servizioData)
        .expect(403); // Forbidden
    });
    
    it('non dovrebbe creare un servizio con dati invalidi', async () => {
      const servizioData = {
        nome: '', // Nome vuoto non valido
        prezzo: 'non un numero', // Non è un numero valido
        categoria: 'Test'
      };
      
      const response = await request(app)
        .post('/api/servizi')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(servizioData)
        .expect(400);
      
      expect(response.body.errors).toBeDefined();
    });
  });
  
  // Test per ottenere tutti i servizi
  describe('GET /api/servizi', () => {
    it('dovrebbe ottenere tutti i servizi', async () => {
      const response = await request(app)
        .get('/api/servizi')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.servizi).toBeDefined();
      expect(Array.isArray(response.body.servizi)).toBeTruthy();
      expect(response.body.servizi.length).toBeGreaterThan(0);
    });
    
    it('dovrebbe ottenere servizi per categoria', async () => {
      // Prima creiamo un servizio in una categoria specifica
      const servizioSpeciale = new Servizio({
        nome: 'Test Servizio Categoria',
        descrizione: 'Servizio per testare filtro categoria',
        prezzo: 45.00,
        durata: 45,
        categoria: 'Categoria Test Speciale'
      });
      await servizioSpeciale.save();
      
      const response = await request(app)
        .get('/api/servizi/categoria/Categoria Test Speciale')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.servizi).toBeDefined();
      expect(Array.isArray(response.body.servizi)).toBeTruthy();
      expect(response.body.servizi.length).toBeGreaterThan(0);
      expect(response.body.servizi.some(s => s.nome === 'Test Servizio Categoria')).toBeTruthy();
      
      // Pulizia
      await Servizio.findByIdAndDelete(servizioSpeciale._id);
    });
  });
  
  // Test per ottenere le categorie
  describe('GET /api/servizi/categorie', () => {
    it('dovrebbe ottenere tutte le categorie dei servizi', async () => {
      const response = await request(app)
        .get('/api/servizi/categorie')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.categorie).toBeDefined();
      expect(Array.isArray(response.body.categorie)).toBeTruthy();
      expect(response.body.categorie).toContain('Test'); // La categoria che abbiamo creato
    });
  });
  
  // Test per ottenere un singolo servizio
  describe('GET /api/servizi/:id', () => {
    it('dovrebbe ottenere un servizio specifico', async () => {
      const response = await request(app)
        .get(`/api/servizi/${servizioId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.servizio).toBeDefined();
      expect(response.body.servizio._id).toBe(servizioId);
      expect(response.body.servizio.nome).toBe('Test Servizio 1');
    });
    
    it('dovrebbe restituire 404 per ID non valido', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/servizi/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
  
  // Test per aggiornare un servizio
  describe('PUT /api/servizi/:id', () => {
    it('dovrebbe permettere all\'admin di aggiornare un servizio', async () => {
      const updateData = {
        nome: 'Test Servizio 1 Aggiornato',
        prezzo: 85.00
      };
      
      const response = await request(app)
        .put(`/api/servizi/${servizioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);
      
      expect(response.body.servizio).toBeDefined();
      expect(response.body.servizio.nome).toBe('Test Servizio 1 Aggiornato');
      expect(response.body.servizio.prezzo).toBe(85);
    });
    
    it('non dovrebbe permettere all\'operatore di aggiornare un servizio', async () => {
      const updateData = {
        nome: 'Questo nome non dovrebbe essere applicato'
      };
      
      await request(app)
        .put(`/api/servizi/${servizioId}`)
        .set('Authorization', `Bearer ${operatorToken}`)
        .send(updateData)
        .expect(403); // Forbidden
    });
  });
  
  // Test per eliminare un servizio
  describe('DELETE /api/servizi/:id', () => {
    it('non dovrebbe permettere all\'operatore di eliminare un servizio', async () => {
      await request(app)
        .delete(`/api/servizi/${servizioId}`)
        .set('Authorization', `Bearer ${operatorToken}`)
        .expect(403); // Forbidden
    });
    
    it('dovrebbe permettere all\'admin di eliminare un servizio', async () => {
      await request(app)
        .delete(`/api/servizi/${servizioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      // Verifica che il servizio sia stato eliminato
      await request(app)
        .get(`/api/servizi/${servizioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});
