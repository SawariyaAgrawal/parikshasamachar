# Lovable Import Zone

Keep raw exports from Lovable in this `frontend/` folder as reference code only.

## Recommended folder format

- `frontend/lovable-dump/<yyyy-mm-dd>-<feature>/...`

Example:

- `frontend/lovable-dump/2026-02-27-landing-page/...`

## Important

- Do not import Vite entry files (`main.tsx`, `App.tsx`, `vite.config.ts`) into the Next.js app.
- Production app code must live in `src/` and `public/`.
- Move reusable assets (images/fonts/icons) to `public/`.
- Port reusable UI components into `src/components/`.

This keeps builds stable while preserving full Lovable exports for future reference.
