#!/bin/bash

echo "🚀 Setup rapido Saloon CRM..."

# Avvia i servizi Docker
echo "📦 Avvio servizi Docker..."
docker compose up -d

# Attendi che MongoDB sia pronto
echo "⏳ Attendo che MongoDB sia pronto..."
sleep 10

# Verifica se ci sono utenti, altrimenti crea l'admin
echo "👤 Verifica utenti esistenti..."
USERS_COUNT=$(docker exec saloon-mongo mongosh esteticacrm --quiet --eval "db.users.countDocuments()")

if [ "$USERS_COUNT" -eq 0 ]; then
    echo "🔧 Creazione utente amministratore..."
    docker exec saloon-backend node scripts/create-admin.js
else
    echo "✅ Utenti già presenti nel database ($USERS_COUNT utenti)"
fi

echo ""
echo "🎉 Setup completato!"
echo "🌐 Frontend: http://localhost:8080"
echo "🔗 Backend API: http://localhost:3000"
echo "📧 Admin Email: admin@estetica.com"
echo "🔐 Admin Password: admin123"
echo ""
echo "⚠️  IMPORTANTE: Cambia la password admin al primo accesso!"
