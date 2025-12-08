# Reddit Stock Tracker API

Backend API for tracking stock mentions and sentiment across Reddit investing communities.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Reddit API credentials

### Installation

1.  Clone the repository

```bash
git clone git@github.com:eruity1/reddit-stocks-backend.git
cd reddit-stock-tracker-api
```

1.  Install dependencies

```bash
npm install
```

1.  Set up environment variables

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

1.  Get Reddit API credentials:
    - Go to <https://www.reddit.com/prefs/apps>
    - Click "create another app..."
    - Select "script" type
    - Add your credentials to `.env`

### Development

Start the development server:

```bash
npm run dev
```

Server will run on <http://localhost:3001>

### Build & Production

Build the project:

```bash
npm run build
```

Start production server:

```
npm start
```

## Project Structure

```
src/
├── index.ts              # Application entry point
├── routes/               # API route handlers
├── services/             # Business logic
├── models/               # Database models
├── jobs/                 # Scheduled background jobs
├── db/                   # Database configuration
└── middleware/           # Express middleware
```

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Coming Soon

- Authentication endpoints
- Stock mention endpoints
- Alert management
- User preferences

## Development Tools

- **Linting**: `npm run lint`
- **Formatting**: `npm run format`

## Tech Stack

- Express.js - Web framework
- TypeScript - Type safety
- PostgreSQL - Database
- Snoowrap - Reddit API wrapper
- Sentiment - Sentiment analysis
- JWT - Authentication
