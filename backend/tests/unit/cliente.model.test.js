const mongoose = require('mongoose');
const Cliente = require('../../src/models/cliente.model');

describe('Cliente Model Test', () => {
  // Test per il modello Cliente
  describe('Validazione schema', () => {
    it('dovrebbe validare un cliente corretto', async () => {
      const clienteValido = {
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890',
        consensoPrivacy: true,
        classificazione: 'nuovo'
      };
      
      const cliente = new Cliente(clienteValido);
      const saved = await cliente.save();
      
      expect(saved._id).toBeDefined();
      expect(saved.nome).toBe(clienteValido.nome);
      expect(saved.cognome).toBe(clienteValido.cognome);
      expect(saved.email).toBe(clienteValido.email);
      expect(saved.telefono).toBe(clienteValido.telefono);
      expect(saved.consensoPrivacy).toBe(clienteValido.consensoPrivacy);
      expect(saved.classificazione).toBe(clienteValido.classificazione);
    });
    
    it('dovrebbe rifiutare un cliente senza nome', async () => {
      const clienteInvalido = {
        cognome: 'Rossi',
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890'
      };
      
      const cliente = new Cliente(clienteInvalido);
      
      await expect(cliente.save()).rejects.toThrow();
    });
    
    it('dovrebbe rifiutare un cliente senza cognome', async () => {
      const clienteInvalido = {
        nome: 'Mario',
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890'
      };
      
      const cliente = new Cliente(clienteInvalido);
      
      await expect(cliente.save()).rejects.toThrow();
    });
    
    it('dovrebbe rifiutare un cliente con email non valida', async () => {
      const clienteInvalido = {
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'email-non-valida',
        telefono: '+39 123 456 7890'
      };
      
      const cliente = new Cliente(clienteInvalido);
      
      await expect(cliente.save()).rejects.toThrow();
    });
    
    it('dovrebbe rifiutare un cliente senza telefono', async () => {
      const clienteInvalido = {
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@example.com'
      };
      
      const cliente = new Cliente(clienteInvalido);
      
      await expect(cliente.save()).rejects.toThrow();
    });
    
    it('dovrebbe rifiutare un cliente con classificazione non valida', async () => {
      const clienteInvalido = {
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890',
        classificazione: 'classificazione_non_valida'
      };
      
      const cliente = new Cliente(clienteInvalido);
      
      await expect(cliente.save()).rejects.toThrow();
    });
  });

  describe('Metodi del modello Cliente', () => {
    it('dovrebbe aggiornare correttamente la data di modifica', async () => {
      // Crea un cliente
      const cliente = new Cliente({
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890',
        consensoPrivacy: true
      });
      
      // Salva il cliente
      const savedCliente = await cliente.save();
      expect(savedCliente._id).toBeDefined();
      
      // Salva il timestamp originale
      const originalTimestamp = savedCliente.updatedAt;
      
      // Attendi un momento per assicurarti che il timestamp cambi
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Recupera il cliente dal database
      const foundCliente = await Cliente.findById(savedCliente._id);
      expect(foundCliente).not.toBeNull();
      
      // Modifica e salva nuovamente il cliente
      foundCliente.nome = 'Giuseppe';
      const updatedCliente = await foundCliente.save();
      
      // Verifica che il timestamp di aggiornamento sia stato modificato
      expect(updatedCliente.updatedAt).not.toEqual(originalTimestamp);
    });
  });
  
  describe('Funzionalità di business per clienti', () => {
    it('dovrebbe impostare la classificazione a nuovo per un nuovo cliente', async () => {
      const cliente = new Cliente({
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890',
        consensoPrivacy: true
      });
      
      await cliente.save();
      
      expect(cliente.classificazione).toBe('nuovo');
    });
    
    it('dovrebbe impostare correttamente la classificazione', async () => {
      const cliente = new Cliente({
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@example.com',
        telefono: '+39 123 456 7890',
        consensoPrivacy: true,
        classificazione: 'fedele'
      });
      
      await cliente.save();
      
      expect(cliente.classificazione).toBe('fedele');
    });
  });
});
