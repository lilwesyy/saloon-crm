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

- Gestione completa dei clienti
- Calendario appuntamenti
- Gestione servizi e trattamenti
- Sistema di fatturazione
- Reportistica e analytics
- Marketing automatizzato

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
freelancecrm/
├── frontend/           # Applicazione Vue.js
├── backend/            # API Node.js/Express
├── docker/             # File di configurazione Docker
└── docker-compose.yml  # Configurazione Docker Compose
```

## Licenza

Questo progetto è proprietario e riservato. Tutti i diritti sono riservati.

## Contatti e Supporto

Per assistenza o informazioni, contattare il team di supporto:
- Email: support@example.com
