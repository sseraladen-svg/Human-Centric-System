# Player System

This repository contains a working local prototype with a real Next.js app shell, API routes, shared engine logic, and test coverage. It uses a mock in-memory user store by default so the app runs without external keys, while the database and Supabase wiring are scaffolded in the packages and environment files.

The root URL (`http://localhost:3000`) serves the original prototype UI from `/player.html`. Its static assets are mirrored under `apps/web/public/` so Next.js can serve the page; the prototype stores progress in browser local storage by default.

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
- `packages/db/migrations/001_init.sql` is the seeded migration used for initialization.

To apply migrations in a Supabase project, run the SQL in a Postgres session or use your preferred migration runner.

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

1. Push the repo to a Node-compatible host or Vercel.
2. Set the same environment variables in the hosting project settings.
3. Map the Vercel project to the app root and deploy.
4. Configure cron hits against the protected jobs endpoints using your platform scheduler.

## Key rotation

- Rotate `SUPABASE_SERVICE_ROLE_KEY` and `AI_API_KEY` immediately after any suspected leak.
- Update the environment values in the hosting provider and local `.env.local` file.
- Re-run the build and smoke tests after rotation.

## Dependency note

This repository uses the stack required by the brief: Next.js, React, TypeScript, Zod, Drizzle, Supabase libraries, and Playwright/Vitest. No extra dependencies beyond that stack were introduced.

## What remains incomplete

This local implementation is a working scaffold and testable baseline. Full multi-user Supabase auth, RLS-backed persistent account isolation, and a production-grade scheduled-worker integration remain to be wired against a real hosted Supabase project and cron provider once credentials are available.
