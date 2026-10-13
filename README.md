# Northstar Admin Dashboard

A local-first React and TypeScript customer directory for an admin workspace. The first vertical slice includes customer metrics, status filtering and editing, text search, pagination, adding a demo customer, and CSV export.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Local development

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. No Docker, API server, credentials, or external services are required. The dashboard uses an in-memory sample dataset; changes reset on reload. Google Fonts are an optional visual enhancement, and system sans-serif fallback fonts are used when offline.

## Checks

```sh
npm run check
```

This runs the TypeScript production build and the Vitest/Testing Library suite in jsdom.

## Architecture

`src/App.tsx` owns the typed demo customer model and UI state. Search, status filters, pagination, summary counts, status edits, customer creation, and CSV export are derived or handled locally, keeping the app usable without a backend. The application entry point and global presentation are in `src/main.tsx` and `src/styles.css`. `src/App.test.tsx` exercises directory rendering, search, empty results, filtering, editing, creation, and pagination without network services. When an API is introduced, replace the initial in-memory collection with an injected repository/data client and retain the UI tests against deterministic fixtures.

## License

MIT. See [LICENSE](LICENSE).
