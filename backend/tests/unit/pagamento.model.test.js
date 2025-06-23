const mongoose = require('mongoose');
const Pagamento = require('../../src/models/pagamento.model');
const Cliente = require('../../src/models/cliente.model');
const Servizio = require('../../src/models/servizio.model');
const User = require('../../src/models/user.model');

describe('Pagamento Model Test', () => {
  let cliente, servizio, operatore;

  beforeEach(async () => {
    // Crea i dati di test necessari
    cliente = new Cliente({
      nome: 'Laura',
      cognome: 'Neri',
      email: 'laura.neri@example.com',
      telefono: '+39 333 444 5555',
      consensoPrivacy: true
    });
    await cliente.save();

    servizio = new Servizio({
      nome: 'Massaggio rilassante',
      descrizione: 'Massaggio corpo completo',
      durata: 60,
      prezzo: 70,
      categoria: 'Corpo'
    });
    await servizio.save();

    operatore = new User({
      nome: 'Marco',
      cognome: 'Bianchi',
      email: 'marco.bianchi@estetica.com',
      password: 'password123',
      ruolo: 'operatore'
    });
    await operatore.save();
  });

  describe('Validazione schema', () => {
    it('dovrebbe validare un pagamento corretto', async () => {
      const pagamentoValido = {
        cliente: cliente._id,
        servizio: servizio._id,
        importo: 70,
        metodo: 'carta',
        tipo: 'servizio',
        stato: 'completato',
        dataPagamento: new Date(),
        note: 'Pagamento per massaggio',
        createdBy: operatore._id
      };
      
      const pagamento = new Pagamento(pagamentoValido);
      const saved = await pagamento.save();
      
      expect(saved._id).toBeDefined();
      expect(saved.cliente.toString()).toBe(cliente._id.toString());
      expect(saved.servizio.toString()).toBe(servizio._id.toString());
      expect(saved.importo).toBe(70);
      expect(saved.metodo).toBe('carta');
      expect(saved.tipo).toBe('servizio');
      expect(saved.stato).toBe('completato');
      expect(saved.note).toBe('Pagamento per massaggio');
      expect(saved.createdBy.toString()).toBe(operatore._id.toString());
    });
    
    it('dovrebbe rifiutare un pagamento senza cliente', async () => {
      const pagamentoInvalido = {
        servizio: servizio._id,
        importo: 70,
        metodo: 'carta',
        tipo: 'servizio',
        stato: 'completato'
      };
      
      const pagamento = new Pagamento(pagamentoInvalido);
      
      await expect(pagamento.save()).rejects.toThrow();
    });
    
    it('dovrebbe rifiutare un pagamento senza importo', async () => {
      const pagamentoInvalido = {
        cliente: cliente._id,
        servizio: servizio._id,
        metodo: 'carta',
        tipo: 'servizio',
        stato: 'completato'
      };
      
      const pagamento = new Pagamento(pagamentoInvalido);
      
      await expect(pagamento.save()).rejects.toThrow();
    });
    
    it('dovrebbe rifiutare un pagamento con metodo non valido', async () => {
      const pagamentoInvalido = {
        cliente: cliente._id,
        servizio: servizio._id,
        importo: 70,
        metodo: 'metodo_non_valido', // metodo non valido
        tipo: 'servizio',
        stato: 'completato'
      };
      
      const pagamento = new Pagamento(pagamentoInvalido);
      
      await expect(pagamento.save()).rejects.toThrow();
    });
    
    it('dovrebbe rifiutare un pagamento con tipo non valido', async () => {
      const pagamentoInvalido = {
        cliente: cliente._id,
        servizio: servizio._id,
        importo: 70,
        metodo: 'carta',
        tipo: 'tipo_non_valido', // tipo non valido
        stato: 'completato'
      };
      
      const pagamento = new Pagamento(pagamentoInvalido);
      
      await expect(pagamento.save()).rejects.toThrow();
    });
  });

  describe('Funzionalità di business', () => {
    it('dovrebbe impostare correttamente la data di creazione e modifica', async () => {
      const pagamento = new Pagamento({
        cliente: cliente._id,
        servizio: servizio._id,
        importo: 70,
        metodo: 'contanti',
        tipo: 'servizio',
        stato: 'completato'
      });
      
      await pagamento.save();
      
      expect(pagamento.createdAt).toBeDefined();
      expect(pagamento.updatedAt).toBeDefined();
    });
    
    it('dovrebbe aggiornare lo stato del pagamento', async () => {
      const pagamento = new Pagamento({
        cliente: cliente._id,
        servizio: servizio._id,
        importo: 70,
        metodo: 'carta',
        tipo: 'servizio',
        stato: 'completato'
      });
      
      await pagamento.save();
      
      // Cambia lo stato del pagamento
      pagamento.stato = 'rimborsato';
      await pagamento.save();
      
      // Verifica lo stato aggiornato
      const pagamentoAggiornato = await Pagamento.findById(pagamento._id);
      expect(pagamentoAggiornato.stato).toBe('rimborsato');
    });
  });
});
