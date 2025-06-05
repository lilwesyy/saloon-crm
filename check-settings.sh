#!/bin/bash

echo "Verificando le impostazioni di sistema nel database..."
docker compose exec mongodb mongosh esteticacrm --eval 'db.settings.find().pretty()'
