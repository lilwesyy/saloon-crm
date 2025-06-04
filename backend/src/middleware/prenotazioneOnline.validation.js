const { body, param, query, validationResult } = require('express-validator');

// Middleware per gestire gli errori di validazione
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Dati non validi',
      errors: errors.array()
    });
  }
  next();
};

// Validazione per ottenere disponibilità
const validateGetDisponibilita = [
  query('data')
    .isISO8601()
    .withMessage('Data deve essere in formato ISO 8601'),
  query('servizioId')
    .isMongoId()
    .withMessage('ID servizio non valido'),
  query('operatoreId')
    .optional()
    .isMongoId()
    .withMessage('ID operatore non valido'),
  handleValidationErrors
];

// Validazione per creare prenotazione
const validateCreaPrenotazione = [
  body('cliente.nome')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Nome deve essere tra 2 e 50 caratteri'),
  body('cliente.cognome')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Cognome deve essere tra 2 e 50 caratteri'),
  body('cliente.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email non valida'),
  body('cliente.telefono')
    .isMobilePhone('it-IT')
    .withMessage('Numero di telefono non valido'),
  body('cliente.dataNascita')
    .optional()
    .isISO8601()
    .withMessage('Data di nascita deve essere in formato ISO 8601'),
  body('servizioId')
    .isMongoId()
    .withMessage('ID servizio non valido'),
  body('operatoreId')
    .isMongoId()
    .withMessage('ID operatore non valido'),
  body('dataOraInizio')
    .isISO8601()
    .withMessage('Data e ora inizio deve essere in formato ISO 8601')
    .custom((value) => {
      const dataInizio = new Date(value);
      const ora = new Date();
      if (dataInizio <= ora) {
        throw new Error('La data di prenotazione deve essere futura');
      }
      return true;
    }),
  body('note')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Note non possono superare 500 caratteri'),
  body('consensoPrivacy')
    .isBoolean()
    .custom((value) => {
      if (!value) {
        throw new Error('Il consenso alla privacy è obbligatorio');
      }
      return true;
    }),
  body('consensoMarketing')
    .optional()
    .isBoolean(),
  handleValidationErrors
];

// Validazione per confermare prenotazione
const validateConfermaPrenotazione = [
  param('id')
    .isMongoId()
    .withMessage('ID prenotazione non valido'),
  query('token')
    .isString()
    .isBase64()
    .withMessage('Token di conferma non valido'),
  handleValidationErrors
];

// Validazione per cancellare prenotazione
const validateCancellaPrenotazione = [
  param('id')
    .isMongoId()
    .withMessage('ID prenotazione non valido'),
  body('token')
    .isString()
    .isBase64()
    .withMessage('Token di cancellazione non valido'),
  body('motivoCancellazione')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Motivo cancellazione non può superare 500 caratteri'),
  handleValidationErrors
];

// Middleware per sanitizzare i dati cliente
const sanitizeClienteData = (req, res, next) => {
  if (req.body.cliente) {
    // Rimuovi spazi extra e normalizza
    if (req.body.cliente.nome) {
      req.body.cliente.nome = req.body.cliente.nome.trim().replace(/\s+/g, ' ');
    }
    if (req.body.cliente.cognome) {
      req.body.cliente.cognome = req.body.cliente.cognome.trim().replace(/\s+/g, ' ');
    }
    if (req.body.cliente.telefono) {
      // Rimuovi spazi e caratteri speciali dal telefono
      req.body.cliente.telefono = req.body.cliente.telefono.replace(/[^\d\+]/g, '');
    }
  }
  next();
};

// Middleware per verificare rate limiting (per evitare spam)
const rateLimitPrenotazioni = (req, res, next) => {
  // Implementazione semplice basata su IP e email
  const ip = req.ip;
  const email = req.body?.cliente?.email;
  
  // Qui potresti implementare una logica più sofisticata con Redis
  // Per ora lasciamo passare sempre
  next();
};

module.exports = {
  validateGetDisponibilita,
  validateCreaPrenotazione,
  validateConfermaPrenotazione,
  validateCancellaPrenotazione,
  sanitizeClienteData,
  rateLimitPrenotazioni,
  handleValidationErrors
};
