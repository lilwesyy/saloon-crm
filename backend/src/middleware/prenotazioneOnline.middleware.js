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

// Validazioni per la prenotazione online
const validatePrenotazioneOnline = [
  body('cliente.nome')
    .notEmpty()
    .withMessage('Il nome è obbligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('Il nome deve essere tra 2 e 50 caratteri')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Il nome contiene caratteri non validi'),

  body('cliente.cognome')
    .notEmpty()
    .withMessage('Il cognome è obbligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('Il cognome deve essere tra 2 e 50 caratteri')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Il cognome contiene caratteri non validi'),

  body('cliente.email')
    .isEmail()
    .withMessage('Email non valida')
    .normalizeEmail(),

  body('cliente.telefono')
    .notEmpty()
    .withMessage('Il telefono è obbligatorio')
    .matches(/^[\+]?[0-9\s\-\(\)]{8,15}$/)
    .withMessage('Formato telefono non valido'),

  body('cliente.dataNascita')
    .optional()
    .isISO8601()
    .withMessage('Data di nascita non valida'),

  body('servizioId')
    .notEmpty()
    .withMessage('Il servizio è obbligatorio')
    .isMongoId()
    .withMessage('ID servizio non valido'),

  body('operatoreId')
    .notEmpty()
    .withMessage('L\'operatore è obbligatorio')
    .isMongoId()
    .withMessage('ID operatore non valido'),

  body('dataOraInizio')
    .notEmpty()
    .withMessage('Data e ora sono obbligatorie')
    .isISO8601()
    .withMessage('Formato data/ora non valido')
    .custom((value) => {
      const dataAppuntamento = new Date(value);
      const ora = new Date();
      
      if (dataAppuntamento <= ora) {
        throw new Error('La data dell\'appuntamento deve essere futura');
      }
      
      // Controllo orario di lavoro (es. 9-19)
      const orario = dataAppuntamento.getHours();
      if (orario < 9 || orario >= 19) {
        throw new Error('Orario non valido. Gli appuntamenti sono dalle 9:00 alle 19:00');
      }
      
      return true;
    }),

  body('note')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Le note non possono superare i 500 caratteri'),

  body('consensoPrivacy')
    .isBoolean()
    .withMessage('Il consenso privacy deve essere un valore booleano')
    .custom((value) => {
      if (!value) {
        throw new Error('Il consenso al trattamento dei dati è obbligatorio');
      }
      return true;
    }),

  body('consensoMarketing')
    .optional()
    .isBoolean()
    .withMessage('Il consenso marketing deve essere un valore booleano'),

  handleValidationErrors
];

// Validazioni per ottenere disponibilità
const validateDisponibilita = [
  query('data')
    .notEmpty()
    .withMessage('La data è obbligatoria')
    .isISO8601()
    .withMessage('Formato data non valido')
    .custom((value) => {
      const data = new Date(value);
      const oggi = new Date();
      oggi.setHours(0, 0, 0, 0);
      
      if (data < oggi) {
        throw new Error('Non puoi cercare disponibilità per date passate');
      }
      
      return true;
    }),

  query('servizioId')
    .notEmpty()
    .withMessage('L\'ID del servizio è obbligatorio')
    .isMongoId()
    .withMessage('ID servizio non valido'),

  query('operatoreId')
    .optional()
    .isMongoId()
    .withMessage('ID operatore non valido'),

  handleValidationErrors
];

// Validazioni per conferma/cancellazione
const validateTokenAction = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID dell\'appuntamento è obbligatorio')
    .isMongoId()
    .withMessage('ID appuntamento non valido'),

  query('token')
    .notEmpty()
    .withMessage('Il token è obbligatorio')
    .isLength({ min: 32, max: 64 })
    .withMessage('Token non valido'),

  handleValidationErrors
];

// Validazioni per cancellazione con motivo
const validateCancellazione = [
  ...validateTokenAction,
  
  body('motivoCancellazione')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Il motivo della cancellazione non può superare i 200 caratteri'),

  handleValidationErrors
];

// Middleware per limitare rate delle richieste pubbliche
const rateLimitPublic = (req, res, next) => {
  // Implementazione semplice di rate limiting per IP
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minuti
  const maxRequests = 50; // max 50 richieste per IP ogni 15 minuti

  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map();
  }

  const key = `public_${ip}`;
  const record = global.rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count++;
  }

  global.rateLimitStore.set(key, record);

  if (record.count > maxRequests) {
    return res.status(429).json({
      message: 'Troppe richieste. Riprova tra qualche minuto.',
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    });
  }

  next();
};

// Middleware per sanitizzare input
const sanitizeInput = (req, res, next) => {
  // Rimuovi caratteri potenzialmente pericolosi
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj.trim().replace(/<script[^>]*>.*?<\/script>/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }

  next();
};

module.exports = {
  validatePrenotazioneOnline,
  validateDisponibilita,
  validateTokenAction,
  validateCancellazione,
  rateLimitPublic,
  sanitizeInput,
  handleValidationErrors
};
