#!/bin/sh

echo "Waiting for Database..."
while ! nc -z toptal-db 5432; do
    sleep 0.1
done
echo "Database started"

npm run migrate:all
npm run seed:all

npm run dev
