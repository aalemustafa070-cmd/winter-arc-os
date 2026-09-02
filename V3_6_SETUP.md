# Winter Arc OS V3.6 — Personal AI Coach + PWA

V3.6 preserves the V3.2 server-side research/AI quiz pipeline and the V3.3–V3.5 progression layer.

## Added
- PWA manifest + service worker
- Home-screen install prompt when supported
- Offline app-shell caching
- Online/offline status indicator
- Daily Review panel
- Review of verified study minutes, task completion, and today's quiz accuracy

## Important
- LocalStorage remains the current data store.
- AI endpoints still require internet and a server-side OPENAI_API_KEY.
- Offline mode does not pretend to perform AI research.
- Study verification remains timer evidence only; it cannot prove activity outside the app.

## Run
npm install
node server.js
Open the served HTML from the same server origin. PWA features require HTTPS in production (localhost is normally allowed for development).
