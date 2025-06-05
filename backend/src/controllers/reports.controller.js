const Appuntamento = require('../models/appuntamento.model');
const Cliente = require('../models/cliente.model');
const Pagamento = require('../models/pagamento.model');
const Servizio = require('../models/servizio.model');

class ReportsController {
  // Ottiene i dati principali per i reports
  async getReportsData(req, res) {
    try {
      const { dataInizio, dataFine } = req.query;
      
      // Validazione date
      if (!dataInizio || !dataFine) {
        return res.status(400).json({ 
          message: 'Data inizio e data fine sono obbligatorie' 
        });
      }

      const startDate = new Date(dataInizio);
      const endDate = new Date(dataFine);
      endDate.setHours(23, 59, 59, 999); // Fine giornata

      // Query base per il periodo
      const dateFilter = {
        $gte: startDate,
        $lte: endDate
      };

      // 1. Statistiche generali
      const stats = await this.getStatsGenerali(dateFilter);
      
      // 2. Servizi più richiesti
      const topServizi = await this.getTopServizi(dateFilter);
      
      // 3. Andamento mensile
      const andamentoMensile = await this.getAndamentoMensile(startDate, endDate);
      
      // 4. Clienti più fedeli
      const topClienti = await this.getTopClienti(dateFilter);

      res.json({
        stats,
        topServizi,
        andamentoMensile,
        topClienti,
        periodo: {
          dataInizio: startDate,
          dataFine: endDate
        }
      });

    } catch (error) {
      console.error('Errore nel caricamento dei reports:', error);
      res.status(500).json({ 
        message: 'Errore durante il caricamento dei reports',
        error: error.message 
      });
    }
  }

  // Statistiche generali
  async getStatsGenerali(dateFilter) {
    // Appuntamenti completati nel periodo
    const appuntamentiCompletati = await Appuntamento.find({
      dataOraInizio: dateFilter,
      stato: 'completato'
    }).populate('servizi.servizio');

    // Calcola fatturato totale
    const fatturato = appuntamentiCompletati.reduce((total, app) => {
      return total + app.servizi.reduce((servTotal, serv) => servTotal + serv.prezzo, 0);
    }, 0);

    // Conta appuntamenti
    const appuntamenti = appuntamentiCompletati.length;

    // Nuovi clienti nel periodo
    const nuoviClienti = await Cliente.countDocuments({
      createdAt: dateFilter
    });

    // Ticket medio
    const ticketMedio = appuntamenti > 0 ? fatturato / appuntamenti : 0;

    return {
      fatturato,
      appuntamenti,
      nuoviClienti,
      ticketMedio
    };
  }

  // Servizi più richiesti
  async getTopServizi(dateFilter) {
    const result = await Appuntamento.aggregate([
      {
        $match: {
          dataOraInizio: dateFilter,
          stato: 'completato'
        }
      },
      {
        $unwind: '$servizi'
      },
      {
        $lookup: {
          from: 'servizios',
          localField: 'servizi.servizio',
          foreignField: '_id',
          as: 'servizioInfo'
        }
      },
      {
        $unwind: '$servizioInfo'
      },
      {
        $group: {
          _id: '$servizi.servizio',
          nome: { $first: '$servizioInfo.nome' },
          count: { $sum: 1 },
          fatturato: { $sum: '$servizi.prezzo' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return result;
  }

  // Andamento mensile
  async getAndamentoMensile(startDate, endDate) {
    const result = await Appuntamento.aggregate([
      {
        $match: {
          dataOraInizio: {
            $gte: startDate,
            $lte: endDate
          },
          stato: 'completato'
        }
      },
      {
        $unwind: '$servizi'
      },
      {
        $group: {
          _id: {
            anno: { $year: '$dataOraInizio' },
            mese: { $month: '$dataOraInizio' }
          },
          fatturato: { $sum: '$servizi.prezzo' },
          appuntamenti: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.anno': 1,
          '_id.mese': 1
        }
      }
    ]);

    // Formatta i risultati
    return result.map(item => ({
      mese: `${item._id.mese.toString().padStart(2, '0')}/${item._id.anno}`,
      fatturato: item.fatturato,
      appuntamenti: item.appuntamenti
    }));
  }

  // Clienti più fedeli
  async getTopClienti(dateFilter) {
    const result = await Appuntamento.aggregate([
      {
        $match: {
          dataOraInizio: dateFilter,
          stato: 'completato'
        }
      },
      {
        $unwind: '$servizi'
      },
      {
        $group: {
          _id: '$cliente',
          appuntamenti: { $sum: 1 },
          spesaTotale: { $sum: '$servizi.prezzo' },
          ultimaVisita: { $max: '$dataOraInizio' }
        }
      },
      {
        $lookup: {
          from: 'clientes',
          localField: '_id',
          foreignField: '_id',
          as: 'clienteInfo'
        }
      },
      {
        $unwind: '$clienteInfo'
      },
      {
        $project: {
          _id: 1,
          nome: '$clienteInfo.nome',
          cognome: '$clienteInfo.cognome',
          email: '$clienteInfo.email',
          appuntamenti: 1,
          spesaTotale: 1,
          ultimaVisita: 1
        }
      },
      {
        $sort: { spesaTotale: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return result;
  }

  // Esporta report in CSV
  async exportReport(req, res) {
    try {
      const { dataInizio, dataFine } = req.query;
      
      if (!dataInizio || !dataFine) {
        return res.status(400).json({ 
          message: 'Data inizio e data fine sono obbligatorie' 
        });
      }

      const startDate = new Date(dataInizio);
      const endDate = new Date(dataFine);
      endDate.setHours(23, 59, 59, 999);

      // Ottieni tutti i dati per l'export
      const appuntamenti = await Appuntamento.find({
        dataOraInizio: {
          $gte: startDate,
          $lte: endDate
        },
        stato: 'completato'
      })
      .populate('cliente', 'nome cognome email telefono')
      .populate('operatore', 'nome cognome')
      .populate('servizi.servizio', 'nome categoria prezzo')
      .sort({ dataOraInizio: -1 });

      // Crea CSV
      let csv = 'Data,Cliente,Operatore,Servizi,Importo Totale\n';
      
      appuntamenti.forEach(app => {
        const data = app.dataOraInizio.toLocaleDateString('it-IT');
        const cliente = `${app.cliente.nome} ${app.cliente.cognome}`;
        const operatore = `${app.operatore.nome} ${app.operatore.cognome}`;
        const servizi = app.servizi.map(s => s.servizio.nome).join('; ');
        const importo = app.servizi.reduce((total, s) => total + s.prezzo, 0);
        
        csv += `${data},"${cliente}","${operatore}","${servizi}",${importo}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=report_${dataInizio}_${dataFine}.csv`);
      res.send(csv);

    } catch (error) {
      console.error('Errore nell\'export del report:', error);
      res.status(500).json({ 
        message: 'Errore durante l\'export del report',
        error: error.message 
      });
    }
  }
}

module.exports = new ReportsController();
