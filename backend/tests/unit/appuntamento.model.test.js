const mongoose = require('mongoose');
const Appuntamento = require('../../src/models/appuntamento.model');
const Cliente = require('../../src/models/cliente.model');
const User = require('../../src/models/user.model');
const Servizio = require('../../src/models/servizio.model');

describe('Appuntamento Model Test', () => {
  let cliente, operatore, servizio;

  beforeEach(async () => {
    // Crea dati di test necessari
    cliente = new Cliente({
      nome: 'Maria',
      cognome: 'Bianchi',
      email: 'maria.bianchi@example.com',
      telefono: '+39 345 678 9012',
      consensoPrivacy: true
    });
    await cliente.save();

    operatore = new User({
      nome: 'Giulia',
      cognome: 'Verdi',
      email: 'giulia.verdi@estetica.com',
      password: 'password123',
      ruolo: 'operatore'
    });
    await operatore.save();

    servizio = new Servizio({
      nome: 'Manicure',
      descrizione: 'Trattamento completo per le unghie',
      durata: 45,
      prezzo: 30,
      categoria: 'Mani'
    });
    await servizio.save();
  });

  describe('Validazione schema', () => {
    it('dovrebbe validare un appuntamento corretto', async () => {
      const dataInizio = new Date();
      const dataFine = new Date(dataInizio.getTime() + 45 * 60000); // +45 minuti
      
      const appuntamentoValido = {
        cliente: cliente._id,
        servizi: [{ servizio: servizio._id, prezzo: servizio.prezzo }],
        operatore: operatore._id,
        dataOraInizio: dataInizio,
        dataOraFine: dataFine,
        stato: 'prenotato',
        note: 'Prima visita'
      };
      
      const appuntamento = new Appuntamento(appuntamentoValido);
      const saved = await appuntamento.save();
      
      expect(saved._id).toBeDefined();
      expect(saved.cliente.toString()).toBe(cliente._id.toString());
      expect(saved.operatore.toString()).toBe(operatore._id.toString());
      expect(saved.servizi.length).toBe(1);
      expect(saved.servizi[0].servizio.toString()).toBe(servizio._id.toString());
      expect(saved.servizi[0].prezzo).toBe(servizio.prezzo);
      expect(saved.stato).toBe('prenotato');
      expect(saved.note).toBe('Prima visita');
    });
    
    it('dovrebbe rifiutare un appuntamento senza cliente', async () => {
      const dataInizio = new Date();
      const dataFine = new Date(dataInizio.getTime() + 45 * 60000);
      
      const appuntamentoInvalido = {
        servizi: [{ servizio: servizio._id, prezzo: servizio.prezzo }],
        operatore: operatore._id,
        dataOraInizio: dataInizio,
        dataOraFine: dataFine
      };
      
      const appuntamento = new Appuntamento(appuntamentoInvalido);
      
      await expect(appuntamento.save()).rejects.toThrow();
    });
    
    it('dovrebbe rifiutare un appuntamento senza servizi', async () => {
      const dataInizio = new Date();
      const dataFine = new Date(dataInizio.getTime() + 45 * 60000);
      
      const appuntamentoInvalido = {
        cliente: cliente._id,
        operatore: operatore._id,
        dataOraInizio: dataInizio,
        dataOraFine: dataFine,
        servizi: [] // array vuoto
      };
      
      const appuntamento = new Appuntamento(appuntamentoInvalido);
      
      await expect(appuntamento.save()).rejects.toThrow();
    });
    
    it('dovrebbe rifiutare un appuntamento senza operatore', async () => {
      const dataInizio = new Date();
      const dataFine = new Date(dataInizio.getTime() + 45 * 60000);
      
      const appuntamentoInvalido = {
        cliente: cliente._id,
        servizi: [{ servizio: servizio._id, prezzo: servizio.prezzo }],
        dataOraInizio: dataInizio,
        dataOraFine: dataFine
      };
      
      const appuntamento = new Appuntamento(appuntamentoInvalido);
      
      await expect(appuntamento.save()).rejects.toThrow();
    });
    
    it('dovrebbe rifiutare un appuntamento con stato non valido', async () => {
      const dataInizio = new Date();
      const dataFine = new Date(dataInizio.getTime() + 45 * 60000);
      
      const appuntamentoInvalido = {
        cliente: cliente._id,
        servizi: [{ servizio: servizio._id, prezzo: servizio.prezzo }],
        operatore: operatore._id,
        dataOraInizio: dataInizio,
        dataOraFine: dataFine,
        stato: 'stato_non_valido'
      };
      
      const appuntamento = new Appuntamento(appuntamentoInvalido);
      
      await expect(appuntamento.save()).rejects.toThrow();
    });
  });

  describe('Funzionalità di business', () => {
    it('dovrebbe calcolare correttamente la durata dell\'appuntamento', async () => {
      const dataInizio = new Date();
      const dataFine = new Date(dataInizio.getTime() + 60 * 60000); // +60 minuti
      
      const appuntamento = new Appuntamento({
        cliente: cliente._id,
        servizi: [{ servizio: servizio._id, prezzo: servizio.prezzo }],
        operatore: operatore._id,
        dataOraInizio: dataInizio,
        dataOraFine: dataFine,
        stato: 'prenotato'
      });
      
      await appuntamento.save();
      
      // Calcola la durata in minuti
      const durata = (appuntamento.dataOraFine - appuntamento.dataOraInizio) / 60000;
      expect(durata).toBe(60); // 60 minuti
    });
    
    it('dovrebbe aggiornare correttamente lo stato dell\'appuntamento', async () => {
      const dataInizio = new Date();
      const dataFine = new Date(dataInizio.getTime() + 45 * 60000);
      
      const appuntamento = new Appuntamento({
        cliente: cliente._id,
        servizi: [{ servizio: servizio._id, prezzo: servizio.prezzo }],
        operatore: operatore._id,
        dataOraInizio: dataInizio,
        dataOraFine: dataFine,
        stato: 'prenotato'
      });
      
      await appuntamento.save();
      
      // Modifica lo stato
      appuntamento.stato = 'completato';
      await appuntamento.save();
      
      // Verifica lo stato aggiornato
      const appuntamentoAggiornato = await Appuntamento.findById(appuntamento._id);
      expect(appuntamentoAggiornato.stato).toBe('completato');
    });
    
    it('dovrebbe calcolare correttamente l\'importo totale dei servizi', async () => {
      // Crea un secondo servizio
      const servizio2 = new Servizio({
        nome: 'Pedicure',
        descrizione: 'Trattamento completo per i piedi',
        durata: 60,
        prezzo: 40,
        categoria: 'Piedi'
      });
      await servizio2.save();
      
      // Crea appuntamento con due servizi
      const dataInizio = new Date();
      const dataFine = new Date(dataInizio.getTime() + 105 * 60000); // +105 minuti
      
      const appuntamento = new Appuntamento({
        cliente: cliente._id,
        servizi: [
          { servizio: servizio._id, prezzo: servizio.prezzo },
          { servizio: servizio2._id, prezzo: servizio2.prezzo }
        ],
        operatore: operatore._id,
        dataOraInizio: dataInizio,
        dataOraFine: dataFine,
        stato: 'prenotato'
      });
      
      await appuntamento.save();
      
      // Calcola il totale
      const totale = appuntamento.servizi.reduce((sum, s) => sum + s.prezzo, 0);
      expect(totale).toBe(70); // 30 + 40 = 70
    });
  });
});
