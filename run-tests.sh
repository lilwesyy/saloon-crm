#!/bin/bash

# Script per eseguire i test del CRM in un ambiente Docker

# Colori per output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=========================================${NC}"
echo -e "${YELLOW}    Test Automatici per CRM               ${NC}"
echo -e "${YELLOW}=========================================${NC}"

# Verifica se è disponibile docker-compose o docker compose
if command -v docker-compose &> /dev/null; then
  DOCKER_COMPOSE="docker-compose"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
  DOCKER_COMPOSE="docker compose"
else
  echo -e "${RED}Errore: Docker Compose non è installato!${NC}"
  echo -e "${YELLOW}Per installare Docker Compose esegui:${NC}"
  echo -e "sudo apt-get update && sudo apt-get install docker-compose-plugin"
  exit 1
fi

echo -e "${GREEN}Usando comando: ${DOCKER_COMPOSE}${NC}"

# Funzione per eseguire un tipo specifico di test
run_test() {
  TEST_TYPE=$1
  echo -e "${YELLOW}Esecuzione test ${TEST_TYPE}...${NC}"
  
  $DOCKER_COMPOSE -f docker-compose.test.yml exec backend npm run test:$TEST_TYPE
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Test ${TEST_TYPE} completati con successo!${NC}"
  else
    echo -e "${RED}Errore nei test ${TEST_TYPE}!${NC}"
    exit 1
  fi
}

# Avvia l'ambiente di test
echo -e "${YELLOW}Avvio dell'ambiente di test...${NC}"
$DOCKER_COMPOSE -f docker-compose.test.yml up -d

# Attendi che MongoDB sia pronto
echo -e "${YELLOW}Attendo che MongoDB sia pronto...${NC}"
sleep 5

# Esegui i test unitari
run_test "unit"

# Esegui i test di integrazione
run_test "integration"

# Esegui i test end-to-end
run_test "e2e"

# Esegui tutti i test con copertura
echo -e "${YELLOW}Generazione report di copertura...${NC}"
$DOCKER_COMPOSE -f docker-compose.test.yml exec backend npm run test:coverage

# Arresta l'ambiente di test
echo -e "${YELLOW}Arresto dell'ambiente di test...${NC}"
$DOCKER_COMPOSE -f docker-compose.test.yml down

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}    Test completati con successo!        ${NC}"
echo -e "${GREEN}=========================================${NC}"
