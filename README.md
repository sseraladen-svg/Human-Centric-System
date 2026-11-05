# HCS

A habit and discipline tracking prototype with a Next.js app, browser-based frontend, API scaffold, shared game engine, and database packages.

The root URL redirects to `/player.html`. The page and all browser assets have one canonical home under `apps/web/public/`. On first use, the prototype asks before saving a named local profile. Each profile is stored separately in this browser; no cloud sync happens unless it is separately enabled in the app and configured.

Local profiles are not authenticated accounts or password-protected. Anyone with access to the same browser profile may be able to access them. Clearing site data can erase local progress. Users can also continue for one session without saving.

## Repository structure

```text
apps/
  web/
    app/                 Next.js pages and API route handlers
    lib/                 Web application helpers
    public/
      player.html        Browser prototype entry point
      prototype/          Prototype styles, scripts, and game logic
packages/
  db/                    Database schema and SQL migrations
  engine/                Pure game rules and unit tests
  shared/                Shared schemas and types
jobs/                    Scheduled job handlers and tests
e2e/                     Playwright browser tests
docs/                    Deployment and project documentation
```

## Local setup

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and fill any hosted values you want to use:
   `cp .env.example .env.local`
3. For a local Supabase project, create a project and set the environment values for:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET`
   - `AI_API_KEY`
4. Start the app:
   `npm run dev`
5. Open http://localhost:3000

## Database migrations

Schema and migration assets live under `packages/db/`.

- `packages/db/src/schema.ts` contains the layout and row-level security definitions.
- `packages/db/migrations/001_init.sql` contains the initial migration.

To apply migrations in a Supabase project, run the SQL in a Postgres session or use your preferred migration runner.

## Browser storage and optional sync

- Local profile creation requires explicit in-product consent. Browsers do not display a permission prompt for `localStorage`.
- Progress stays in per-profile browser storage by default. Local profiles are not verified identities.
- Database sync remains optional and disabled per profile until the user opts in. The existing browser Supabase adapter still requires its configuration in `apps/web/public/prototype/config.js`.
- The browser-side database adapter is suitable only for an explicitly configured project with appropriate access policies. It is not a substitute for authenticated, server-enforced user isolation.
- If local storage is unavailable, the user can continue for the current session without persistence.

## Run the app

- Development mode: `npm run dev`
- Production build: `npm run build`
- Production start: `npm run start`
- Tests: `npm test`
- Playwright smoke test: `npm run e2e`

## Cron jobs locally

The app exposes protected job endpoints under `app/api/jobs`.

Example local curl calls:

```bash
curl -X POST http://localhost:3000/api/jobs/settle-days \
  -H "x-cron-secret: $CRON_SECRET"
curl -X POST http://localhost:3000/api/jobs/judge \
  -H "x-cron-secret: $CRON_SECRET"
```

## Deployment

See [deployment guide](./docs/deployment.md) for the frontend asset layout and local/static hosting notes.

1. Push the repo to a Node-compatible host or Vercel.
2. Set required environment variables in the hosting project settings.
3. Deploy the app from the repository root.
4. Configure scheduled requests to the protected jobs endpoints using your platform scheduler.

## Key rotation

- Rotate `SUPABASE_SERVICE_ROLE_KEY` and `AI_API_KEY` immediately after any suspected leak.
- Update the environment values in the hosting provider and local `.env.local` file.
- Re-run the build and smoke tests after rotation.

## Dependency note

This repository uses the stack required by the brief: Next.js, React, TypeScript, Zod, Drizzle, Supabase libraries, and Playwright/Vitest. No extra dependencies beyond that stack were introduced.

## What remains incomplete

This local implementation is a working scaffold and testable baseline. Full multi-user Supabase auth, RLS-backed persistent account isolation, and a production-grade scheduled-worker integration remain to be wired against a real hosted Supabase project and cron provider once credentials are available.
