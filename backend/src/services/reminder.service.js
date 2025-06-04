const Appuntamento = require('../models/appuntamento.model');
const emailService = require('./email.service');
const smsService = require('./sms.service');
const Cliente = require('../models/cliente.model');

class ReminderService {
  constructor() {
    // Configurazione dei tipi di reminder
    this.tipiReminder = {
      '24h': { ore: 24, descrizione: '24 ore prima' },
      '2h': { ore: 2, descrizione: '2 ore prima' },
      '30m': { ore: 0.5, descrizione: '30 minuti prima' }
    };
  }

  /**
   * Trova tutti gli appuntamenti che necessitano di reminder
   */
  async trovaAppuntamentiPerReminder() {
    try {
      const ora = new Date();
      const appuntamentiDaNotificare = [];

      // Per ogni tipo di reminder, trova gli appuntamenti corrispondenti
      for (const [tipo, config] of Object.entries(this.tipiReminder)) {
        const oraLimite = new Date(ora.getTime() + (config.ore * 60 * 60 * 1000));
        const oraMinima = new Date(ora.getTime() + ((config.ore - 0.25) * 60 * 60 * 1000)); // Finestra di 15 minuti

        const appuntamenti = await Appuntamento.find({
          dataOraInizio: {
            $gte: oraMinima,
            $lte: oraLimite
          },
          stato: { $in: ['prenotato', 'confermato'] },
          reminderInviato: false
        })
        .populate('cliente', 'nome cognome email telefono consensoMarketing')
        .populate('operatore', 'nome cognome')
        .populate('servizi.servizio', 'nome durata');

        // Aggiungi il tipo di reminder a ogni appuntamento
        appuntamenti.forEach(app => {
          appuntamentiDaNotificare.push({
            ...app.toObject(),
            tipoReminder: tipo,
            configReminder: config
          });
        });
      }

      return appuntamentiDaNotificare;
    } catch (error) {
      console.error('Errore nel trovare appuntamenti per reminder:', error);
      return [];
    }
  }

  /**
   * Invia reminder email per un appuntamento
   */
  async inviaReminderEmail(appuntamento) {
    try {
      if (!appuntamento.cliente.email || !appuntamento.cliente.consensoMarketing) {
        console.log(`Skipping email reminder per ${appuntamento.cliente.nome} - email mancante o consenso negato`);
        return false;
      }

      // Usa il nuovo servizio email per inviare il reminder
      const risultato = await emailService.inviaReminderAppuntamento(appuntamento, appuntamento.tipoReminder);
      
      if (risultato.success) {
        console.log(`Reminder email ${appuntamento.tipoReminder} inviato a ${appuntamento.cliente.email}`);
        return true;
      } else {
        console.error(`Errore invio reminder email: ${risultato.error}`);
        return false;
      }

    } catch (error) {
      console.error('Errore invio reminder email:', error);
      return false;
    }
  }

  /**
   * Invia reminder SMS per un appuntamento
   */
  async inviaReminderSMS(appuntamento) {
    try {
      if (!appuntamento.cliente.telefono || !appuntamento.cliente.consensoMarketing) {
        console.log(`Skipping SMS reminder per ${appuntamento.cliente.nome} - telefono mancante o consenso negato`);
        return false;
      }

      const dataAppuntamento = new Date(appuntamento.dataOraInizio);
      const servizi = appuntamento.servizi.map(s => s.servizio.nome).join(', ');
      
      const testoSMS = `
Promemoria appuntamento ${appuntamento.configReminder.descrizione}:
${dataAppuntamento.toLocaleDateString('it-IT')} alle ${dataAppuntamento.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
Trattamenti: ${servizi}
Operatore: ${appuntamento.operatore.nome}
Centro Estetico
      `.trim();

      // Simula l'invio in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[REMINDER SMS] A: ${appuntamento.cliente.telefono}`);
        console.log(`Testo: ${testoSMS}`);
        return true;
      }

      // Invio reale in produzione
      await smsService.inviaSMS(appuntamento.cliente.telefono, testoSMS);
      return true;

    } catch (error) {
      console.error('Errore invio reminder SMS:', error);
      return false;
    }
  }

  /**
   * Processo principale per l'invio dei reminder
   */
  async inviaReminder() {
    try {
      console.log('🔔 Inizio processo reminder appuntamenti...');
      
      const appuntamenti = await this.trovaAppuntamentiPerReminder();
      console.log(`📋 Trovati ${appuntamenti.length} appuntamenti per reminder`);

      let emailInviate = 0;
      let smsInviati = 0;
      let errori = 0;

      for (const appuntamento of appuntamenti) {
        try {
          // Invia email se il cliente ha l'email e il consenso
          if (appuntamento.cliente.email && appuntamento.cliente.consensoMarketing) {
            const emailInviata = await this.inviaReminderEmail(appuntamento);
            if (emailInviata) emailInviate++;
          }

          // Invia SMS se il cliente ha il telefono e il consenso
          if (appuntamento.cliente.telefono && appuntamento.cliente.consensoMarketing) {
            const smsInviato = await this.inviaReminderSMS(appuntamento);
            if (smsInviato) smsInviati++;
          }

          // Segna il reminder come inviato
          await Appuntamento.findByIdAndUpdate(appuntamento._id, {
            reminderInviato: true,
            dataReminderInviato: new Date()
          });

          console.log(`✅ Reminder inviato per appuntamento ${appuntamento._id} - ${appuntamento.cliente.nome} ${appuntamento.cliente.cognome}`);

        } catch (error) {
          console.error(`Errore nel processo reminder per appuntamento ${appuntamento._id}:`, error);
          errori++;
        }
      }

      const risultato = {
        appuntamentiProcessati: appuntamenti.length,
        emailInviate: emailInviate,
        smsInviati: smsInviati,
        errori: errori,
        timestamp: new Date()
      };

      console.log('✅ Processo reminder completato:', risultato);
      return risultato;

    } catch (error) {
      console.error('❌ Errore nel processo reminder:', error);
      return {
        appuntamentiProcessati: 0,
        emailInviate: 0,
        smsInviati: 0,
        errori: 1,
        timestamp: new Date(),
        errore: error.message
      };
    }
  }

  /**
   * Esegue reminder per un tipo specifico
   */
  async eseguiReminder(tipoReminder = null) {
    try {
      console.log(`🔔 Inizio esecuzione reminder ${tipoReminder || 'tutti i tipi'}...`);
      
      const ora = new Date();
      let appuntamenti = [];

      if (tipoReminder && this.tipiReminder[tipoReminder]) {
        // Esegui per un tipo specifico
        const config = this.tipiReminder[tipoReminder];
        const oraLimite = new Date(ora.getTime() + (config.ore * 60 * 60 * 1000));
        const oraMinima = new Date(ora.getTime() + ((config.ore - 0.25) * 60 * 60 * 1000));

        appuntamenti = await Appuntamento.find({
          dataOraInizio: {
            $gte: oraMinima,
            $lte: oraLimite
          },
          stato: { $in: ['prenotato', 'confermato'] },
          [`reminder${tipoReminder}Inviato`]: { $ne: true }
        })
        .populate('cliente', 'nome cognome email telefono consensoMarketing')
        .populate('operatore', 'nome cognome')
        .populate('servizi.servizio', 'nome durata');

      } else {
        // Esegui per tutti i tipi
        appuntamenti = await this.trovaAppuntamentiPerReminder();
      }

      console.log(`📋 Trovati ${appuntamenti.length} appuntamenti per reminder ${tipoReminder || 'generici'}`);

      let inviati = 0;
      let errori = 0;

      for (const appuntamento of appuntamenti) {
        try {
          let reminderInviato = false;

          // Invia email se il cliente ha l'email e il consenso
          if (appuntamento.cliente.email && appuntamento.cliente.consensoMarketing) {
            const emailInviata = await emailService.inviaReminderAppuntamento(appuntamento, tipoReminder || '24h');
            if (emailInviata.success) {
              reminderInviato = true;
            }
          }

          // Invia SMS se configurato e il cliente ha il telefono
          if (appuntamento.cliente.telefono && appuntamento.cliente.consensoMarketing) {
            const smsInviato = await this.inviaReminderSMS(appuntamento);
            if (smsInviato) {
              reminderInviato = true;
            }
          }

          if (reminderInviato) {
            // Segna il reminder specifico come inviato
            const updateData = {};
            if (tipoReminder) {
              updateData[`reminder${tipoReminder}Inviato`] = true;
              updateData[`dataReminder${tipoReminder}Inviato`] = new Date();
            } else {
              updateData.reminderInviato = true;
              updateData.dataReminderInviato = new Date();
            }

            await Appuntamento.findByIdAndUpdate(appuntamento._id, updateData);
            inviati++;
          }

        } catch (error) {
          console.error(`Errore nel processo reminder per appuntamento ${appuntamento._id}:`, error);
          errori++;
        }
      }

      const risultato = {
        tipo: tipoReminder || 'tutti',
        appuntamentiTrovati: appuntamenti.length,
        inviati: inviati,
        errori: errori,
        timestamp: new Date()
      };

      console.log(`✅ Reminder ${tipoReminder || 'generici'} completati:`, risultato);
      return risultato;

    } catch (error) {
      console.error('❌ Errore esecuzione reminder:', error);
      return {
        tipo: tipoReminder || 'tutti',
        appuntamentiTrovati: 0,
        inviati: 0,
        errori: 1,
        timestamp: new Date(),
        errore: error.message
      };
    }
  }

  /**
   * Ottiene statistiche sui reminder
   */
  async getStatisticheReminder() {
    try {
      const oggi = new Date();
      const inizioGiorno = new Date(oggi);
      inizioGiorno.setHours(0, 0, 0, 0);
      const fineGiorno = new Date(oggi);
      fineGiorno.setHours(23, 59, 59, 999);

      const statistiche = {
        oggi: {
          appuntamentiConReminder: await Appuntamento.countDocuments({
            dataOraInizio: { $gte: inizioGiorno, $lte: fineGiorno },
            reminderInviato: true
          }),
          appuntamentiSenzaReminder: await Appuntamento.countDocuments({
            dataOraInizio: { $gte: inizioGiorno, $lte: fineGiorno },
            reminderInviato: { $ne: true }
          })
        },
        prossimi7Giorni: {
          appuntamentiTotali: await Appuntamento.countDocuments({
            dataOraInizio: { 
              $gte: oggi, 
              $lte: new Date(oggi.getTime() + (7 * 24 * 60 * 60 * 1000))
            },
            stato: { $in: ['prenotato', 'confermato'] }
          })
        }
      };

      return statistiche;

    } catch (error) {
      console.error('Errore calcolo statistiche reminder:', error);
      return null;
    }
  }

  /**
   * Reset reminder per test
   */
  async resetReminder(appuntamentoId = null) {
    try {
      const updateData = {
        reminderInviato: false,
        dataReminderInviato: null,
        reminder24hInviato: false,
        dataReminder24hInviato: null,
        reminder2hInviato: false,
        dataReminder2hInviato: null,
        reminder30mInviato: false,
        dataReminder30mInviato: null
      };

      if (appuntamentoId) {
        await Appuntamento.findByIdAndUpdate(appuntamentoId, updateData);
        console.log(`Reset reminder per appuntamento ${appuntamentoId}`);
      } else {
        await Appuntamento.updateMany({}, updateData);
        console.log('Reset reminder per tutti gli appuntamenti');
      }

      return { success: true };

    } catch (error) {
      console.error('Errore reset reminder:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new ReminderService();
