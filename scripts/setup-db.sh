#!/bin/bash

echo "Setting up database..."

if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo ".env file not found. Please create one based on .env.example"
  exit 1
fi

if ! pg_isready > /dev/null 2>&1; then
  echo "PostgreSQL is not running. Please start PostgreSQL first."
  exit 1
fi

echo "PostgreSQL is running"

echo "Creating database if not exists..."
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || \
  psql -U postgres -c "CREATE DATABASE ${DB_NAME}"

echo "Database '${DB_NAME}' ready"

echo "Running schema"
psql "${DATABASE_URL}" -f src/db/schema.sql

if [ $? -eq 0 ]; then
  echo "Schema applied successfully"
else
  echo "Schema failed to apply"
  exit 1
fi

echo "🌱 Seeding data..."
psql "${DATABASE_URL}" -f src/db/seed.sql

if [ $? -eq 0 ]; then
  echo "Seed data inserted successfully"
else
  echo "Seed data failed to insert"
  exit 1
fi

echo "Database setup complete!"
