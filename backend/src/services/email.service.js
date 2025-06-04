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
}

module.exports = new EmailService();
