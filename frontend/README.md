# TrueDelivery Frontend

Frontend app for TrueDelivery, an AI-powered parametric income protection platform for delivery partners.

This project provides the worker and admin UI built with React + Vite.

## Tech Stack

- React 18
- Vite 8
- Recharts
- Lucide React

## Features

- Worker onboarding flow
- Policy overview page
- Live disruption monitor
- Claims timeline and payout visibility
- Worker dashboard and admin dashboard
- Simplified mode + accessibility mode

## Prerequisites

- Node.js 20+
- npm 10+

## Local Development

Install dependencies:

```bash
npm install
```

Start dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

## Environment Variables

Create `.env` (optional for local, required for hosted frontend):

```bash
VITE_API_BASE_URL=https://your-backend-domain.com
```

Notes:

- If `VITE_API_BASE_URL` is empty, frontend uses relative `/api/*` paths.
- For local split setup, run backend on `http://127.0.0.1:8787` and keep proxy settings from `vite.config.js`.

## Deployment (Vercel)

Recommended settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

Add env var in Vercel:

- `VITE_API_BASE_URL=https://<your-backend-domain>`

## Project Structure

```text
frontend/
  src/
    components/
    data/
    lib/
    pages/
  index.html
  vite.config.js
  package.json
```

## Product Context

TrueDelivery covers income loss due to verified disruptions such as:

- Heavy rain
- Extreme heat
- Severe AQI
- Platform outage
- Curfew / strike

Payouts are designed to be automatic after trigger verification.
