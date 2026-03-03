# Linkro

Linkro is a production-oriented SaaS starter for creators to manage digital identities with two separate interfaces:

- Creator Dashboard for profile/link management and analytics
- Admin Command Center for platform oversight, usage insights, and revenue metrics

## Tech Stack

- Next.js App Router + TypeScript (strict)
- Tailwind CSS + shadcn-style UI primitives + Framer Motion
- Firebase (Auth, Firestore, Storage) with Admin SDK session cookies
- Zustand + React Hook Form + Zod
- Stripe subscriptions and webhook entry point
- Recharts for creator/admin analytics visualizations

## Features Implemented

### Creator Dashboard

- Profile Builder with template choices (Minimal, Glassmorphism, Neo-brutalism)
- Live mobile frame preview while editing profile values
- Link management with add/edit/delete and drag-and-drop reordering
- Analytics cards for unique visitors, views, clicks, CTR ($CTR = Clicks / Views * 100$)
- Link performance and referrer charts

### Admin Command Center

- Custom-claim gated admin route (`admin: true`)
- Platform metrics: total users, active users (24h/7d), template usage
- Revenue metrics: active Pro count, MRR, transaction history from Stripe
- User management table with uid/email/join date/status

### Public Profile + Performance

- Dynamic profile route at `/{username}`
- ISR revalidation for fast profile loads
- Dynamic OG image endpoint (`/api/og`)
- Edge click and view tracking with low-latency redirect behavior

## Firestore Collections

- `users`: `uid`, `username`, `email`, `plan`, `templateId`, `profile`, `status`
- `links`: `userId`, `title`, `url`, `order`, `isActive`
- `analytics_events`: `linkId`, `ownerId`, `type`, `timestamp`, `metadata`

## Environment Variables

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

Required groups:

- Firebase client env (`NEXT_PUBLIC_FIREBASE_*`)
- Firebase Admin env (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)
- Stripe env (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Validation

```bash
npm run build
```

Build currently passes for the full app routes and API handlers.
