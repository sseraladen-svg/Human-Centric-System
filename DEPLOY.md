# Player System: source files

## Files
- `player.html`: the page shell (markup only). Loads the files in `src/`. Required by browsers.
- `src/styles.css`: all styling (tactical design system, Penalty Zone, judgement screen).
- `src/config.js`: settings. Database and AI keys are blank, so the app runs locally.
- `src/db.js`: optional database sync (Supabase REST). Off until keys are set.
- `src/ai.js`: optional AI judge, plus the AI charter. Off until a key or endpoint is set.
- `src/game.js`: game rules and state (XP, streaks, levels, gates, specials, stability, Penalty Zone, judgement).
- `src/screens.js`: screens, menus, event handling, and startup.

Load order matters: config, db, ai, game, screens. `player.html` already loads them in that order.

## Run
- Local: `python3 -m http.server 8080` in the `deploy` folder, then open http://localhost:8080/player.html
- Hosting: upload the whole `deploy` folder (keep `src/` next to `player.html`) to GitHub Pages, Netlify or Vercel.

## Turn on optional services
Edit `src/config.js`:
- `supabaseUrl`, `supabaseKey`, `userId`: free Supabase sync. Create the table first:
  `create table if not exists hunter_state (user_id text primary key, data jsonb not null, updated_at timestamptz not null default now()); alter table hunter_state disable row level security;`
- `ai.endpoint` (preferred, a proxy) or `ai.apiKey`: AI judging for reports the rules cannot read.

## Before public release
- Keep keys private. Anything in these files is visible to anyone who loads the page.
- Penalty Zone, Red Gate, Monarch and Job Change Quest are still anime-derived wording.
