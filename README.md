# CRM per Centro Estetico

Un sistema completo di CRM (Customer Relationship Management) per centri estetici, che consente di gestire clienti, appuntamenti, trattamenti e molto altro.

## Tecnologie Utilizzate

- **Frontend**: Vue.js 3 con Composition API, Tailwind CSS
- **Backend**: Node.js con Express.js
- **Database**: MongoDB
- **Containerizzazione**: Docker e Docker Compose

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
   cd freelancecrm
   ```

2. Avvia i container Docker:
   ```bash
   docker-compose up -d
   ```

3. L'applicazione sarà disponibile all'indirizzo:
   - Frontend: http://localhost:8080
   - API Backend: http://localhost:3000/api

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
