const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Assicurati che le cartelle di destinazione esistano
const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Configurazione per il caricamento delle foto profilo dei clienti
const profiloStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/profili');
    createFolderIfNotExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Genera un nome file univoco con timestamp e id cliente
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `cliente-${req.params.id}-${uniqueSuffix}${extension}`);
  }
});

// Filtro per accettare solo file immagine
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  
  // Verifica il mimetype e l'estensione del file
  const mimetypeValid = allowedTypes.test(file.mimetype);
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetypeValid && extValid) {
    cb(null, true);
  } else {
    cb(new Error('Formato file non supportato. Carica solo immagini (jpeg, jpg, png, gif, webp).'), false);
  }
};

// Esporta le configurazioni multer per diversi tipi di upload
exports.profilo = multer({
  storage: profiloStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: imageFileFilter
});
