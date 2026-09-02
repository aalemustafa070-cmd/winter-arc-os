# Winter Arc OS V3.4 Adaptive AI

V3.4 preserves the V3.2 server-side research + quiz pipeline and adds:
- AI goal decomposition into actionable tasks
- Persistent task completion
- Wrong-answer storage
- AI underlying-mistake analysis
- Weak-topic detection
- Adaptive retest generation
- XP, levels, streak, credibility
- Daily/weekly analytics
- Achievements

## Setup
1. Install Node.js 18+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
4. Optionally set `OPENAI_MODEL`.
5. Run `node server.js`.
6. Open `http://localhost:3000/Winter_Arc_OS_V3_3.html`.

The API key remains server-side and is never placed in the HTML.
The app's credibility/verification wording remains limited to timer-recorded evidence; it does not claim to prove off-device study.
