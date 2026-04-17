# TrueDelivery Finalization and Deployment Guide

This document contains the three requested sections:

1. All remaining work to complete before production.
2. Complete deployment procedure (Frontend on Vercel + Backend on Render or Railway).
3. New feature opportunities to include next.

---

## 1) All Work That Needs To Be Done

This is the final production-readiness checklist for the current codebase.

### A. API hardening and upgrade

1. Add API versioning.

- Keep existing routes for compatibility.
- Add `/api/v1/*` routes and route all frontend calls to versioned endpoints.

2. Add request validation for mutation endpoints.

- Validate payload for `PUT /api/worker`.
- Validate payload for `POST /api/simulate-disruption`.
- Return clear `400` error payloads for invalid fields.

3. Add standard response envelope.

- Response format:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "requestId": "...",
    "timestamp": "..."
  }
}
```

4. Add request ID middleware + structured logs.

- Generate request IDs for each request.
- Include requestId in responses and server logs.

5. Add health and readiness improvements.

- Extend `/api/health` with uptime, version, environment.
- Add a simple `/api/ready` endpoint if needed.

6. Add safe idempotency behavior for write endpoints.

- Support `Idempotency-Key` header for reset and simulation routes.

### B. Frontend API client and env handling

1. Add environment-based API base URL.

- Current frontend uses relative `/api`.
- Add `VITE_API_BASE_URL` support in `src/lib/api.js`.
- Use relative path in local dev and absolute backend URL in production.

2. Add timeout and retry strategy.

- Use `AbortController` timeout for requests.
- Retry only safe requests (for example bootstrap/health), not state-changing writes unless explicitly idempotent.

3. Improve error classes.

- Separate network errors, validation errors, and server errors.
- Show user-friendly and actionable UI messages.

### C. Data and persistence

1. Replace JSON file persistence for production.

- Current `server/data/runtime.json` is demo-grade.
- Move to real database (Postgres recommended).

2. Add migration-safe schema.

- Tables: workers, claims, alerts, events, settings.
- Add indexes for workerId, date, disruptionId.

3. Add backup and retention policy.

- Daily snapshots/backups.
- Basic restore procedure documented.

### D. Security and platform readiness

1. Enable CORS policy for frontend domain.
2. Add rate limiting on API endpoints.
3. Add Helmet or equivalent secure headers.
4. Add input sanitization and payload size limits.
5. Add basic auth strategy for admin endpoints.
6. Remove any sensitive logs and enforce secret-based env vars.

### E. Testing and quality gates

1. Add backend integration tests (Vitest + Supertest).

- Health endpoint.
- Bootstrap snapshot shape.
- Worker onboarding flow.
- Disruption simulation flow.
- Duplicate claim prevention behavior.
- Reset flow.

2. Add frontend smoke test.

- App boots.
- Onboarding -> dashboard route transition.
- API offline fallback behavior.

3. Add CI checks.

- Build frontend.
- Run tests.
- Fail on test or build error.

### F. Operational readiness

1. Add deploy-time environment matrix.

- Dev, staging, production values.

2. Add observability.

- Error tracking (Sentry or equivalent).
- Request logs and basic metrics.

3. Add release process.

- Tag-based release or branch-based release.
- Rollback steps documented.

---

## 2) Complete Deployment Procedure

Target:

- Frontend: Vercel
- Backend: Render or Railway

This section includes both backend approaches.

### 2.1 Pre-deployment code updates (required once)

1. Add production scripts to `package.json` if needed:

- Keep frontend build: `vite build`
- Ensure backend start command is available and stable:
  - `node server/index.js`

2. Add API base URL support in frontend.

- Example behavior in `src/lib/api.js`:
  - If `VITE_API_BASE_URL` exists, call `${VITE_API_BASE_URL}/api/...`
  - Else use relative `/api/...`

3. Enable CORS in backend for Vercel domain(s).

- Allow production frontend origin.
- Keep localhost origin for development.

4. Make sure backend listens on `process.env.PORT`.

- Already done in current project.

5. (Optional but recommended) Separate frontend and backend root-level deployment docs.

---

### 2.2 Frontend deployment on Vercel

#### Option A: Vercel Git integration (recommended)

1. Push latest code to GitHub.
2. Sign in to Vercel.
3. Click "Add New Project" and import repository.
4. Set project settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

5. Add environment variable:

- `VITE_API_BASE_URL=https://<your-backend-domain>`

6. Deploy.

7. After deployment:

- Open frontend URL.
- Verify onboarding, monitor simulation, claims, and reset flow.

#### Option B: Vercel CLI

1. Install CLI:

```bash
npm i -g vercel
```

2. Run from project root:

```bash
vercel
```

3. For production deploy:

```bash
vercel --prod
```

4. Set environment variable via Vercel dashboard or CLI:

- `VITE_API_BASE_URL`

---

### 2.3 Backend deployment on Render

#### Render Web Service setup

1. Push backend code to GitHub (same repository is fine).
2. In Render dashboard, create "Web Service".
3. Connect repository.
4. Configure service:

- Environment: Node
- Build command: `npm install`
- Start command: `node server/index.js`
- Root directory: repository root (or set if split in future)

5. Add environment variables:

- `NODE_ENV=production`
- `PORT` (Render usually injects this automatically)
- Any additional secrets/config values

6. Add persistent disk only if you keep file-based storage.

- If using JSON file for state, attach disk and update file path accordingly.
- Better: move to Postgres and avoid disk dependency.

7. Deploy and note backend URL:

- Example: `https://truedelivery-api.onrender.com`

8. Update Vercel env var:

- `VITE_API_BASE_URL=https://truedelivery-api.onrender.com`

9. Add CORS allowed origin in backend for Vercel URL.

10. Validate endpoints:

- `/api/health`
- `/api/bootstrap`
- `/api/simulate-disruption`

---

### 2.4 Backend deployment on Railway

#### Railway service setup

1. Push code to GitHub.
2. Create new Railway project.
3. Link repository.
4. Set service configuration:

- Build: default Nixpacks or Node build
- Start command: `node server/index.js`

5. Add environment variables:

- `NODE_ENV=production`
- `PORT` (Railway generally provides this)

6. Add volume only if still using local JSON persistence.

- Recommended: use Railway Postgres plugin instead.

7. Deploy and copy backend public domain.

8. Update Vercel frontend env var:

- `VITE_API_BASE_URL=https://<railway-backend-domain>`

9. Configure CORS allowed origin(s) to Vercel domain.

10. Run verification checks after deploy.

---

### 2.5 Render vs Railway quick choice

Use Render if:

- You want straightforward web service setup and simple UI.
- Your team prefers explicit service configuration.

Use Railway if:

- You want fast iteration, plugin ecosystem, and easy database add-on flow.
- You prefer tighter app + database project grouping.

---

### 2.6 End-to-end production verification checklist

After both deployments are live:

1. Frontend loads without console errors.
2. `/api/health` reachable from backend public URL.
3. Onboarding saves worker successfully.
4. Simulate disruption creates monitor event and claim.
5. Duplicate simulation in same day gets blocked as expected.
6. Reset demo clears worker and claims state.
7. View mode and accessibility mode preferences persist.
8. CORS has no browser-blocked requests.
9. No mixed-content issue (all HTTPS).
10. Error fallback message appears if backend is intentionally stopped.

---

## 3) New Features That Are Possible To Include

Prioritized feature roadmap for the current product direction.

### A. Product and UX features

1. Multi-worker admin view.

- Compare claims and risk by city/zone.

2. Real trigger feeds.

- Integrate weather, AQI, and outage APIs with scheduled ingestion.

3. Personalized alerts.

- Push/email/WhatsApp style notifications for trigger watch states.

4. Explainable risk profile.

- Show "why this premium" factors with transparent breakdown.

5. Smart onboarding autofill.

- Pre-fill city/zone suggestions and platform defaults.

6. Local language support.

- Hindi + regional language toggle for accessibility and adoption.

### B. Reliability and anti-fraud features

1. Strong duplicate + abuse detection.

- Cross-device and velocity rules.

2. Geo-consistency checks.

- Zone drift and improbable movement detection.

3. Event-sourcing style audit log.

- Immutable records for claims and payout decisions.

4. Rule simulation sandbox.

- Test policy/trigger rules before enabling in production.

### C. Operations and analytics features

1. Daily KPI dashboard.

- Claim ratio, payout latency, trigger counts, blocked attempts.

2. Incident center.

- Track backend outages and degraded dependencies.

3. Feature flags.

- Enable/disable policy or UX features gradually.

4. Cohort and retention analytics.

- Worker onboarding completion and weekly renewal metrics.

### D. Platform and engineering features

1. Database migration and ORM layer.

- Move from file state to managed Postgres.

2. Background jobs.

- Queue for trigger ingestion, payout processing, notification retries.

3. Webhooks.

- Outbound callbacks for third-party systems.

4. Full CI/CD pipelines.

- Automated test, build, and deployment gates.

5. Staging environment.

- Mandatory pre-production validation before prod rollout.

---

## Suggested Immediate Next 7-Day Execution Plan

Day 1:

- API versioning + validation + response envelope.

Day 2:

- Frontend env-based API base URL + API timeout/error handling.

Day 3:

- CORS + security headers + rate limiting.

Day 4:

- Integration test suite + CI wiring.

Day 5:

- Deploy backend (Render or Railway) and verify endpoints.

Day 6:

- Deploy frontend on Vercel and run end-to-end checks.

Day 7:

- Stabilization fixes + monitoring + release notes.

---

If needed, this file can be split next into:

- `DEPLOYMENT.md`
- `ROADMAP.md`
- `PRODUCTION_CHECKLIST.md`
  for easier team ownership.
