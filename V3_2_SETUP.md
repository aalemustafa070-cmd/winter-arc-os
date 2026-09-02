# Winter Arc OS V3.2 — Full AI Quiz

This version adds a real server-side AI quiz pipeline:

Target → Study Timer → Web Research → OpenAI AI generation → Quiz → Score → Stats

## Run

1. Install Node.js 18+.
2. Open a terminal in this folder.
3. Run:
   npm install
4. Create `.env` from `.env.example` and put your own OpenAI API key there.
5. Run:
   npm start
6. Open:
   http://localhost:3000

## Important
- Keep the API key on the server. Never put it in the HTML/JavaScript.
- The research layer currently uses Wikipedia as a safe public source.
- The AI is responsible for generating the quiz from the retrieved research; it is not the same as the old rule-based generator.
- The app records only study time measured by its own timer. It cannot prove what someone did away from the device.
- This is a working V3.2 foundation; a production Android app would later add authentication, database sync, rate limiting, secure deployment, and richer source search.
