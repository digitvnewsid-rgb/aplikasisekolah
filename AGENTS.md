## Cursor Cloud specific instructions

- This repository is a React/Vite school management SPA. The required development service is the Vite app from `package.json`; run it with host binding, for example `npm run dev -- --host 0.0.0.0`, so browser-based cloud testing can reach it.
- The app currently uses in-memory seed data from `src/lib/store.tsx` for the main UI flows. The Supabase migration and Edge Function files are backend artifacts, but the running SPA does not require a local Supabase stack for standard dashboard, QR, finance, attendance, assignment, or announcement testing.
- There are no `lint` or `test` npm scripts at the moment. Use `npx tsc --noEmit` as the available TypeScript check, and `npm run build` for the Vite build check.
