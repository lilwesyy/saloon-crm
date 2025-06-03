const Pagamento = require('../models/pagamento.model');
const mongoose = require('mongoose');

/**
 * Get pagamenti with optional filters
 */
exports.getPagamenti = async (req, res) => {
  try {
    const { startDate, endDate, metodo, tipo, stato } = req.query;
    const query = {};
    
    // Apply filters if provided
    if (startDate && endDate) {
      query.dataPagamento = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    if (metodo) query.metodo = metodo;
    if (tipo) query.tipo = tipo;
    if (stato) query.stato = stato;
    
    const pagamenti = await Pagamento.find(query)
      .populate('cliente', 'nome cognome telefono')
      .populate('servizio', 'nome prezzo')
      .sort({ dataPagamento: -1 });
    
    res.status(200).json(pagamenti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get pagamento by ID
 */
exports.getPagamentoById = async (req, res) => {
  try {
    const pagamento = await Pagamento.findById(req.params.id)
      .populate('cliente', 'nome cognome telefono email')
      .populate('servizio', 'nome prezzo durata');
    
    if (!pagamento) {
      return res.status(404).json({ message: 'Pagamento not found' });
    }
    
    res.status(200).json(pagamento);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new pagamento
 */
exports.createPagamento = async (req, res) => {
  try {
    // Set default values for some fields
    if (!req.body.dataPagamento) {
      req.body.dataPagamento = new Date();
    }
    
    if (!req.body.stato) {
      req.body.stato = 'completato';
    }
    
    const pagamento = new Pagamento(req.body);
    const savedPagamento = await pagamento.save();
    
    res.status(201).json(savedPagamento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Update a pagamento
 */
exports.updatePagamento = async (req, res) => {
  try {
    const pagamento = await Pagamento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!pagamento) {
      return res.status(404).json({ message: 'Pagamento not found' });
    }
    
    res.status(200).json(pagamento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Delete a pagamento
 */
exports.deletePagamento = async (req, res) => {
  try {
    const pagamento = await Pagamento.findByIdAndDelete(req.params.id);
    
    if (!pagamento) {
      return res.status(404).json({ message: 'Pagamento not found' });
    }
    
    res.status(200).json({ message: 'Pagamento deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get pagamenti by cliente
 */
exports.getPagamentiByCliente = async (req, res) => {
  try {
    const pagamenti = await Pagamento.find({ cliente: req.params.clienteId })
      .populate('servizio', 'nome prezzo')
      .sort({ dataPagamento: -1 });
    
    res.status(200).json(pagamenti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get overview statistics
 */
exports.getStatsOverview = async (req, res) => {
  try {
    // Get current month data
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Aggregate pagamenti statistics
    const stats = await Pagamento.aggregate([
      {
        $facet: {
          totale: [
            { $match: { stato: 'completato' } },
            { $group: { _id: null, total: { $sum: '$importo' } } }
          ],
          totaleMese: [
            { 
              $match: { 
                stato: 'completato',
                dataPagamento: { $gte: startOfMonth, $lte: endOfMonth }
              } 
            },
            { $group: { _id: null, total: { $sum: '$importo' } } }
          ],
          perMetodo: [
            { $match: { stato: 'completato' } },
            { $group: { _id: '$metodo', total: { $sum: '$importo' } } }
          ],
          perTipo: [
            { $match: { stato: 'completato' } },
            { $group: { _id: '$tipo', total: { $sum: '$importo' } } }
          ]
        }
      }
    ]);
    
    res.status(200).json({
      totale: stats[0].totale[0]?.total || 0,
      totaleMese: stats[0].totaleMese[0]?.total || 0,
      perMetodo: stats[0].perMetodo,
      perTipo: stats[0].perTipo,
      mese: {
        nome: today.toLocaleString('it-IT', { month: 'long' }),
        anno: today.getFullYear()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get monthly statistics
 */
exports.getStatsMensili = async (req, res) => {
  try {
    const { anno } = req.query;
    const year = parseInt(anno) || new Date().getFullYear();
    
    // Group by month for the given year
    const stats = await Pagamento.aggregate([
      {
        $match: {
          stato: 'completato',
          dataPagamento: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lte: new Date(`${year}-12-31T23:59:59.999Z`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$dataPagamento' },
          total: { $sum: '$importo' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Format the result for all 12 months
    const result = [];
    for (let i = 1; i <= 12; i++) {
      const monthData = stats.find(s => s._id === i);
      result.push({
        mese: i,
        nomeMese: new Date(year, i-1, 1).toLocaleString('it-IT', { month: 'long' }),
        totale: monthData ? monthData.total : 0,
        count: monthData ? monthData.count : 0
      });
    }
    
    res.status(200).json({ anno: year, data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Rimborsa pagamento
 */
exports.rimborsaPagamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo, importo } = req.body;
    
    // Find the payment and check if it can be refunded
    const pagamento = await Pagamento.findById(id);
    if (!pagamento) {
      return res.status(404).json({ message: 'Pagamento not found' });
    }
    
    if (pagamento.stato === 'rimborsato') {
      return res.status(400).json({ message: 'Pagamento già rimborsato' });
    }
    
    // Calculate refund amount
    const importoRimborso = importo || pagamento.importo;
    
    // Update payment status
    pagamento.stato = 'rimborsato';
    pagamento.note = `Rimborsato: ${motivo}. Importo: ${importoRimborso}€. ${pagamento.note || ''}`.trim();
    
    await pagamento.save();
    
    res.status(200).json({
      message: 'Pagamento rimborsato con successo',
      pagamento
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
