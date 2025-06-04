const nodemailer = require('nodemailer');
const Invio = require('../models/invio.model');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Configurazione del trasportatore email
    // In produzione, utilizzare le credenziali reali del servizio email
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    });
  }

  // Inviare email per una campagna
  async inviaEmailCampagna(campagna, clienti) {
    const risultati = {
      successi: 0,
      fallimenti: 0,
      invii: []
    };

    for (const cliente of clienti) {
      try {
        const emailContent = this.personalizzaContenuto(campagna.contenuto, cliente);
        
        const mailOptions = {
          from: process.env.EMAIL_FROM || 'noreply@saloon-crm.com',
          to: cliente.email,
          subject: emailContent.oggetto,
          html: emailContent.corpo,
          // Aggiungi header per tracking
          headers: {
            'X-Campaign-ID': campagna._id.toString(),
            'X-Customer-ID': cliente._id.toString()
          }
        };

        // Creare record di invio
        const invio = new Invio({
          campagna: campagna._id,
          cliente: cliente._id,
          tipo: 'email',
          stato: 'queued',
          email: {
            destinatario: cliente.email,
            oggetto: emailContent.oggetto
          }
        });

        await invio.save();

        // Simulare l'invio in sviluppo
        if (process.env.NODE_ENV === 'development') {
          console.log(`[SIMULAZIONE EMAIL] A: ${cliente.email}, Oggetto: ${emailContent.oggetto}`);
          invio.stato = 'sent';
          invio.dataInvio = new Date();
          await invio.save();
          risultati.successi++;
        } else {
          // Invio reale dell'email
          await this.transporter.sendMail(mailOptions);
          invio.stato = 'sent';
          invio.dataInvio = new Date();
          await invio.save();
          risultati.successi++;
        }

        risultati.invii.push({
          cliente: cliente._id,
          email: cliente.email,
          stato: 'success',
          invioId: invio._id
        });

      } catch (error) {
        console.error(`Errore invio email a ${cliente.email}:`, error);
        
        // Aggiornare il record di invio con l'errore
        const invio = await Invio.findOne({ 
          campagna: campagna._id, 
          cliente: cliente._id 
        }).sort({ dataCreazione: -1 });
        
        if (invio) {
          invio.stato = 'failed';
          invio.errore = error.message;
          await invio.save();
        }

        risultati.fallimenti++;
        risultati.invii.push({
          cliente: cliente._id,
          email: cliente.email,
          stato: 'error',
          errore: error.message
        });
      }
    }

    return risultati;
  }

  // Personalizzare il contenuto dell'email
  personalizzaContenuto(contenuto, cliente) {
    let oggetto = contenuto.oggetto || '';
    let corpo = contenuto.corpo || '';

    // Sostituzioni personalizzate
    const sostituzioni = {
      '{{nome}}': cliente.nome || '',
      '{{cognome}}': cliente.cognome || '',
      '{{email}}': cliente.email || '',
      '{{telefono}}': cliente.telefono || '',
      '{{nome_completo}}': `${cliente.nome || ''} ${cliente.cognome || ''}`.trim()
    };

    // Applicare le sostituzioni
    Object.keys(sostituzioni).forEach(placeholder => {
      oggetto = oggetto.replace(new RegExp(placeholder, 'g'), sostituzioni[placeholder]);
      corpo = corpo.replace(new RegExp(placeholder, 'g'), sostituzioni[placeholder]);
    });

    return {
      oggetto: oggetto,
      corpo: corpo
    };
  }

  // Inviare email di test
  async inviaEmailTest(campagna, emailTest) {
    try {
      const clienteTest = {
        nome: 'Test',
        cognome: 'User',
        email: emailTest,
        telefono: '123456789'
      };

      const emailContent = this.personalizzaContenuto(campagna.contenuto, clienteTest);
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@saloon-crm.com',
        to: emailTest,
        subject: `[TEST] ${emailContent.oggetto}`,
        html: `
          <div style="background-color: #f0f0f0; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #e74c3c;">🧪 QUESTA È UN'EMAIL DI TEST</h3>
            <p><strong>Campagna:</strong> ${campagna.nome}</p>
            <p><strong>Data test:</strong> ${new Date().toLocaleString('it-IT')}</p>
          </div>
          ${emailContent.corpo}
        `
      };

      if (process.env.NODE_ENV === 'development') {
        console.log(`[TEST EMAIL] A: ${emailTest}, Oggetto: ${mailOptions.subject}`);
        return { success: true, message: 'Email di test simulata' };
      } else {
        await this.transporter.sendMail(mailOptions);
        return { success: true, message: 'Email di test inviata' };
      }
    } catch (error) {
      console.error('Errore invio email di test:', error);
      throw error;
    }
  }

  // Tracciare apertura email
  async tracciaApertura(invioId) {
    try {
      const invio = await Invio.findById(invioId);
      if (invio) {
        if (!invio.email.aperture.includes(new Date().toDateString())) {
          invio.email.aperture.push(new Date());
          await invio.save();
        }
      }
    } catch (error) {
      console.error('Errore tracciamento apertura:', error);
    }
  }

  // Tracciare click email
  async tracciaClick(invioId, url) {
    try {
      const invio = await Invio.findById(invioId);
      if (invio) {
        invio.email.click.push({
          url: url,
          data: new Date()
        });
        await invio.save();
      }
    } catch (error) {
      console.error('Errore tracciamento click:', error);
    }
  }

  // Verificare la configurazione email
  async verificaConfigurazione() {
    try {
      if (process.env.NODE_ENV === 'development') {
        return { valid: true, message: 'Modalità sviluppo - email simulate' };
      }
      
      await this.transporter.verify();
      return { valid: true, message: 'Configurazione email valida' };
    } catch (error) {
      return { valid: false, message: `Configurazione email non valida: ${error.message}` };
    }
  }

  /**
   * Invia email di conferma prenotazione
   */
  async inviaConfermaPrenotazione(appuntamento, token) {
    try {
      const servizi = appuntamento.servizi.map(s => s.nome).join(', ');
      const dataFormattata = new Date(appuntamento.dataInizio).toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const oraFormattata = new Date(appuntamento.dataInizio).toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const linkConferma = `${process.env.FRONTEND_URL}/conferma-prenotazione/${token}`;
      const linkCancellazione = `${process.env.FRONTEND_URL}/cancella-prenotazione/${token}`;

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: appuntamento.cliente.email,
        subject: 'Conferma la tua prenotazione - Centro Estetico',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e91e63;">Conferma la tua prenotazione</h2>
            
            <p>Ciao ${appuntamento.cliente.nome},</p>
            
            <p>Grazie per aver scelto il nostro centro estetico! Abbiamo ricevuto la tua richiesta di prenotazione:</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Dettagli prenotazione:</h3>
              <p><strong>Servizi:</strong> ${servizi}</p>
              <p><strong>Data:</strong> ${dataFormattata}</p>
              <p><strong>Ora:</strong> ${oraFormattata}</p>
              <p><strong>Durata totale:</strong> ${appuntamento.durata} minuti</p>
              <p><strong>Prezzo totale:</strong> €${appuntamento.prezzoTotale}</p>
              ${appuntamento.sala ? `<p><strong>Sala:</strong> ${appuntamento.sala.nome}</p>` : ''}
              ${appuntamento.note ? `<p><strong>Note:</strong> ${appuntamento.note}</p>` : ''}
            </div>
            
            <p style="color: #ff9800; font-weight: bold;">⚠️ IMPORTANTE: Per completare la prenotazione è necessario confermarla cliccando sul pulsante qui sotto entro 24 ore.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${linkConferma}" style="background-color: #e91e63; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                CONFERMA PRENOTAZIONE
              </a>
            </div>
            
            <p>Se non riesci a cliccare il pulsante, copia e incolla questo link nel tuo browser:</p>
            <p style="word-break: break-all; color: #666;">${linkConferma}</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            
            <p>Se desideri cancellare questa prenotazione, puoi farlo cliccando su questo link:</p>
            <p><a href="${linkCancellazione}" style="color: #f44336;">Cancella prenotazione</a></p>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              Questo messaggio è stato inviato automaticamente. Si prega di non rispondere a questa email.
              <br>Centro Estetico - ${process.env.BUSINESS_NAME || 'Beauty Center'}
            </p>
          </div>
        `
      };

      if (process.env.NODE_ENV === 'development') {
        console.log(`[SIMULAZIONE EMAIL CONFERMA] A: ${appuntamento.cliente.email}`);
        return { success: true };
      } else {
        await this.transporter.sendMail(mailOptions);
        console.log(`Email di conferma inviata a ${appuntamento.cliente.email}`);
        return { success: true };
      }

    } catch (error) {
      console.error('Errore invio email conferma:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Invia email di conferma avvenuta
   */
  async inviaPrenotazioneConfermata(appuntamento) {
    try {
      const servizi = appuntamento.servizi.map(s => s.nome).join(', ');
      const dataFormattata = new Date(appuntamento.dataInizio).toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const oraFormattata = new Date(appuntamento.dataInizio).toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: appuntamento.cliente.email,
        subject: 'Prenotazione confermata! - Centro Estetico',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4caf50;">✅ Prenotazione confermata!</h2>
            
            <p>Ciao ${appuntamento.cliente.nome},</p>
            
            <p>Perfetto! La tua prenotazione è stata confermata con successo. Ti aspettiamo!</p>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
              <h3 style="margin-top: 0; color: #333;">Dettagli appuntamento:</h3>
              <p><strong>Servizi:</strong> ${servizi}</p>
              <p><strong>Data:</strong> ${dataFormattata}</p>
              <p><strong>Ora:</strong> ${oraFormattata}</p>
              <p><strong>Durata totale:</strong> ${appuntamento.durata} minuti</p>
              <p><strong>Prezzo totale:</strong> €${appuntamento.prezzoTotale}</p>
              ${appuntamento.sala ? `<p><strong>Sala:</strong> ${appuntamento.sala.nome}</p>` : ''}
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #856404;">📍 Come raggiungerci:</h4>
              <p style="margin-bottom: 0;">${process.env.BUSINESS_ADDRESS || 'Indirizzo del centro estetico'}</p>
            </div>
            
            <div style="background-color: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #0c5460;">💡 Consigli utili:</h4>
              <ul style="margin-bottom: 0;">
                <li>Arriva 10 minuti prima dell'appuntamento</li>
                <li>Porta un documento di identità</li>
                <li>Comunica eventuali allergie o problemi di salute</li>
                <li>Per cancellazioni o modifiche contattaci almeno 24 ore prima</li>
              </ul>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              Per qualsiasi domanda o necessità, non esitare a contattarci al ${process.env.BUSINESS_PHONE || 'XXX XXX XXXX'}
              <br>Centro Estetico - ${process.env.BUSINESS_NAME || 'Beauty Center'}
            </p>
          </div>
        `
      };

      if (process.env.NODE_ENV === 'development') {
        console.log(`[SIMULAZIONE EMAIL CONFERMA AVVENUTA] A: ${appuntamento.cliente.email}`);
        return { success: true };
      } else {
        await this.transporter.sendMail(mailOptions);
        console.log(`Email di conferma avvenuta inviata a ${appuntamento.cliente.email}`);
        return { success: true };
      }

    } catch (error) {
      console.error('Errore invio email conferma avvenuta:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Invia email di cancellazione
   */
  async inviaPrenotazioneCancellata(appuntamento, motivoCancellazione = '') {
    try {
      const servizi = appuntamento.servizi.map(s => s.nome).join(', ');
      const dataFormattata = new Date(appuntamento.dataInizio).toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const oraFormattata = new Date(appuntamento.dataInizio).toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: appuntamento.cliente.email,
        subject: 'Prenotazione cancellata - Centro Estetico',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f44336;">Prenotazione cancellata</h2>
            
            <p>Ciao ${appuntamento.cliente.nome},</p>
            
            <p>La tua prenotazione è stata cancellata come richiesto.</p>
            
            <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f44336;">
              <h3 style="margin-top: 0; color: #333;">Dettagli prenotazione cancellata:</h3>
              <p><strong>Servizi:</strong> ${servizi}</p>
              <p><strong>Data:</strong> ${dataFormattata}</p>
              <p><strong>Ora:</strong> ${oraFormattata}</p>
              <p><strong>Prezzo totale:</strong> €${appuntamento.prezzoTotale}</p>
              ${motivoCancellazione ? `<p><strong>Motivo:</strong> ${motivoCancellazione}</p>` : ''}
            </div>
            
            <p>Ci dispiace che tu non possa venire. Speriamo di vederti presto per coccolarti con i nostri trattamenti!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/prenota" style="background-color: #e91e63; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                PRENOTA DI NUOVO
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              Per prenotare un nuovo appuntamento, visita il nostro sito o contattaci al ${process.env.BUSINESS_PHONE || 'XXX XXX XXXX'}
              <br>Centro Estetico - ${process.env.BUSINESS_NAME || 'Beauty Center'}
            </p>
          </div>
        `
      };

      if (process.env.NODE_ENV === 'development') {
        console.log(`[SIMULAZIONE EMAIL CANCELLAZIONE] A: ${appuntamento.cliente.email}`);
        return { success: true };
      } else {
        await this.transporter.sendMail(mailOptions);
        console.log(`Email di cancellazione inviata a ${appuntamento.cliente.email}`);
        return { success: true };
      }

    } catch (error) {
      console.error('Errore invio email cancellazione:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Invia reminder dell'appuntamento
   */
  async inviaReminderAppuntamento(appuntamento, tipoReminder = '24h') {
    try {
      const servizi = appuntamento.servizi.map(s => s.nome).join(', ');
      const dataFormattata = new Date(appuntamento.dataInizio).toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const oraFormattata = new Date(appuntamento.dataInizio).toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
      });

      let oggetto, titolo, messaggio;
      
      switch (tipoReminder) {
        case '24h':
          oggetto = 'Reminder: Appuntamento domani';
          titolo = '📅 Il tuo appuntamento è domani!';
          messaggio = 'Ti ricordiamo che domani hai un appuntamento presso il nostro centro estetico.';
          break;
        case '2h':
          oggetto = 'Reminder: Appuntamento tra 2 ore';
          titolo = '⏰ Il tuo appuntamento è tra 2 ore!';
          messaggio = 'Ti ricordiamo che tra 2 ore hai un appuntamento presso il nostro centro estetico.';
          break;
        default:
          oggetto = 'Reminder: Hai un appuntamento';
          titolo = '📅 Reminder appuntamento';
          messaggio = 'Ti ricordiamo del tuo prossimo appuntamento presso il nostro centro estetico.';
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: appuntamento.cliente.email,
        subject: oggetto,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e91e63;">${titolo}</h2>
            
            <p>Ciao ${appuntamento.cliente.nome},</p>
            
            <p>${messaggio}</p>
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
              <h3 style="margin-top: 0; color: #333;">Dettagli appuntamento:</h3>
              <p><strong>Servizi:</strong> ${servizi}</p>
              <p><strong>Data:</strong> ${dataFormattata}</p>
              <p><strong>Ora:</strong> ${oraFormattata}</p>
              <p><strong>Durata totale:</strong> ${appuntamento.durata} minuti</p>
              ${appuntamento.sala ? `<p><strong>Sala:</strong> ${appuntamento.sala.nome}</p>` : ''}
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #856404;">📍 Dove trovarci:</h4>
              <p style="margin-bottom: 0;">${process.env.BUSINESS_ADDRESS || 'Indirizzo del centro estetico'}</p>
            </div>
            
            <p style="color: #ff9800;">⚠️ Ti preghiamo di arrivare 10 minuti prima dell'orario previsto.</p>
            
            <p>Se hai bisogno di modificare o cancellare l'appuntamento, ti preghiamo di contattarci il prima possibile.</p>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              Per qualsiasi necessità: ${process.env.BUSINESS_PHONE || 'XXX XXX XXXX'}
              <br>Centro Estetico - ${process.env.BUSINESS_NAME || 'Beauty Center'}
            </p>
          </div>
        `
      };

      if (process.env.NODE_ENV === 'development') {
        console.log(`[SIMULAZIONE EMAIL REMINDER ${tipoReminder}] A: ${appuntamento.cliente.email}`);
        return { success: true };
      } else {
        await this.transporter.sendMail(mailOptions);
        console.log(`Email reminder ${tipoReminder} inviata a ${appuntamento.cliente.email}`);
        return { success: true };
      }

    } catch (error) {
      console.error('Errore invio email reminder:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
