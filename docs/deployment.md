# Deployment and prototype assets

## Local development

Run the app from the repository root:

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. The Next.js root route redirects to `/player.html`, the static prototype entry point.

## Frontend asset layout

- `apps/web/public/player.html` is the prototype page shell.
- `apps/web/public/prototype/` contains the page's stylesheets and JavaScript.
- Script order in `player.html` is significant: config, database adapter, AI adapter, game engine, then screens.

The root `public` folder is the only copy of these browser assets. Do not duplicate them in the repository root.

## Static hosting

For static hosting, publish the contents of `apps/web/public/`. Open `player.html` on hosts that do not automatically serve it as the directory index.

The prototype runs locally without configured external services. Do not put secret keys in browser-delivered files. Configure server-side secrets through the host's environment settings.
