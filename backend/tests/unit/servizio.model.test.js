const mongoose = require('mongoose');
const Servizio = require('../../src/models/servizio.model');

describe('Servizio Model Test', () => {
  describe('Validazione schema', () => {
    it('dovrebbe validare un servizio corretto', async () => {
      const servizioValido = {
        nome: 'Manicure Completa',
        descrizione: 'Trattamento completo per le unghie',
        durata: 60,
        prezzo: 40,
        categoria: 'Mani',
        attivo: true
      };
      
      const servizio = new Servizio(servizioValido);
      const saved = await servizio.save();
      
      expect(saved._id).toBeDefined();
      expect(saved.nome).toBe(servizioValido.nome);
      expect(saved.descrizione).toBe(servizioValido.descrizione);
      expect(saved.durata).toBe(servizioValido.durata);
      expect(saved.prezzo).toBe(servizioValido.prezzo);
      expect(saved.categoria).toBe(servizioValido.categoria);
      expect(saved.attivo).toBe(servizioValido.attivo);
    });
    
    it('dovrebbe rifiutare un servizio senza nome', async () => {
      const servizioInvalido = {
        descrizione: 'Trattamento completo per le unghie',
        durata: 60,
        prezzo: 40,
        categoria: 'Mani'
      };
      
      const servizio = new Servizio(servizioInvalido);
      
      await expect(servizio.save()).rejects.toThrow();
    });
    
    it('dovrebbe rifiutare un servizio senza durata', async () => {
      const servizioInvalido = {
        nome: 'Manicure Completa',
        descrizione: 'Trattamento completo per le unghie',
        prezzo: 40,
        categoria: 'Mani'
      };
      
      const servizio = new Servizio(servizioInvalido);
      
      await expect(servizio.save()).rejects.toThrow();
    });
    
    it('dovrebbe rifiutare un servizio senza prezzo', async () => {
      const servizioInvalido = {
        nome: 'Manicure Completa',
        descrizione: 'Trattamento completo per le unghie',
        durata: 60,
        categoria: 'Mani'
      };
      
      const servizio = new Servizio(servizioInvalido);
      
      await expect(servizio.save()).rejects.toThrow();
    });
    
    it('dovrebbe rifiutare un servizio senza categoria', async () => {
      const servizioInvalido = {
        nome: 'Manicure Completa',
        descrizione: 'Trattamento completo per le unghie',
        durata: 60,
        prezzo: 40
      };
      
      const servizio = new Servizio(servizioInvalido);
      
      await expect(servizio.save()).rejects.toThrow();
    });
  });

  describe('Funzionalità di business', () => {
    it('dovrebbe aggiornare il campo updatedAt alla modifica', async () => {
      // Crea un servizio
      const servizio = new Servizio({
        nome: 'Manicure Base',
        descrizione: 'Trattamento base per unghie',
        durata: 45,
        prezzo: 30,
        categoria: 'Mani',
        attivo: true
      });
      
      const savedServizio = await servizio.save();
      expect(savedServizio._id).toBeDefined();

      // Salva il timestamp originale
      const originalTimestamp = savedServizio.updatedAt;
      
      // Attendi un momento per assicurarti che il timestamp cambi
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Recupera il servizio dal database
      const foundServizio = await Servizio.findById(savedServizio._id);
      expect(foundServizio).not.toBeNull();

      // Modifica e salva nuovamente il servizio
      foundServizio.prezzo = 35;
      const updatedServizio = await foundServizio.save();
      
      // Verifica che il timestamp di aggiornamento sia stato modificato
      expect(updatedServizio.updatedAt).not.toEqual(originalTimestamp);
    });
    
    it('dovrebbe attivare/disattivare il servizio correttamente', async () => {
      // Crea un servizio attivo
      const servizio = new Servizio({
        nome: 'Servizio Test Attivazione',
        descrizione: 'Servizio per test di attivazione/disattivazione',
        durata: 30,
        prezzo: 25,
        categoria: 'Test',
        attivo: true
      });
      
      await servizio.save();
      expect(servizio.attivo).toBe(true);
      
      // Disattiva il servizio
      servizio.attivo = false;
      await servizio.save();
      
      // Verifica che il servizio sia disattivato
      const servizioAggiornato = await Servizio.findById(servizio._id);
      expect(servizioAggiornato.attivo).toBe(false);
    });
    
    it('dovrebbe gestire correttamente la prenotazione online', async () => {
      // Crea un servizio non prenotabile online
      const servizio = new Servizio({
        nome: 'Servizio Test Prenotazione',
        descrizione: 'Servizio per test di prenotazione online',
        durata: 60,
        prezzo: 50,
        categoria: 'Test',
        prenotabileOnline: false
      });
      
      await servizio.save();
      expect(servizio.prenotabileOnline).toBe(false);
      
      // Rendi il servizio prenotabile online
      servizio.prenotabileOnline = true;
      await servizio.save();
      
      // Verifica che il servizio sia ora prenotabile online
      const servizioAggiornato = await Servizio.findById(servizio._id);
      expect(servizioAggiornato.prenotabileOnline).toBe(true);
    });
  });
});
