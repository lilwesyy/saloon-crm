const Servizio = require('../models/servizio.model');

/**
 * Get all servizi
 */
exports.getAllServizi = async (req, res) => {
  try {
    const servizi = await Servizio.find();
    res.status(200).json(servizi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get servizio by ID
 */
exports.getServizioById = async (req, res) => {
  try {
    const servizio = await Servizio.findById(req.params.id);
    if (!servizio) {
      return res.status(404).json({ message: 'Servizio not found' });
    }
    res.status(200).json(servizio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new servizio
 */
exports.createServizio = async (req, res) => {
  try {
    const servizio = new Servizio(req.body);
    const savedServizio = await servizio.save();
    res.status(201).json(savedServizio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Update a servizio
 */
exports.updateServizio = async (req, res) => {
  try {
    const servizio = await Servizio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!servizio) {
      return res.status(404).json({ message: 'Servizio not found' });
    }
    res.status(200).json(servizio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Delete a servizio
 */
exports.deleteServizio = async (req, res) => {
  try {
    const servizio = await Servizio.findByIdAndDelete(req.params.id);
    if (!servizio) {
      return res.status(404).json({ message: 'Servizio not found' });
    }
    res.status(200).json({ message: 'Servizio deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get servizi by categoria
 */
exports.getServiziByCategoria = async (req, res) => {
  try {
    const servizi = await Servizio.find({ categoria: req.params.categoria });
    res.status(200).json(servizi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Toggle servizio status (attivo/non attivo)
 */
exports.toggleServizioAttivo = async (req, res) => {
  try {
    const servizio = await Servizio.findByIdAndUpdate(
      req.params.id,
      { attivo: req.body.attivo },
      { new: true, runValidators: true }
    );
    if (!servizio) {
      return res.status(404).json({ message: 'Servizio not found' });
    }
    res.status(200).json(servizio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
