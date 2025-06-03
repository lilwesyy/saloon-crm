// Configurazioni dell'applicazione
module.exports = {
  // Configurazione database
  database: {
    uri: process.env.MONGO_URI || 'mongodb://mongo:27017/esteticacrm'
  },
  
  // Configurazione JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
    expiresIn: '24h'
  },
  
  // Configurazione server
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development'
  },
  
  // Percorsi upload
  upload: {
    profilePath: 'uploads/profili/',
    maxFileSize: 5 * 1024 * 1024 // 5MB
  }
}
