const Settings = require('../models/settings.model');
const { validationResult } = require('express-validator');

// Controller per le impostazioni del sistema
class SettingsController {
  // Ottiene le impostazioni di sistema
  async getSystemSettings(req, res) {
    try {
      let settings = await Settings.findOne({ type: 'system' });
      
      // Se non esistono impostazioni, crea quelle predefinite
      if (!settings) {
        settings = new Settings({
          type: 'system',
          settings: Settings.getDefaultSystemSettings()
        });
        await settings.save();
      }
      
      res.json(settings.settings);
    } catch (error) {
      console.error('Errore durante il recupero delle impostazioni di sistema:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }
  
  // Aggiorna le impostazioni di sistema
  async updateSystemSettings(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      let settings = await Settings.findOne({ type: 'system' });
      
      // Se non esistono impostazioni, crea quelle predefinite
      if (!settings) {
        settings = new Settings({
          type: 'system',
          settings: Settings.getDefaultSystemSettings()
        });
      }
      
      // Aggiorna con i dati inviati
      settings.settings = {
        ...settings.settings,
        ...req.body
      };
      
      await settings.save();
      
      res.json(settings.settings);
    } catch (error) {
      console.error('Errore durante l\'aggiornamento delle impostazioni di sistema:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }
  
  // Ottiene le impostazioni dell'utente corrente
  async getUserSettings(req, res) {
    try {
      // L'utente corrente è disponibile in req.user.userId grazie al middleware auth
      const userId = req.user.userId;
      
      let settings = await Settings.findOne({ type: 'user', userId });
      
      // Se non esistono impostazioni, crea quelle predefinite
      if (!settings) {
        settings = new Settings({
          type: 'user',
          userId,
          settings: Settings.getDefaultUserSettings()
        });
        await settings.save();
      }
      
      res.json(settings.settings);
    } catch (error) {
      console.error('Errore durante il recupero delle impostazioni utente:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }
  
  // Aggiorna le impostazioni dell'utente corrente
  async updateUserSettings(req, res) {
    try {
      // L'utente corrente è disponibile in req.user.userId grazie al middleware auth
      const userId = req.user.userId;
      
      let settings = await Settings.findOne({ type: 'user', userId });
      
      // Se non esistono impostazioni, crea quelle predefinite
      if (!settings) {
        settings = new Settings({
          type: 'user',
          userId,
          settings: Settings.getDefaultUserSettings()
        });
      }
      
      // Aggiorna con i dati inviati
      settings.settings = {
        ...settings.settings,
        ...req.body
      };
      
      await settings.save();
      
      res.json(settings.settings);
    } catch (error) {
      console.error('Errore durante l\'aggiornamento delle impostazioni utente:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }
}

module.exports = new SettingsController();
