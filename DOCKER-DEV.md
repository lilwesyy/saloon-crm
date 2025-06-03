# Saloon CRM - Setup Docker per Sviluppo

## Avvio Rapido

Per avviare l'intero ambiente di sviluppo con un solo comando:

```bash
docker compose up -d
```

Oppure usa lo script di sviluppo:

```bash
./dev.sh
```

## Servizi

L'ambiente di sviluppo include:

- **Frontend (Vue.js)**: http://localhost:8080
- **Backend (Node.js/Express)**: http://localhost:3000  
- **Database (MongoDB)**: localhost:27017

## Comandi Utili

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

# Ricostruisci e riavvia
docker compose up -d --build

# Riavvia un singolo servizio
docker compose restart backend
```

## Script di Sviluppo

Lo script `dev.sh` fornisce comandi semplificati:

```bash
./dev.sh start    # Avvia l'ambiente (default)
./dev.sh stop     # Ferma tutti i servizi
./dev.sh restart  # Riavvia tutto
./dev.sh logs     # Visualizza i log
```

## Sviluppo

- I file sono montati come volumi, quindi le modifiche al codice si riflettono automaticamente
- Il frontend usa hot-reload per aggiornamenti istantanei
- Il backend usa nodemon per riavvii automatici
- Il database MongoDB persiste i dati nella cartella `./data/mongo`

## Variabili d'Ambiente

Le variabili d'ambiente sono configurate nel `docker-compose.yml`:

- `NODE_ENV=development`
- `MONGODB_URI=mongodb://mongodb:27017/esteticacrm`
- `VUE_APP_API_URL=http://localhost:3000`

Per modificare le variabili, modifica il file `docker-compose.yml` o crea un file `.env`.
