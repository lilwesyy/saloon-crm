const Invio = require('../models/invio.model');

class SMSService {
  constructor() {
    this.apiKey = process.env.SMS_API_KEY || '';
    this.apiUrl = process.env.SMS_API_URL || 'https://api.smsgateway.com/send';
  }

  // Inviare SMS per una campagna
  async inviaSMSCampagna(campagna, clienti) {
    const risultati = {
      successi: 0,
      fallimenti: 0,
      invii: []
    };

    for (const cliente of clienti) {
      try {
        if (!cliente.telefono) {
          throw new Error('Numero di telefono mancante');
        }

        const testoPersonalizzato = this.personalizzaTesto(campagna.contenuto.corpo, cliente);
        
        // Creare record di invio
        const invio = new Invio({
          campagna: campagna._id,
          cliente: cliente._id,
          tipo: 'sms',
          stato: 'queued',
          sms: {
            destinatario: cliente.telefono,
            testo: testoPersonalizzato
          }
        });

        await invio.save();

        // Simulare l'invio in sviluppo
        if (process.env.NODE_ENV === 'development') {
          console.log(`[SIMULAZIONE SMS] A: ${cliente.telefono}, Testo: ${testoPersonalizzato}`);
          invio.stato = 'sent';
          invio.dataInvio = new Date();
          await invio.save();
          risultati.successi++;
        } else {
          // Invio reale dell'SMS
          await this.inviaSMS(cliente.telefono, testoPersonalizzato);
          invio.stato = 'sent';
          invio.dataInvio = new Date();
          await invio.save();
          risultati.successi++;
        }

        risultati.invii.push({
          cliente: cliente._id,
          telefono: cliente.telefono,
          stato: 'success',
          invioId: invio._id
        });

      } catch (error) {
        console.error(`Errore invio SMS a ${cliente.telefono}:`, error);
        
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
          telefono: cliente.telefono,
          stato: 'error',
          errore: error.message
        });
      }
    }

    return risultati;
  }

  // Inviare singolo SMS
  async inviaSMS(numeroTelefono, testo) {
    if (process.env.NODE_ENV === 'development') {
      // Simulazione in sviluppo
      return { success: true, messageId: 'sim_' + Date.now() };
    }

    // Implementazione reale con provider SMS
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          to: numeroTelefono,
          message: testo,
          from: process.env.SMS_FROM || 'SaloonCRM'
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Errore invio SMS');
      }

      return result;
    } catch (error) {
      console.error('Errore invio SMS:', error);
      throw error;
    }
  }

  // Personalizzare il testo dell'SMS
  personalizzaTesto(testo, cliente) {
    let testoPersonalizzato = testo || '';

    // Sostituzioni personalizzate
    const sostituzioni = {
      '{{nome}}': cliente.nome || '',
      '{{cognome}}': cliente.cognome || '',
      '{{telefono}}': cliente.telefono || '',
      '{{nome_completo}}': `${cliente.nome || ''} ${cliente.cognome || ''}`.trim()
    };

    // Applicare le sostituzioni
    Object.keys(sostituzioni).forEach(placeholder => {
      testoPersonalizzato = testoPersonalizzato.replace(
        new RegExp(placeholder, 'g'), 
        sostituzioni[placeholder]
      );
    });

    // Limitare la lunghezza dell'SMS (160 caratteri per SMS standard)
    if (testoPersonalizzato.length > 160) {
      testoPersonalizzato = testoPersonalizzato.substring(0, 157) + '...';
    }

    return testoPersonalizzato;
  }

  // Tracciare risposta SMS
  async tracciaRisposta(invioId, testoRisposta) {
    try {
      const invio = await Invio.findById(invioId);
      if (invio) {
        invio.sms.risposte.push({
          testo: testoRisposta,
          data: new Date()
        });
        await invio.save();
      }
    } catch (error) {
      console.error('Errore tracciamento risposta SMS:', error);
    }
  }

  // Verificare la configurazione SMS
  verificaConfigurazione() {
    if (process.env.NODE_ENV === 'development') {
      return { valid: true, message: 'Modalità sviluppo - SMS simulati' };
    }

    if (!this.apiKey) {
      return { valid: false, message: 'API Key SMS non configurata' };
    }

    return { valid: true, message: 'Configurazione SMS valida' };
  }

  // Validare numero di telefono
  validaNumeroTelefono(numero) {
    // Rimuovi spazi e caratteri speciali
    const numeroPulito = numero.replace(/[\s\-\(\)]/g, '');
    
    // Verifica formato italiano (+39 o 39 seguito da 9-10 cifre)
    const regexItaliano = /^(\+39|39)?[0-9]{9,10}$/;
    
    return regexItaliano.test(numeroPulito);
  }

  // Formattare numero di telefono
  formattaNumero(numero) {
    const numeroPulito = numero.replace(/[\s\-\(\)]/g, '');
    
    // Aggiungi prefisso +39 se mancante per numeri italiani
    if (numeroPulito.length === 10 && numeroPulito.startsWith('3')) {
      return '+39' + numeroPulito;
    }
    
    if (numeroPulito.startsWith('39') && numeroPulito.length === 12) {
      return '+' + numeroPulito;
    }
    
    if (!numeroPulito.startsWith('+')) {
      return '+' + numeroPulito;
    }
    
    return numeroPulito;
  }
}

module.exports = new SMSService();
