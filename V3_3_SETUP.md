# Winter Arc OS V3.3

V3.3 preserves the V3.2 server-side AI quiz pipeline and adds the frontend progression layer:
- XP / levels
- streak tracking
- credibility score (timer evidence + consistency + quiz accuracy)
- smart actionable tasks generated from each target
- persistent task completion
- wrong-answer records
- weak-topic analysis
- adaptive retest flow using previous mistakes as focus
- daily/weekly analytics
- topic accuracy
- achievements

## Run
1. `npm install`
2. Copy `.env.example` to `.env`
3. Set `OPENAI_API_KEY`
4. Optionally set `OPENAI_MODEL`
5. `npm start`
6. Open `http://localhost:3000/Winter_Arc_OS_V3_3.html`

Study credibility remains explicitly limited: the timer verifies only time recorded inside the app; it cannot prove what the user did outside the app.
