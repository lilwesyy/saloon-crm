const mongoose = require('mongoose');
const clientiController = require('../../src/controllers/clienti.controller');
const Cliente = require('../../src/models/cliente.model');
const httpMocks = require('node-mocks-http');
const { validationResult } = require('express-validator');

// Mock di express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => true),
    array: jest.fn(() => [])
  }))
}));

describe('Clienti Controller Test', () => {
  let req, res, next;
  
  beforeEach(() => {
    res = httpMocks.createResponse();
    req = httpMocks.createRequest();
    next = jest.fn();
  });
  
  describe('getAll', () => {
    it('dovrebbe recuperare tutti i clienti con paginazione', async () => {
      // Prepara i dati di test
      const clientiMock = [
        {
          nome: 'Mario',
          cognome: 'Rossi',
          email: 'mario.rossi@example.com',
          telefono: '+39 123 456 7890',
        },
        {
          nome: 'Luigi',
          cognome: 'Verdi',
          email: 'luigi.verdi@example.com',
          telefono: '+39 987 654 3210',
        }
      ];
      
      // Mock della query di Mongoose
      Cliente.find = jest.fn().mockReturnThis();
      Cliente.sort = jest.fn().mockReturnThis();
      Cliente.skip = jest.fn().mockReturnThis();
      Cliente.limit = jest.fn().mockResolvedValue(clientiMock);
      Cliente.countDocuments = jest.fn().mockResolvedValue(2);
      
      // Imposta i parametri di query per la richiesta
      req.query = { page: 1, limit: 10 };
      
      // Esegui il controller
      await clientiController.getAll(req, res);
      
      // Verifica la risposta
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.clienti).toEqual(clientiMock);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.total).toBe(2);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(10);
    });
    
    it('dovrebbe gestire correttamente un errore', async () => {
      // Mock di un errore
      const errorMessage = 'Database error';
      Cliente.find = jest.fn().mockImplementation(() => {
        throw new Error(errorMessage);
      });
      
      // Esegui il controller
      await clientiController.getAll(req, res);
      
      // Verifica la risposta
      expect(res.statusCode).toBe(500);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('Errore durante il recupero dei clienti');
    });
  });
  
  describe('getById', () => {
    it('dovrebbe recuperare un cliente per ID', async () => {
      // Prepara i dati di test
      const clienteMock = {
        _id: '6123456789abcdef01234567',
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890',
      };
      
      // Mock della query di Mongoose
      Cliente.findById = jest.fn().mockResolvedValue(clienteMock);
      
      // Imposta i parametri della richiesta
      req.params = { id: clienteMock._id };
      
      // Esegui il controller
      await clientiController.getById(req, res);
      
      // Verifica la risposta
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data).toEqual(clienteMock);
    });
    
    it('dovrebbe restituire 404 per un cliente non trovato', async () => {
      // Mock della query di Mongoose
      Cliente.findById = jest.fn().mockResolvedValue(null);
      
      // Imposta i parametri della richiesta
      req.params = { id: '6123456789abcdef01234567' };
      
      // Esegui il controller
      await clientiController.getById(req, res);
      
      // Verifica la risposta
      expect(res.statusCode).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('Cliente non trovato');
    });
  });
  
  describe('create', () => {
    it('dovrebbe creare un nuovo cliente', async () => {
      // Prepara i dati di test
      const clienteInput = {
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890',
      };
      
      const clienteSalvato = {
        _id: '6123456789abcdef01234567',
        ...clienteInput,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Mock del metodo save di Mongoose
      Cliente.prototype.save = jest.fn().mockResolvedValue(clienteSalvato);
      Cliente.findOne = jest.fn().mockResolvedValue(null);
      
      // Imposta i dati della richiesta
      req.body = clienteInput;
      
      // Esegui il controller
      await clientiController.create(req, res);
      
      // Verifica la risposta
      expect(res.statusCode).toBe(201);
      const data = JSON.parse(res._getData());
      expect(data._id).toBeDefined();
      expect(data.nome).toBe(clienteInput.nome);
      expect(data.cognome).toBe(clienteInput.cognome);
      expect(data.email).toBe(clienteInput.email);
      expect(data.telefono).toBe(clienteInput.telefono);
    });
    
    it('dovrebbe rifiutare un cliente con email già esistente', async () => {
      // Mock del metodo findOne di Mongoose
      Cliente.findOne = jest.fn().mockResolvedValue({ _id: '6123456789abcdef01234567' });
      
      // Imposta i dati della richiesta
      req.body = {
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890',
      };
      
      // Esegui il controller
      await clientiController.create(req, res);
      
      // Verifica la risposta
      expect(res.statusCode).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('Email già registrata per un altro cliente');
    });
  });

  // Altri test per update, delete, search, searchAdvanced, uploadFoto, getStatistiche
});
