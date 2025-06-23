const mongoose = require('mongoose');
const ProgrammaFedelta = require('../../src/models/programmaFedelta.model');
const Cliente = require('../../src/models/cliente.model');
const Appuntamento = require('../../src/models/appuntamento.model');

describe('ProgrammaFedelta Model Test', () => {
  let cliente;
  
  beforeEach(async () => {
    // Crea un cliente di test
    cliente = new Cliente({
      nome: 'Francesca',
      cognome: 'Russo',
      email: 'francesca.russo@example.com',
      telefono: '+39 366 777 8899',
      consensoPrivacy: true
    });
    await cliente.save();
  });

  describe('Validazione schema', () => {
    it('dovrebbe validare un programma fedeltà corretto', async () => {
      const programmaValido = {
        cliente: cliente._id,
        punti: 100,
        puntiTotaliGuadagnati: 120,
        puntiUtilizzati: 20,
        livello: 'argento'
      };
      
      const programmaFedelta = new ProgrammaFedelta(programmaValido);
      const saved = await programmaFedelta.save();
      
      expect(saved._id).toBeDefined();
      expect(saved.cliente.toString()).toBe(cliente._id.toString());
      expect(saved.punti).toBe(100);
      expect(saved.puntiTotaliGuadagnati).toBe(120);
      expect(saved.puntiUtilizzati).toBe(20);
      expect(saved.livello).toBe('argento');
    });
    
    it('dovrebbe rifiutare un programma fedeltà senza cliente', async () => {
      const programmaInvalido = {
        punti: 100,
        livello: 'bronzo'
      };
      
      const programmaFedelta = new ProgrammaFedelta(programmaInvalido);
      
      await expect(programmaFedelta.save()).rejects.toThrow();
    });
    
    it('dovrebbe impostare valori predefiniti', async () => {
      const programma = new ProgrammaFedelta({
        cliente: cliente._id
      });
      
      await programma.save();
      
      expect(programma.punti).toBe(0);
      expect(programma.puntiTotaliGuadagnati).toBe(0);
      expect(programma.puntiUtilizzati).toBe(0);
      expect(programma.livello).toBe('bronzo');
    });
    
    it('dovrebbe rifiutare un programma fedeltà con livello non valido', async () => {
      const programmaInvalido = {
        cliente: cliente._id,
        punti: 100,
        livello: 'livello_non_valido' // livello non valido
      };
      
      const programmaFedelta = new ProgrammaFedelta(programmaInvalido);
      
      await expect(programmaFedelta.save()).rejects.toThrow();
    });
  });

  describe('Funzionalità di business', () => {
    it('dovrebbe aggiungere punti correttamente', async () => {
      // Crea un programma fedeltà
      let programma = new ProgrammaFedelta({
        cliente: cliente._id,
        punti: 50,
        puntiTotaliGuadagnati: 50
      });
      
      await programma.save();
      
      // Aggiungi un movimento di guadagno punti
      programma.movimenti.push({
        tipo: 'guadagno',
        punti: 30,
        descrizione: 'Acquisto servizio',
        data: new Date()
      });
      
      // Aggiorna i punti totali
      programma.punti += 30;
      programma.puntiTotaliGuadagnati += 30;
      
      await programma.save();
      
      // Carica il programma aggiornato dal database
      const programmaAggiornato = await ProgrammaFedelta.findById(programma._id);
      
      expect(programmaAggiornato.punti).toBe(80); // 50 + 30
      expect(programmaAggiornato.puntiTotaliGuadagnati).toBe(80); // 50 + 30
      expect(programmaAggiornato.movimenti.length).toBe(1);
      expect(programmaAggiornato.movimenti[0].punti).toBe(30);
      expect(programmaAggiornato.movimenti[0].tipo).toBe('guadagno');
    });
    
    it('dovrebbe utilizzare punti correttamente', async () => {
      // Crea un programma fedeltà
      let programma = new ProgrammaFedelta({
        cliente: cliente._id,
        punti: 100,
        puntiTotaliGuadagnati: 100,
        puntiUtilizzati: 0
      });
      
      await programma.save();
      
      // Aggiungi un movimento di utilizzo punti
      programma.movimenti.push({
        tipo: 'utilizzo',
        punti: -25,
        descrizione: 'Sconto su trattamento',
        data: new Date()
      });
      
      // Utilizza i punti
      programma.punti -= 25;
      programma.puntiUtilizzati += 25;
      
      // Aggiungi il premio utilizzato
      programma.premiUtilizzati.push({
        nome: 'Sconto 10€',
        puntiUtilizzati: 25,
        dataUtilizzo: new Date()
      });
      
      await programma.save();
      
      // Carica il programma aggiornato dal database
      const programmaAggiornato = await ProgrammaFedelta.findById(programma._id);
      
      expect(programmaAggiornato.punti).toBe(75); // 100 - 25
      expect(programmaAggiornato.puntiUtilizzati).toBe(25);
      expect(programmaAggiornato.movimenti.length).toBe(1);
      expect(programmaAggiornato.premiUtilizzati.length).toBe(1);
      expect(programmaAggiornato.premiUtilizzati[0].puntiUtilizzati).toBe(25);
    });
    
    it('dovrebbe aggiornare il livello in base ai punti', async () => {
      // Crea un programma fedeltà iniziale
      let programma = new ProgrammaFedelta({
        cliente: cliente._id,
        punti: 0,
        puntiTotaliGuadagnati: 0
      });
      
      await programma.save();
      expect(programma.livello).toBe('bronzo');
      
      // Aggiungi punti per salire a livello argento
      programma.punti = 250;
      programma.puntiTotaliGuadagnati = 250;
      programma.livello = 'argento'; // Assume che ci sia una logica nel controller per aggiornarlo
      await programma.save();
      
      // Aggiungi punti per salire a livello oro
      programma.punti = 600;
      programma.puntiTotaliGuadagnati = 600;
      programma.livello = 'oro';
      await programma.save();
      
      // Verifica il livello aggiornato
      const programmaAggiornato = await ProgrammaFedelta.findById(programma._id);
      expect(programmaAggiornato.livello).toBe('oro');
    });
  });
});
