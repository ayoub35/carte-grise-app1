# AutoDossiers — Document Management Platform

A full-stack web application for managing automobile documentation (carte grise / vehicle registration). Built with **React**, **Express**, **PostgreSQL** (via Neon), and **Stripe** for payments.

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Radix UI, Framer Motion
- **Backend**: Express.js, TypeScript, Drizzle ORM
- **Database**: PostgreSQL (Neon serverless)
- **Payments**: Stripe
- **PDF**: PDFKit

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (e.g. [Neon](https://neon.tech))

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your real values

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Random secret for session cookies |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `APP_BASE_URL` | Public URL of the app |
| `PORT` | Server port (default: 5000) |

## Deploy on Railway

1. Push this repo to GitHub
2. Connect the GitHub repo in [Railway](https://railway.app)
3. Add the environment variables above in Railway's dashboard
4. Railway will auto-build and deploy using `railway.json`
