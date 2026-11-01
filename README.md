# Dance Flow

React + Vite + Supabase + Cloudflare Pages. Mobile-first Focus Flow-inspired design.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
npm run build
```

Create a Supabase project, paste `supabase/schema.sql` into SQL Editor. Enable Email sign-in under Authentication. Fill the two `VITE_` vars in `.env.local`. Never put a service-role key in these variables.

## Cloudflare Pages

Connect GitHub repo. Build command `npm run build`, output directory `dist`, framework Vite. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in project environment variables. In Supabase Auth URL configuration set Site URL and permitted redirect URL(s) to the deployed Cloudflare domain. The `public/_redirects` file handles SPA navigation.

## Data safety

The legacy `dance-flow-prototype-v1` key is read but not deleted. New local edits are stored in `dance-flow-data-v1`. When signing into a fresh account, user must explicitly choose whether to upload local data; existing remote data is never automatically overwritten by the local copy. Export JSON before switching environments. This app saves a single JSON document per user. This is best suited to one-device-at-a-time editing; concurrent multi-device modifications may conflict. Do not use in multiple devices simultaneously without implementing version checking/merging.

## Features

5 tabs: Home, Moves (moves + YouTube bookmarks), Sequences, Choreography (projects + reference bookmarks), Records. Genre filtering; create/edit/delete entries; reorder steps and segments; video previews; practice logs; JSON import/export; email auth and Supabase sync.
