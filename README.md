# Back-End Needed Work

Outstanding work for the Syntrix API (`E:\GP\Back-End`). This is the master backend task
list. The detailed request/response shapes for the SIEM data features and the Canvas upload
also live in `back-end requirements.txt`; this file is the prioritized checklist.

The frontend for every feature below is already built against ES-shaped mock data. The mock
modules under `Front-End/src/utils/` ARE the response-shape contract: each endpoint should
return JSON matching those object shapes so the UI needs no rework.

Last updated: 2026-06-30.

## Conventions

- Base path `/api/v1`. Keep the existing response envelope: `{ status, data, meta }`.
- All endpoints require authentication (Bearer access token).
- Mutations (POST/PATCH/PUT/DELETE) require the SOC_ADMIN role, matching the current modules.
- Elasticsearch is the intended source for host metadata, logs/events, ingest stats, alerts, and hunting execution. Postgres (Prisma) stays the system of record for config entities (analysts, rules).

--------------------------------------------------------------------------------

## P0 - Core SIEM gaps (the project goal)

- [ ] Wire Elasticsearch for real. The client is configured and `/health` pings it, but no module reads or writes ES. Implement log ingestion and log search. This is the largest gap relative to the project goal.
- [ ] Alert API. The `Alert` Prisma model exists but has no controller/route/service. Build it (see Alerts below). Detections are the main SIEM output and are currently not exposed.
- [ ] Decide MongoDB's role or remove it. It is configured but its startup connection is commented out and it is unused.

## P1 - Auth endpoints the frontend already expects

- [ ] `POST /auth/forgot-password` - start a password reset (email a token).
- [ ] `POST /auth/reset-password` - complete a reset with a token + new password.
- [ ] `POST /auth/verify-email` - verify an email with a 6-digit code.
- [ ] First-run signup is already implemented (`POST /auth/signup`, gated by `allowOnlyFirstRun`) and `GET /system/status` returns isFirstRun. The frontend will wire to these.

The frontend service stubs already exist in `Front-End/src/services/auth.services.js` and point at `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`.

## P2 - Data APIs for the built UI

### Hosts (rich host detail)
- [ ] `GET /hosts`, `GET /hosts/:id`, `POST /hosts`, `PATCH /hosts/:id`, `DELETE /hosts/:id`.
- [ ] `POST /hosts/:id/isolate` and `/unisolate` for the detail-page Isolate action.
- The current `Device` model only has `ip` and `hostName`. The detail page expects a full ECS-style host document (OS, hardware, network interfaces, MAC, agent/telemetry, posture, vulnerabilities, risk, users, tags). Extend `Device` or compose from Elasticsearch `host.*` / `agent.*` docs.
- `POST /hosts` body is the five form fields plus an optional `details` object (ES-shaped host doc) that should be deep-merged under the form fields. Shape: `Front-End/src/utils/hostsMockData.js`.

### Log sources
- [ ] `GET /log-sources`, `GET /log-sources/:id`, `POST /log-sources`, `PATCH /log-sources/:id`.
- Back with Elasticsearch index/data-stream stats (event counts, histogram, storage, sample events) plus integration config. Shape: `Front-End/src/utils/logsMockData.js`.

### Alerts
- [ ] `GET /alerts` (filter by severity, status, search, host; sort severity then time), `GET /alerts/:id`, `PATCH /alerts/:id` (status changes for Acknowledge/Close/Escalate).
- [ ] Optional `GET /alerts/stats` for the severity summary cards.
- Data-model note: the queue includes standalone alerts (cloud/account-level and cross-host correlations) with no single host. Make `Alert.deviceId` optional and add `scope` / `source` fields, or model an alert scope separately. Shape: `getAllAlerts` and `STANDALONE_ALERTS` in `Front-End/src/utils/securityData.js`.

### Advanced hunting (Detection)
- [ ] `POST /hunting/query` with body `{ query, language: "esql" | "kql" }`. Execute read-only against Elasticsearch (ES|QL API for ES|QL; translate KQL to query DSL). Enforce a result cap, a timeout, and index scoping. Response: `{ data: { mode: "events" | "stats", columns, rows, total, took } }`.
- [ ] `GET/POST/PUT/DELETE /hunting/queries` for the saved-query library. Shape: `HUNTING_QUERIES` in `securityData.js`.
- [ ] "Save as detection rule" should create a `Rule` via the existing `POST /rules`, carrying the query text and language so a rule engine can run it on a schedule and raise alerts.

### Dashboards
- [ ] `GET /dashboards`, `GET /dashboards/:id`, `POST /dashboards`, `PATCH /dashboards/:id`, `DELETE /dashboards/:id`.
- [ ] Panel/visualization data per dashboard from Elasticsearch aggregations (the detail page currently renders deterministic mock panels). Shape: `Front-End/src/utils/dashboardsMockData.js`.

### Discover / search
- [ ] A search endpoint for the Discover page: KQL (or ES|QL) query plus time range, returning documents, a histogram, and field statistics (top values per field). The frontend currently filters a small mock corpus client-side.

## P3 - Already built, needs frontend wiring (not new backend work)

- Rules: full CRUD module exists (`/rules`). The frontend Rules management page will consume it. Consider adding `query` and `language` columns to the `Rule` model so hunting queries saved as rules can be executed.
- Devices and Services: `/devices` and `/services` CRUD plus streaming already exist. The Hosts UI should eventually map to `/devices`; a Services UI can map to `/services`.

## P4 - Canvas upload (from back-end requirements.txt)

- [ ] `POST /api/upload` (multipart/form-data, field `file`) returning `{ url }`, with size limits, filename sanitization, static serving, rate limiting, and auth. Full detail in `back-end requirements.txt`.

## Summary of new endpoints

- POST   /auth/forgot-password, /auth/reset-password, /auth/verify-email
- GET/POST/PATCH/DELETE  /hosts   (+ POST /hosts/:id/isolate, /unisolate)
- GET/POST/PATCH         /log-sources
- GET/PATCH              /alerts  (+ GET /alerts/stats)
- POST                   /hunting/query
- GET/POST/PUT/DELETE    /hunting/queries
- GET/POST/PATCH/DELETE  /dashboards
- POST                   /search (Discover: query + histogram + field stats)
- POST                   /api/upload (Canvas)
- (reuse) POST /rules for "Save as detection rule"

## Notes

- The service `port` filter crash (TypeError on range filters) was already fixed on both the validation and the filter builder.
- Project rules: no em dashes, English-only comments, comment discipline.
