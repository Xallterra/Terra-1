# Makriva

Makriva is a production-oriented IT security intelligence and professional community platform for endpoint engineers, sysadmins, cloud admins, Microsoft 365 admins, SCCM/Intune admins, security analysts, and IT operations teams.

The home page is the product: a compact professional feed for real IT problems, verified fixes, field observations, live alerts, vulnerabilities, outages, and Microsoft update intelligence.

## Stack

- Next.js 15, React 19, TypeScript
- PostgreSQL + Prisma ORM
- Auth.js / NextAuth credentials auth with Prisma Adapter
- Redis-ready caching/rate limiting abstraction
- Server Actions and Route Handlers
- Clean CSS, lucide-react icons
- Docker/Vercel ready

## Local Setup

```bash
npm install
copy .env.example .env
docker compose up -d postgres redis
npx prisma migrate dev
npm run dev
```

Then open `http://localhost:3000`.

If `DATABASE_URL` is not configured, the community UI runs with seeded fallback data so the product surface remains reviewable.

## Production Setup

1. Provision PostgreSQL and Redis.
2. Set `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL` or `AUTH_URL`, `REDIS_URL`, and `INGESTION_SECRET`.
3. Run `npx prisma migrate deploy`.
4. Run `npm run build`.
5. Deploy to Vercel or run the Docker image.

## Commands

```bash
npm run dev
npm run build
npm run start
npm test
npx prisma generate
npx prisma migrate dev
```

## Main Routes

- `/` Community command center
- `/alerts` Live alert intelligence
- `/alerts/[slug]` Alert detail
- `/vulnerabilities` Vulnerability intelligence
- `/outages` Outage intelligence
- `/microsoft-updates` Microsoft update intelligence
- `/posts/[slug]` Post detail with comments/replies
- `/solutions` Accepted solutions knowledge base
- `/tags/[slug]` Tag feed
- `/profile/[username]` Professional profile
- `/login` Email/password login
- `/signup` Account creation
- `/logout` Sign out flow
- `/account` Protected account/profile settings
- `/auth/error` Friendly authentication error page
- `/admin` Moderation foundations
- `/api/ingest/alerts` RSS alert persistence route handler

## Community Capabilities

- Ask the Community composer
- Post categories, tags, vendor/product, severity, status, environment details, snippets
- Nested comments/replies
- Post/comment votes
- Accepted solution flow
- Bookmarks
- Reports/moderation foundations
- Professional profiles and reputation basics
- Search across community posts and alert intelligence
- Seed fallback data for local review

## Authentication

Makriva uses Auth.js / NextAuth with the Prisma Adapter and secure password hashes. Public visitors can browse the feed, read posts, search, view profiles, and inspect alerts/vulnerabilities/outages. Authenticated active users can post, comment, vote, bookmark, report content, edit account settings, and use chat.

Required production variables:

```bash
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_URL=
AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

OAuth providers are optional and only enabled when both client ID and secret are present. Credentials signup creates a `User` and `Profile`; login checks password hash and blocks suspended or deleted accounts.

## Security Notes

- Server Actions validate all inputs with Zod.
- Rate limiting uses Redis when `REDIS_URL` is configured and falls back to in-memory buckets locally.
- Server Actions use server-side user identity via `src/lib/auth.ts` and reject unauthenticated mutations.
- Passwords are hashed with bcrypt before storage; plain passwords are never stored.
- Auth cookies are managed by Auth.js/NextAuth.
- `/account`, `/admin`, and future `/chat` routes are protected by middleware and server-side checks.
- Suspended and deleted users are blocked from posting/chatting.
- Client-submitted user IDs are ignored.
- Prisma unique constraints prevent duplicate votes/bookmarks.
- Audit fields and soft delete fields are included in the schema.

## Alert Ingestion

The existing RSS intelligence still powers `/alerts`, `/vulnerabilities`, `/outages`, and `/microsoft-updates`.

To persist fetched alerts into PostgreSQL:

```bash
curl -X POST http://localhost:3000/api/ingest/alerts ^
  -H "x-ingestion-secret: change-me"
```

For production, call this route from Vercel Cron, a worker, or a Kubernetes CronJob.
