# Winter Arc OS V3.9 — Free Hybrid Patch

## What changed
- Added `/api/ai-status` so the frontend can detect whether an AI key is configured.
- Added clearer server-side classification for missing key, quota/rate-limit, auth, permission, network, and generic API errors.
- API errors now return `reason` and `hybridMode`, while the existing frontend fallbacks remain usable.
- Improved user-facing fallback wording: AI/quota failure automatically uses the free offline path.
- Fixed PWA `manifest.json` `start_url` from the stale V3_3 filename to `./index.html`.
- Updated package/version labels to 3.9.0.
- Updated stale server version labels.
- Added a small AI/free-mode status indicator.

## Important
V3.9 does not magically create OpenAI API credits. If the OpenAI key has no quota, the app automatically falls back to its built-in free/offline features instead of becoming unusable.
