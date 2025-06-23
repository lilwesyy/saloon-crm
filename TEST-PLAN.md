# Test del CRM per Centro Estetico

Questo documento descrive il piano di test completo per il CRM del centro estetico. I test sono strutturati in tre categorie principali: test unitari, test di integrazione e test end-to-end.

## Configurazione dell'ambiente di test

È stata creata una configurazione Docker dedicata per i test, che include:

- Un container MongoDB separato che utilizza una porta diversa (27018)
- Un container backend con variabili d'ambiente impostate per i test
- Supporto per MongoDB in-memory per i test unitari

## Struttura dei test

```
backend/
  ├── tests/
  │   ├── unit/               # Test unitari
  │   │   ├── cliente.model.test.js
  │   │   ├── appuntamento.model.test.js
  │   │   ├── pagamento.model.test.js
  │   │   ├── programmaFedelta.model.test.js
  │   │   └── clienti.controller.test.js
  │   ├── integration/        # Test di integrazione
  │   │   ├── clienti.api.test.js
  │   │   └── appuntamenti.api.test.js
  │   └── e2e/                # Test end-to-end
  │       └── workflow.test.js
  └── setup.js               # Configurazione ambiente di test
```

## Casi di test per ogni modulo

### 1. Gestione Clienti

#### Test unitari
- Validazione del modello cliente
- Funzioni del controller clienti
- Validazione dei consensi privacy e marketing
- Classificazione clienti

#### Test di integrazione
- Creazione nuovo cliente (API)
- Aggiornamento cliente esistente (API)
- Ricerca clienti con filtri multipli (API)
- Gestione foto profilo (API)

### 2. Appuntamenti e Agenda

#### Test unitari
- Validazione del modello appuntamento
- Verifica sovrapposizione appuntamenti
- Calcolo durata trattamenti

#### Test di integrazione
- Creazione nuovo appuntamento (API)
- Modifica stato appuntamento (API)
- Filtro appuntamenti per data (API)
- Gestione appuntamenti per operatore (API)

### 3. Pagamenti

#### Test unitari
- Validazione del modello pagamento
- Verifica stati pagamento
- Associazione pagamento-cliente-servizio

#### Test di integrazione
- Registrazione nuovo pagamento (API)
- Aggiornamento stato pagamento (API)
- Filtro pagamenti per cliente (API)

### 4. Programma Fedeltà

#### Test unitari
- Validazione modello programma fedeltà
- Gestione punti e premi
- Livelli fedeltà e upgrade

#### Test di integrazione
- Creazione programma fedeltà (API)
- Aggiunta punti (API)
- Riscatto premi (API)

### 5. Test End-to-End

Test che simulano il flusso completo dell'applicazione:
1. Creazione utente
2. Creazione cliente
3. Creazione servizio
4. Creazione appuntamento
5. Gestione pagamento
6. Gestione programma fedeltà

## Esecuzione dei test

I test possono essere eseguiti nei seguenti modi:

### Esecuzione all'interno del container Docker

```bash
# Avvia l'ambiente di test Docker
docker-compose -f docker-compose.test.yml up -d

# Esegui tutti i test
docker-compose -f docker-compose.test.yml exec backend npm test

# Esegui test specifici
docker-compose -f docker-compose.test.yml exec backend npm run test:unit
docker-compose -f docker-compose.test.yml exec backend npm run test:integration
docker-compose -f docker-compose.test.yml exec backend npm run test:e2e
```

### Esecuzione con lo script automatizzato

```bash
./run-tests.sh
```

## Report di copertura del codice

Dopo l'esecuzione dei test, viene generato un report di copertura del codice nella directory `backend/coverage` per il backend e `frontend/coverage` per il frontend.

## Test Frontend

I test frontend sono strutturati in modo simile ai test backend:

```
frontend/
  ├── tests/
  │   ├── unit/               # Test unitari
  │   │   ├── store/          # Test degli store Pinia
  │   │   │   ├── auth.spec.ts
  │   │   │   ├── clienti.spec.ts
  │   │   │   ├── appuntamenti.spec.ts
  │   │   │   ├── programmaFedelta.spec.ts
  │   │   │   └── servizi.spec.ts
  │   │   ├── views/          # Test delle view
  │   │   │   ├── auth/
  │   │   │   │   └── Login.spec.ts
  │   │   │   ├── clienti/
  │   │   │   │   └── ClientiList.spec.ts
  │   │   │   └── appuntamenti/
  │   │   │       └── AppuntamentiCalendar.spec.ts
  │   │   └── components/     # Test dei componenti
  │   └── e2e/                # Test end-to-end (Cypress)
  └── cypress/                # Struttura Cypress
      ├── e2e/                # Test Cypress E2E
      │   ├── login.cy.ts
      │   ├── clients.cy.ts
      │   ├── appointments.cy.ts
      │   └── payments.cy.ts
      └── support/            # Utilità di supporto Cypress
          ├── commands.ts
          └── e2e.ts
```

### Esecuzione dei test frontend

```bash
# Nel container frontend - Test unitari
npm run test:unit

# Con coverage
npm run test:coverage

# Test E2E con Cypress (interfaccia grafica)
npm run test:e2e

# Test E2E con Cypress (headless)
npm run test:e2e:headless
```

### Esecuzione dei test con Docker

```bash
# Esecuzione completa dei test frontend (unit + E2E)
docker-compose -f docker-compose.frontend-test.yml up

# Esecuzione test frontend con rebuild container
docker-compose -f docker-compose.frontend-test.yml up --build
```

## Continuous Integration

Il progetto è configurato per l'esecuzione automatica dei test tramite GitHub Actions. La pipeline CI include:

1. Test backend (unitari, integrazione, E2E)
2. Test frontend unitari
3. Test frontend E2E con Cypress
4. Test in ambiente Docker

La configurazione si trova in `.github/workflows/test.yml`.

### Flusso di lavoro CI

1. **Backend Tests**: Esecuzione di tutti i test unitari e di integrazione del backend
2. **Frontend Unit Tests**: Esecuzione dei test unitari per componenti e store
3. **Frontend E2E Tests**: Esecuzione dei test end-to-end con Cypress
4. **Docker Tests**: Esecuzione di test in ambiente containerizzato

In caso di fallimento di qualsiasi test, la pipeline CI genera un report e conserva gli screenshot dei test E2E falliti.

## Note importanti

- Assicurarsi che l'ambiente Docker di produzione sia spento prima di eseguire i test
- Il database di test è separato dal database di produzione
- L'esecuzione di tutti i test può richiedere alcuni minuti
- I test frontend necessitano di Node.js v16 o superiore
