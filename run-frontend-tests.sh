#!/bin/bash
# Script per eseguire i test frontend (unitari e E2E)

# Verifica se è disponibile docker-compose o docker compose
if command -v docker-compose &> /dev/null; then
  DOCKER_COMPOSE="docker-compose"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
  DOCKER_COMPOSE="docker compose"
else
  echo "Errore: Docker Compose non è installato!"
  echo "Per installare Docker Compose esegui:"
  echo "sudo apt-get update && sudo apt-get install docker-compose-plugin"
fi

echo "==== Test Frontend ===="
echo "1. Test unitari"
echo "2. Test E2E"
echo "3. Entrambi"
echo "4. Test con Docker"
echo "==== Seleziona un'opzione (1-4) ===="

read -p "Opzione: " option

case $option in
  1)
    echo "Esecuzione test unitari..."
    cd frontend && npm run test:unit
    ;;
  2)
    echo "Esecuzione test E2E..."
    cd frontend && npm run test:e2e
    ;;
  3)
    echo "Esecuzione di tutti i test frontend..."
    cd frontend && npm run test:unit && npm run test:e2e:headless
    ;;
  4)
    echo "Esecuzione test in ambiente Docker..."
    $DOCKER_COMPOSE -f docker-compose.frontend-test.yml up --build
    ;;
  *)
    echo "Opzione non valida!"
    ;;
esac
