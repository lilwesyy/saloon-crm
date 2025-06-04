const Appuntamento = require('../models/appuntamento.model');

class SalaService {
  constructor() {
    // Configurazione predefinita delle sale
    this.saleDisponibili = [
      {
        id: 'sala1',
        nome: 'Sala Benessere',
        descrizione: 'Sala principale per trattamenti viso e corpo',
        capacita: 1,
        attrezzature: ['lettino professionale', 'vaporizzatore', 'lampada LED'],
        tipiServizio: ['trattamento viso', 'pulizia viso', 'idratazione'],
        attiva: true
      },
      {
        id: 'sala2', 
        nome: 'Sala Relax',
        descrizione: 'Ambiente rilassante per massaggi e trattamenti corpo',
        capacita: 1,
        attrezzature: ['lettino da massaggio', 'sistema audio', 'aromaterapia'],
        tipiServizio: ['massaggio', 'trattamento corpo', 'riflessologia'],
        attiva: true
      },
      {
        id: 'sala3',
        nome: 'Sala Beauty',
        descrizione: 'Dedicata a trucco, manicure e pedicure',
        capacita: 2,
        attrezzature: ['postazione trucco', 'poltrona pedicure', 'lampada UV'],
        tipiServizio: ['manicure', 'pedicure', 'trucco', 'sopracciglia'],
        attiva: true
      },
      {
        id: 'sala4',
        nome: 'Sala VIP',
        descrizione: 'Suite privata per clienti premium',
        capacita: 1,
        attrezzature: ['lettino premium', 'doccia privata', 'area relax'],
        tipiServizio: ['tutti'],
        attiva: true,
        premium: true
      }
    ];
  }

  /**
   * Ottiene tutte le sale disponibili
   */
  getSaleDisponibili() {
    return this.saleDisponibili.filter(sala => sala.attiva);
  }

  /**
   * Ottiene una sala specifica per ID
   */
  getSalaById(salaId) {
    return this.saleDisponibili.find(sala => sala.id === salaId);
  }

  /**
   * Controlla la disponibilità di una sala in un determinato orario
   */
  async verificaDisponibilitaSala(salaId, dataInizio, dataFine, appuntamentoEscluso = null) {
    try {
      const filter = {
        sala: salaId,
        stato: { $in: ['prenotato', 'confermato'] },
        $or: [
          {
            dataOraInizio: { $lt: new Date(dataFine) },
            dataOraFine: { $gt: new Date(dataInizio) }
          }
        ]
      };

      // Escludi un appuntamento specifico (utile per modifiche)
      if (appuntamentoEscluso) {
        filter._id = { $ne: appuntamentoEscluso };
      }

      const appuntamentiSovrapposti = await Appuntamento.find(filter);
      return appuntamentiSovrapposti.length === 0;

    } catch (error) {
      console.error('Errore verifica disponibilità sala:', error);
      return false;
    }
  }

  /**
   * Trova le sale disponibili per un determinato periodo
   */
  async getSaleDisponibiliPerPeriodo(dataInizio, dataFine, tipoServizio = null) {
    try {
      const saleDisponibili = [];

      for (const sala of this.getSaleDisponibili()) {
        // Filtra per tipo di servizio se specificato
        if (tipoServizio && 
            !sala.tipiServizio.includes('tutti') && 
            !sala.tipiServizio.includes(tipoServizio)) {
          continue;
        }

        const disponibile = await this.verificaDisponibilitaSala(
          sala.id, 
          dataInizio, 
          dataFine
        );

        if (disponibile) {
          saleDisponibili.push(sala);
        }
      }

      return saleDisponibili;

    } catch (error) {
      console.error('Errore ricerca sale disponibili:', error);
      return [];
    }
  }

  /**
   * Suggerisce la sala migliore per un servizio
   */
  async suggerisciSala(tipoServizio, dataInizio, dataFine, clientePremium = false) {
    try {
      const saleDisponibili = await this.getSaleDisponibiliPerPeriodo(
        dataInizio, 
        dataFine, 
        tipoServizio
      );

      if (saleDisponibili.length === 0) {
        return null;
      }

      // Priorità per clienti premium
      if (clientePremium) {
        const salaPremium = saleDisponibili.find(sala => sala.premium);
        if (salaPremium) {
          return salaPremium;
        }
      }

      // Trova la sala più adatta per il tipo di servizio
      let salaMigliore = saleDisponibili[0];
      
      for (const sala of saleDisponibili) {
        // Preferisci sale specifiche per il servizio
        if (sala.tipiServizio.includes(tipoServizio) && 
            !salaMigliore.tipiServizio.includes(tipoServizio)) {
          salaMigliore = sala;
        }
        
        // In caso di parità, preferisci sala con meno capacità (più intima)
        if (sala.tipiServizio.includes(tipoServizio) === 
            salaMigliore.tipiServizio.includes(tipoServizio) &&
            sala.capacita < salaMigliore.capacita) {
          salaMigliore = sala;
        }
      }

      return salaMigliore;

    } catch (error) {
      console.error('Errore suggerimento sala:', error);
      return null;
    }
  }

  /**
   * Ottiene il planning settimanale delle sale
   */
  async getPlanningSettimanale(dataInizio) {
    try {
      const dataFine = new Date(dataInizio);
      dataFine.setDate(dataFine.getDate() + 7);

      const appuntamenti = await Appuntamento.find({
        dataOraInizio: { $gte: dataInizio, $lt: dataFine },
        stato: { $in: ['prenotato', 'confermato'] },
        sala: { $exists: true, $ne: null }
      })
      .populate('cliente', 'nome cognome')
      .populate('operatore', 'nome cognome')
      .populate('servizi.servizio', 'nome durata')
      .sort({ dataOraInizio: 1 });

      // Raggruppa per sala e giorno
      const planning = {};
      
      for (const sala of this.getSaleDisponibili()) {
        planning[sala.id] = {
          sala: sala,
          giorni: {}
        };

        // Inizializza i giorni della settimana
        for (let i = 0; i < 7; i++) {
          const giorno = new Date(dataInizio);
          giorno.setDate(giorno.getDate() + i);
          const chiaveGiorno = giorno.toISOString().split('T')[0];
          
          planning[sala.id].giorni[chiaveGiorno] = {
            data: giorno,
            appuntamenti: []
          };
        }
      }

      // Assegna gli appuntamenti ai giorni e sale corrispondenti
      appuntamenti.forEach(app => {
        if (planning[app.sala]) {
          const chiaveGiorno = app.dataOraInizio.toISOString().split('T')[0];
          if (planning[app.sala].giorni[chiaveGiorno]) {
            planning[app.sala].giorni[chiaveGiorno].appuntamenti.push(app);
          }
        }
      });

      return planning;

    } catch (error) {
      console.error('Errore recupero planning settimanale:', error);
      return {};
    }
  }

  /**
   * Calcola statistiche di utilizzo delle sale
   */
  async getStatisticheSale(dataInizio, dataFine) {
    try {
      const appuntamenti = await Appuntamento.find({
        dataOraInizio: { $gte: dataInizio, $lte: dataFine },
        stato: { $in: ['prenotato', 'confermato', 'completato'] },
        sala: { $exists: true, $ne: null }
      });

      const statistiche = {};

      // Inizializza statistiche per ogni sala
      for (const sala of this.getSaleDisponibili()) {
        statistiche[sala.id] = {
          sala: sala,
          totaleAppuntamenti: 0,
          oreUtilizzo: 0,
          ricavoTotale: 0,
          utilizzoPercentuale: 0,
          serviziPiuRichiesti: {}
        };
      }

      // Calcola statistiche
      for (const app of appuntamenti) {
        if (statistiche[app.sala]) {
          const stat = statistiche[app.sala];
          stat.totaleAppuntamenti++;

          // Calcola ore di utilizzo
          const durata = (new Date(app.dataOraFine) - new Date(app.dataOraInizio)) / (1000 * 60 * 60);
          stat.oreUtilizzo += durata;

          // Calcola ricavo
          const ricavo = app.servizi.reduce((sum, s) => sum + s.prezzo, 0);
          stat.ricavoTotale += ricavo;

          // Conta servizi più richiesti
          app.servizi.forEach(s => {
            const nomeServizio = s.servizio.nome || 'Servizio sconosciuto';
            stat.serviziPiuRichiesti[nomeServizio] = 
              (stat.serviziPiuRichiesti[nomeServizio] || 0) + 1;
          });
        }
      }

      // Calcola percentuale di utilizzo (assumendo 8 ore lavorative al giorno)
      const giorni = Math.ceil((dataFine - dataInizio) / (1000 * 60 * 60 * 24));
      const oreLavorativeDisponibili = giorni * 8; // 8 ore per giorno

      Object.values(statistiche).forEach(stat => {
        if (oreLavorativeDisponibili > 0) {
          stat.utilizzoPercentuale = (stat.oreUtilizzo / oreLavorativeDisponibili) * 100;
        }
      });

      return statistiche;

    } catch (error) {
      console.error('Errore calcolo statistiche sale:', error);
      return {};
    }
  }

  /**
   * Ottiene suggerimenti per ottimizzazione dell'uso delle sale
   */
  async getSuggerimentiOttimizzazione(dataInizio, dataFine) {
    try {
      const statistiche = await this.getStatisticheSale(dataInizio, dataFine);
      const suggerimenti = [];

      Object.values(statistiche).forEach(stat => {
        if (stat.utilizzoPercentuale < 30) {
          suggerimenti.push({
            tipo: 'sottoutilizzo',
            sala: stat.sala.nome,
            utilizzo: stat.utilizzoPercentuale.toFixed(1),
            messaggio: `La ${stat.sala.nome} ha un utilizzo molto basso (${stat.utilizzoPercentuale.toFixed(1)}%). Considera di promuovere i servizi adatti a questa sala.`
          });
        } else if (stat.utilizzoPercentuale > 85) {
          suggerimenti.push({
            tipo: 'sovrautilizzo',
            sala: stat.sala.nome,
            utilizzo: stat.utilizzoPercentuale.toFixed(1),
            messaggio: `La ${stat.sala.nome} ha un utilizzo molto alto (${stat.utilizzoPercentuale.toFixed(1)}%). Considera di espandere gli orari o aggiungere una sala simile.`
          });
        }

        if (stat.totaleAppuntamenti > 0) {
          const ricavoMedio = stat.ricavoTotale / stat.totaleAppuntamenti;
          if (ricavoMedio < 50) {
            suggerimenti.push({
              tipo: 'ricavo_basso',
              sala: stat.sala.nome,
              ricavoMedio: ricavoMedio.toFixed(2),
              messaggio: `Il ricavo medio per appuntamento nella ${stat.sala.nome} è basso (€${ricavoMedio.toFixed(2)}). Considera di proporre servizi aggiuntivi o pacchetti.`
            });
          }
        }
      });

      return suggerimenti;

    } catch (error) {
      console.error('Errore generazione suggerimenti:', error);
      return [];
    }
  }
}

module.exports = new SalaService();
