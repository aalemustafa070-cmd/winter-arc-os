# Winter Arc OS V3.7 — Personal AI Coach + Priority Engine

V3.7 preserves the V3.2 research-backed quiz API and the V3.3–V3.6 progression/PWA layers.

## Added
- Automatic local Today Priority Engine
- Weak-topic + unfinished-task prioritization
- Available-time based plan sizing
- Browser notification permission/reminder while app is active
- PWA service-worker versioning and update cleanup
- APK-ready PWA structure (can be packaged later with a trusted Android wrapper such as Trusted Web Activity/Capacitor)

## Important
- AI still requires the server and OPENAI_API_KEY.
- Notifications are browser/PWA notifications; reliable background push needs a push service/backend.
- Study verification remains timer evidence only.

## Run
npm install
npm start
