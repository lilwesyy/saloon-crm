const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Appuntamento = require('../../src/models/appuntamento.model');
const Cliente = require('../../src/models/cliente.model');
const User = require('../../src/models/user.model');
const Servizio = require('../../src/models/servizio.model');
const jwt = require('jsonwebtoken');

describe('API Appuntamenti Integration Test', () => {
  let token;
  let adminUser;
  let cliente;
  let operatore;
  let servizio;
  
  // Prima di tutti i test, crea un utente e genera un token
  beforeAll(async () => {
    // Crea un utente admin per i test
    adminUser = new User({
      nome: 'Admin',
      cognome: 'Test',
      email: 'admin.test.appuntamenti@example.com',
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
      cognome: 'Test',
      email: 'cliente.test@example.com',
      telefono: '+39 123 456 7890',
      consensoPrivacy: true
    });
    await cliente.save();
    
    // Crea un operatore di test
    operatore = new User({
      nome: 'Operatore',
      cognome: 'Test',
      email: 'operatore.test@example.com',
      password: 'password123',
      ruolo: 'operatore'
    });
    await operatore.save();
    
    // Crea un servizio di test
    servizio = new Servizio({
      nome: 'Servizio test',
      descrizione: 'Servizio per test',
      durata: 30,
      prezzo: 25,
      categoria: 'Test'
    });
    await servizio.save();
  });
  
  // Dopo tutti i test, rimuovi i dati di test
  afterAll(async () => {
    await User.deleteMany({});
    await Cliente.deleteMany({});
    await Servizio.deleteMany({});
  });
  
  // Prima di ogni test, pulisci la collezione appuntamenti
  beforeEach(async () => {
    await Appuntamento.deleteMany({});
  });
  
  describe('GET /api/appuntamenti', () => {
    it('dovrebbe recuperare la lista di appuntamenti vuota', async () => {
      const response = await request(app)
        .get('/api/appuntamenti')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.appuntamenti).toEqual([]);
    });
    
    it('dovrebbe recuperare gli appuntamenti filtrati per data', async () => {
      // Crea alcuni appuntamenti di test
      const oggi = new Date();
      const domani = new Date(oggi);
      domani.setDate(domani.getDate() + 1);
      
      // Appuntamento per oggi
      const appuntamentoOggi = new Appuntamento({
        cliente: cliente._id,
        servizi: [{ servizio: servizio._id, prezzo: servizio.prezzo }],
        operatore: operatore._id,
        dataOraInizio: oggi,
        dataOraFine: new Date(oggi.getTime() + 30 * 60000),
        stato: 'prenotato'
      });
      await appuntamentoOggi.save();
      
      // Appuntamento per domani
      const appuntamentoDomani = new Appuntamento({
        cliente: cliente._id,
        servizi: [{ servizio: servizio._id, prezzo: servizio.prezzo }],
        operatore: operatore._id,
        dataOraInizio: domani,
        dataOraFine: new Date(domani.getTime() + 30 * 60000),
        stato: 'prenotato'
      });
      await appuntamentoDomani.save();
      
      // Richiedi gli appuntamenti di oggi
      const dataOggi = oggi.toISOString().split('T')[0];
      const response = await request(app)
        .get(`/api/appuntamenti?data=${dataOggi}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.appuntamenti.length).toBe(1);
      expect(new Date(response.body.appuntamenti[0].dataOraInizio).toISOString().split('T')[0])
        .toBe(dataOggi);
    });
  });
  
  describe('POST /api/appuntamenti', () => {
    it('dovrebbe creare un nuovo appuntamento', async () => {
      const dataInizio = new Date();
      dataInizio.setHours(dataInizio.getHours() + 1); // 1 ora da adesso
      const dataFine = new Date(dataInizio.getTime() + 30 * 60000); // +30 minuti
      
      const nuovoAppuntamento = {
        cliente: cliente._id.toString(),
        servizi: [{ servizio: servizio._id.toString(), prezzo: servizio.prezzo }],
        operatore: operatore._id.toString(),
        dataOraInizio: dataInizio.toISOString(),
        dataOraFine: dataFine.toISOString(),
        stato: 'prenotato',
        note: 'Appuntamento di test'
      };
      
      const response = await request(app)
        .post('/api/appuntamenti')
        .set('Authorization', `Bearer ${token}`)
        .send(nuovoAppuntamento)
        .expect(201);
      
      expect(response.body._id).toBeDefined();
      expect(response.body.cliente).toBe(cliente._id.toString());
      expect(response.body.operatore).toBe(operatore._id.toString());
      expect(response.body.stato).toBe('prenotato');
      expect(response.body.note).toBe('Appuntamento di test');
      
      // Verifica che l'appuntamento sia stato salvato nel database
      const appuntamentoSalvato = await Appuntamento.findById(response.body._id);
      expect(appuntamentoSalvato).toBeTruthy();
    });
    
    it('dovrebbe rifiutare un appuntamento con dati mancanti', async () => {
      const appuntamentoIncompleto = {
        cliente: cliente._id.toString(),
        // manca servizi
        operatore: operatore._id.toString(),
        dataOraInizio: new Date().toISOString()
        // manca dataOraFine
      };
      
      await request(app)
        .post('/api/appuntamenti')
        .set('Authorization', `Bearer ${token}`)
        .send(appuntamentoIncompleto)
        .expect(400);
    });
  });
  
  describe('PUT /api/appuntamenti/:id', () => {
    it('dovrebbe aggiornare un appuntamento esistente', async () => {
      // Crea un appuntamento
      const dataInizio = new Date();
      const dataFine = new Date(dataInizio.getTime() + 30 * 60000);
      
      const appuntamento = new Appuntamento({
        cliente: cliente._id,
        servizi: [{ servizio: servizio._id, prezzo: servizio.prezzo }],
        operatore: operatore._id,
        dataOraInizio: dataInizio,
        dataOraFine: dataFine,
        stato: 'prenotato',
        note: 'Nota originale'
      });
      
      await appuntamento.save();
      
      // Aggiorna l'appuntamento
      const aggiornamento = {
        note: 'Nota aggiornata',
        stato: 'confermato'
      };
      
      const response = await request(app)
        .put(`/api/appuntamenti/${appuntamento._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(aggiornamento)
        .expect(200);
      
      expect(response.body.note).toBe('Nota aggiornata');
      expect(response.body.stato).toBe('confermato');
      
      // Verifica che l'appuntamento sia stato aggiornato nel database
      const appuntamentoAggiornato = await Appuntamento.findById(appuntamento._id);
      expect(appuntamentoAggiornato.note).toBe('Nota aggiornata');
      expect(appuntamentoAggiornato.stato).toBe('confermato');
    });
    
    it('dovrebbe restituire 404 per ID non esistente', async () => {
      const idNonEsistente = new mongoose.Types.ObjectId();
      
      await request(app)
        .put(`/api/appuntamenti/${idNonEsistente}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ note: 'Aggiornamento' })
        .expect(404);
    });
  });
  
  describe('DELETE /api/appuntamenti/:id', () => {
    it('dovrebbe eliminare un appuntamento', async () => {
      // Crea un appuntamento
      const dataInizio = new Date();
      const dataFine = new Date(dataInizio.getTime() + 30 * 60000);
      
      const appuntamento = new Appuntamento({
        cliente: cliente._id,
        servizi: [{ servizio: servizio._id, prezzo: servizio.prezzo }],
        operatore: operatore._id,
        dataOraInizio: dataInizio,
        dataOraFine: dataFine,
        stato: 'prenotato'
      });
      
      await appuntamento.save();
      
      // Elimina l'appuntamento
      await request(app)
        .delete(`/api/appuntamenti/${appuntamento._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      // Verifica che l'appuntamento sia stato eliminato
      const appuntamentoEliminato = await Appuntamento.findById(appuntamento._id);
      expect(appuntamentoEliminato).toBeNull();
    });
    
    it('dovrebbe restituire 404 per ID non esistente', async () => {
      const idNonEsistente = new mongoose.Types.ObjectId();
      
      await request(app)
        .delete(`/api/appuntamenti/${idNonEsistente}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
  
  // Altri test per endpoint specifici
});
