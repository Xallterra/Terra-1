# Makriva

Makriva is a modern dark-theme SaaS website for real-time IT alerts and technical intelligence.

## Stack
- Next.js (App Router) + TypeScript
- Component-first architecture
- Modular alert schema and data source layer (`src/lib/alerts-data.ts`)

## Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Project structure
- `src/app`: route pages (Home, Alerts, Microsoft Updates, Vulnerabilities, Outages, About, Contact)
- `src/components`: reusable layout, alerts, shared, and home sections
- `src/lib/alerts-data.ts`: sample alert records and helper query utilities
- `src/types/alert.ts`: alert schema used across the app

## Editing content
- Edit sample alerts in `src/lib/alerts-data.ts`.
- Update homepage text in `src/components/home/*`.
- Adjust branding/navigation in `src/components/layout/*`.

## Connecting real feeds later
Create ingestion jobs that map external sources into the same `AlertItem` schema:
1. Microsoft updates feeds -> normalize to `category: "Microsoft Update"`
2. CVE sources -> normalize to `category: "Vulnerability"`
3. Outage sources -> map incident lifecycle to `status`
4. Publish merged records to a DB/API, replacing static imports
5. Trigger notifications (email, Slack, Teams) from new/high-priority records

Recommended next backend additions:
- PostgreSQL + Prisma model for alerts
- `/api/ingest/*` routes for source connectors
- Cron-triggered ingestion + deduplication
- User subscription preferences for alert routing

## Email integration
Contact and subscribe forms now post to:
- `POST /api/contact`
- `POST /api/subscribe`

Optional environment variables for Resend integration:
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

If env vars are missing, forms still return success responses but do not send provider emails.
