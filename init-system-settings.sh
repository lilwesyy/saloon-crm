#!/bin/bash

echo "Esecuzione dello script di inizializzazione delle impostazioni di sistema..."
cd /home/mirco/Desktop/saloon-crm
docker compose exec backend node scripts/init-settings.js

echo ""
echo "Per verificare le impostazioni salvate nel database, puoi usare:"
echo "docker compose exec mongodb mongosh esteticacrm --eval 'db.settings.find()'"
