# Winter Arc OS V3.7 — Fixed

## Important
- `index.html` contains the fixed frontend.
- `server.js` contains the AI API endpoints.
- `OPENAI_API_KEY` must be a real OpenAI API key. Do NOT use Render's **Generate** button as the OpenAI key; that only creates a random Render secret.
- `OPENAI_MODEL` may be set to `gpt-5.6-luna` or omitted because the server uses that as its default.

## Render
Build Command:
`npm install`

Start Command:
`node server.js`

Environment variables:
- `OPENAI_API_KEY` = your real OpenAI API key
- `OPENAI_MODEL` = `gpt-5.6-luna` (optional)
