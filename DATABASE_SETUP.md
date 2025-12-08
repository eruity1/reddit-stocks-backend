# Database Setup Guide

## Prerequisites

- PostgreSQL 16+ installed and running
- Database credentials configured in `.env` file

## Option 1: Automatic Setup

Run the setup script:

```bash
# Make the script executable
chmod +x scripts/setup-db.sh

# Run the setup
./scripts/setup-db.sh
```

This will:

1.  Create the database if it doesn't exist
2.  Run all schema migrations
3.  Insert seed data

## Option 2: Manual Setup

### 1\. Create the database

```bash
createdb database_name
```

Or using psql:

```sql
CREATE DATABASE database_name;
```

### 2\. Run the schema

```bash
psql -d database_name -f src/db/schema.sql
```

### 3\. Insert seed data

```bash
psql -d database_name -f src/db/seed.sql
```

## Verify Setup

Connect to your database and check the tables:

```bash
psql database_name
```

```sql
-- List all tables
\dt

-- Check stocks table
SELECT * FROM stocks;

-- Expected output: 10 popular stock tickers
```

## Database Schema Overview

### Tables

1.  **users** - User accounts
    - id, email, password_hash, created_at, updated_at
2.  **stocks** - Stock ticker information
    - id, ticker, company_name, first_seen_at
3.  **mentions** - Reddit post mentions of stocks
    - id, stock_id, subreddit, post_id, post_title, post_url, author, score, comment_count, sentiment_score, mentioned_at
4.  **subreddit_preferences** - User's selected subreddits to track
    - id, user_id, subreddit_name, is_active
5.  **alerts** - User notifications
    - id, user_id, stock_id, alert_type, message, is_read, created_at

### Indexes

Optimized indexes are created on:

- Stock tickers
- Mention timestamps
- User relationships
- Alert status

## Troubleshooting

### Connection refused

- Ensure PostgreSQL is running: `pg_isready`
- Check your DATABASE_URL in `.env`

### Permission denied

- Ensure your PostgreSQL user has CREATE DATABASE privileges
- Try running with postgres superuser: `psql -U postgres`

### Schema errors

- Drop and recreate: `DROP DATABASE database_name; CREATE DATABASE database_name;`
- Re-run setup script

## Resetting the Database

To start fresh:

```bash
# Drop database
dropdb database_name

# Re-run setup
./scripts/setup-db.sh
```
