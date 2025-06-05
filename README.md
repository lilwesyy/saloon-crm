# CRM per Centro Estetico

Un sistema completo di CRM (Customer Relationship Management) per centri estetici, che consente di gestire clienti, appuntamenti, trattamenti e molto altro.

## Tecnologie Utilizzate

- **Frontend**: Vue.js 3 con Composition API, Tailwind CSS
- **Backend**: Node.js con Express.js
- **Database**: MongoDB
- **Containerizzazione**: Docker e Docker Compose

## 🚀 Avvio Rapido

Per avviare l'intero ambiente di sviluppo:

```bash
docker compose up -d
```

## 🌐 Servizi Disponibili

- **Frontend Vue.js**: http://localhost:8080
- **Backend API**: http://localhost:3000  
- **MongoDB**: localhost:27017

## 📋 Comandi Docker Utili

```bash
# Avvia tutti i servizi
docker compose up -d

# Visualizza i log
docker compose logs -f

# Visualizza i log di un singolo servizio
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb

# Ferma tutti i servizi
docker compose down

# Riavvia un singolo servizio
docker compose restart backend

# Ricostruisci e riavvia (dopo modifiche ai Dockerfile)
docker compose up -d --build
```

## 💻 Sviluppo

- Il codice è montato come volume, quindi le modifiche sono automaticamente rilevate
- Il backend usa `nodemon` per il reload automatico
- Il frontend usa il dev server di Vue CLI con hot reload
- Il database persiste i dati nella cartella `./data/mongo`

## Funzionalità Principali

### Core Features
- **Gestione Clienti**: Anagrafica completa con profili dettagliati
- **Sistema Appuntamenti**: Calendario integrato con gestione stati
- **Gestione Servizi**: Catalogo trattamenti e prezzi
- **Dashboard Analytics**: Panoramica in tempo reale delle attività
- **Sistema di Autenticazione**: Login sicuro con gestione ruoli

### Recent Improvements (v2.0)

#### 🎯 Dashboard Enhancements
- **Appuntamenti Oggi**: Visualizzazione dedicata per gli appuntamenti odierni
- **Filtri Intelligenti**: Solo appuntamenti confermati nella dashboard principale
- **Scroll Automatico**: Lista scorrevole per più di 3 appuntamenti
- **Aggiornamento in Tempo Reale**: Statistiche aggiornate automaticamente

#### 👥 User Experience Improvements
- **Righe Cliccabili**: Intera riga della tabella utenti cliccabile per navigazione rapida
- **Hover Effects**: Feedback visivo migliorato con effetti di hover
- **Navigazione Ottimizzata**: Rimozione di elementi ridondanti nell'interfaccia

#### 🔧 Technical Enhancements
- **Performance Optimization**: Caricamento ottimizzato con limite di 200 appuntamenti
- **Database Seeding**: Script automatici per popolamento dati di test
- **API Improvements**: Endpoint ottimizzati per migliori prestazioni
- **Error Handling**: Gestione errori migliorata in tutto il sistema

#### 🧪 Testing & Development Tools
- **Seeder Scripts**: Generazione automatica di dati di test realistici
- **Verification Tools**: Script per verifica integrità dati
- **API Testing**: Suite di test per endpoint critici
- **Development Scripts**: Strumenti per debugging e sviluppo

## Requisiti di Sistema

- Docker e Docker Compose
- Node.js 16+ (solo per sviluppo locale)
- npm o yarn (solo per sviluppo locale)

## Installazione e Avvio

### Utilizzo con Docker (Consigliato)

1. Clona il repository:
   ```bash
   git clone [url-repository]
   cd saloon-crm
   ```

2. Avvia i container Docker:
   ```bash
   docker-compose up -d
   ```

3. Crea l'utente amministratore (solo al primo avvio):
   ```bash
   docker-compose exec backend npm run create-admin
   ```

4. L'applicazione sarà disponibile all'indirizzo:
   - Frontend: http://localhost:8080
   - API Backend: http://localhost:3000/api

5. **Credenziali di accesso predefinite:**
   - Email: `admin@estetica.com`
   - Password: `admin123`
   - ⚠️ **IMPORTANTE**: Cambia la password al primo accesso!

### 🌱 Database Seeding (Opzionale)

Per popolare il database con dati di test realistici:

```bash
# Seeder per appuntamenti generici
docker-compose exec backend node scripts/seed-appuntamenti.js

# Seeder per appuntamenti di oggi (testing)
docker-compose exec backend node scripts/seed-appuntamenti-oggi.js

# Verifica appuntamenti di oggi
docker-compose exec backend node scripts/check-appointments-today.js
```

### 🧪 Testing Tools

Il sistema include diversi script di test e verifica:

```bash
# Test API appuntamenti di oggi
docker-compose exec backend node scripts/test-today-api.js

# Verifica semplice database
docker-compose exec backend node scripts/simple-check-today.js

# Test generico API
docker-compose exec backend node scripts/simple-test.js
```

### Installazione Locale per Sviluppo

#### Backend

1. Vai nella directory del backend:
   ```bash
   cd backend
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Avvia il server in modalità sviluppo:
   ```bash
   npm run dev
   ```

#### Frontend

1. Vai nella directory del frontend:
   ```bash
   cd frontend
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Avvia il server di sviluppo:
   ```bash
   npm run serve
   ```

## Accesso Iniziale

Per accedere al sistema, utilizzare le seguenti credenziali:

- **Email**: admin@example.com
- **Password**: admin123

## Struttura del Progetto

```
saloon-crm/
├── frontend/              # Applicazione Vue.js
│   ├── src/
│   │   ├── views/        # Componenti pagina
│   │   ├── stores/       # Gestione stato Pinia
│   │   ├── services/     # Servizi API
│   │   └── components/   # Componenti riutilizzabili
├── backend/               # API Node.js/Express
│   ├── routes/           # Endpoint API
│   ├── models/           # Modelli database
│   ├── middleware/       # Middleware Express
│   └── scripts/          # Script di utilità e seeding
├── docker/               # File di configurazione Docker
└── docker-compose.yml    # Configurazione Docker Compose
```

## 📋 Changelog

### v2.0.0 - Recent Improvements

#### Dashboard
- ✅ **Filtri Migliorati**: Solo appuntamenti confermati (`stato === 'confermato'`)
- ✅ **Scroll Intelligente**: Auto-scroll per liste con più di 3 elementi
- ✅ **Performance**: Aumento limite API da 50 a 200 appuntamenti
- ✅ **Sezioni Dedicate**: "Appuntamenti Oggi" e "Prossimi Appuntamenti"

#### User Interface
- ✅ **Righe Cliccabili**: Tabella utenti completamente navigabile
- ✅ **Hover Effects**: Feedback visivo migliorato (`hover:bg-gray-50`)
- ✅ **Event Handling**: Gestione corretta degli eventi con `@click.stop`
- ✅ **Rimozione Ridondanze**: Eliminati link con icone oculari superflui

#### Backend & Database
- ✅ **Seeder Avanzati**: Script per generazione dati realistici
- ✅ **Validazione Stati**: Correzione valori enum (`confermato`, `completato`, `cancellato`)
- ✅ **Script di Verifica**: Tool per controllo integrità dati
- ✅ **API Testing**: Suite completa di test endpoint

#### Code Quality
- ✅ **Debug Cleanup**: Rimozione di tutti i `console.log` di debug
- ✅ **Error Handling**: Gestione errori migliorata
- ✅ **Type Safety**: Miglioramenti TypeScript nel frontend

## 🛠️ Troubleshooting

### Problemi Comuni

#### Dashboard non mostra appuntamenti di oggi
```bash
# Verifica presenza dati
docker-compose exec backend node scripts/check-appointments-today.js

# Popola con dati di test
docker-compose exec backend node scripts/seed-appuntamenti-oggi.js
```

#### Performance lente su grandi dataset
- Controllare limite API nelle chiamate (default: 200)
- Verificare indicizzazione database MongoDB
- Monitorare logs: `docker-compose logs -f backend`

#### Problemi di autenticazione
```bash
# Ricrea utente admin
docker-compose exec backend npm run create-admin

# Verifica connessione database
docker-compose exec mongodb mongosh --eval "db.runCommand('ping')"
```

### Logs e Debug

```bash
# Visualizza tutti i logs
docker-compose logs -f

# Logs specifici per servizio
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongodb

# Accesso container per debug
docker-compose exec backend bash
docker-compose exec frontend bash
```

## 🔧 Development Scripts

Il progetto include diversi script utili per lo sviluppo:

```bash
# Seeding e testing (dentro container backend)
npm run create-admin              # Crea utente amministratore
node scripts/seed-appuntamenti.js # Popola appuntamenti
node scripts/check-appointments-today.js # Verifica dati oggi
node scripts/test-today-api.js    # Test API appuntamenti oggi
```

## Licenza

Questo progetto è proprietario e riservato. Tutti i diritti sono riservati.

## 📞 Contatti e Supporto

Per assistenza tecnica o informazioni:
- **Email Tecnico**: dev@saloon-crm.com
- **Documentazione**: Consultare i file README nei singoli moduli
- **Issues**: Utilizzare il sistema di tracking interno per bug e feature request

### Sviluppo e Contributi
- **Testing**: Utilizzare gli script di test inclusi prima di deployment
- **Seeding**: Popolare sempre con dati realistici per testing UX
- **Code Quality**: Mantenere pulizia del codice (no debug logs in produzione)
