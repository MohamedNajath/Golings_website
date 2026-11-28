# Goalings Internship & Training: setup, security and testing guide

## What was built
**Website (React/Vite, same design system):** `/internship-training` (15 sections), five program pages `/internship-training/:slug`,
`/privacy-policy`, `/terms-and-conditions` (drafts, see below), and the protected `/admin/internships` dashboard.
**API (`/server`, Node 20+ / Express / PostgreSQL):** public application endpoint with CV upload, admin login, application management, email.
The original site had no backend, so this API is new. It is small, has no framework beyond Express, and can be replaced by a Spring Boot service later: the contract is the 8 endpoints below.

## Run it locally
```bash
# 1. PostgreSQL: create a database and user (any Postgres 13+)
createdb goalings          # or use your existing server

# 2. API
cd server
cp .env.example .env       # fill DATABASE_URL, JWT_SECRET, FORM_TOKEN_SECRET (see below)
npm install
npm run migrate            # creates tables (also runs automatically on `npm start`)
npm run create-admin -- --email you@goalings.com     # asks for the password (hidden prompt, min 12 chars)
npm run dev                # http://localhost:4000

# 3. Website (new terminal, project root)
npm install
npm run dev                # http://localhost:5173  (Vite proxies /api to :4000)
```
Generate secrets: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` (run twice: JWT_SECRET and FORM_TOKEN_SECRET).

## Environment variables (`server/.env`, never commit)
| Variable | Purpose |
|---|---|
| `DATABASE_URL` / `DATABASE_SSL` | PostgreSQL connection (SSL for most managed databases) |
| `JWT_SECRET`, `FORM_TOKEN_SECRET` | 32+ char random secrets (admin sessions / anti-spam tokens). The server refuses to start without them |
| `FRONTEND_ORIGIN` | Website origin(s) allowed to call the API (only needed if site and API are on different origins) |
| `UPLOAD_DIR`, `MAX_CV_MB` | Where CVs are stored (outside any public folder, back it up) and the size limit (default 5 MB) |
| `SERVE_FRONTEND`, `TRUST_PROXY` | `SERVE_FRONTEND=true` lets the API also serve `../dist`; `TRUST_PROXY=true` behind nginx/a load balancer |
| `SMTP_HOST/PORT/SECURE/USER/PASS`, `MAIL_FROM`, `ADMIN_NOTIFY_EMAIL` | Email. If `SMTP_HOST` is empty, emails are skipped and recorded as `skipped`: applications are still saved |
Website build-time (optional): `VITE_API_BASE_URL` (only if API is on another origin), `VITE_MAX_CV_MB` (keep equal to `MAX_CV_MB`).

## Database migrations
`server/migrations/001_internship_system.sql` creates `admin_users`, `internship_applications`, `internship_notes` (+ indexes, CHECK constraints for every enum).
`npm run migrate` applies new `*.sql` files once, in order, tracked in `schema_migrations`. Add future changes as `002_*.sql`.

## Deploying
Simplest (one server): `npm run build` in the root → `cd server && SERVE_FRONTEND=true NODE_ENV=production npm start` behind HTTPS (nginx/Caddy/Cloudflare) with `TRUST_PROXY=true`.
Two servers: serve `dist/` statically, reverse-proxy `/api` to the API **on the same domain** (e.g. nginx `location /api/ { proxy_pass http://127.0.0.1:4000; client_max_body_size 6m; }`), so the admin cookie is first-party.
Run the API with a process manager (systemd/pm2/Docker). Use HTTPS only: in production the admin cookie is `Secure`.

## Admin access (secure)
1. No admin accounts exist by default and none are hard-coded. Create one on the server: `npm run create-admin -- --email you@goalings.com [--role admin|viewer]`.
2. Open `https://your-site/admin/internships` and sign in. `admin` can change status/notes; `viewer` is read-only.
3. Sessions are an HttpOnly, SameSite=Strict, 8-hour cookie; login is rate-limited (10 / 15 min / IP); passwords are bcrypt-hashed; deleting an admin row revokes access immediately.
4. To reset a password, run `create-admin` again with the same email.

## Security measures implemented
Server-side validation of every field (zod) mirrored in the browser; PDF-only CV (extension + MIME + `%PDF-` magic bytes, size cap), stored under a random name with mode 600 outside the web root, downloadable only by signed-in admins; parameterized SQL everywhere; LIKE wildcard escaping; helmet headers; CORS allow-list; rate limits (5 successful applications/hour/IP, 60 requests/10 min, 10 logins/15 min); spam protection = honeypot field + signed time-stamped form token (rejects instant or replayed posts); IP stored only as a salted hash; CSRF defence (SameSite=Strict + required `X-Requested-With` header on admin writes); no applicant data in any public endpoint; real errors are never shown as success (the success message only appears after the API returns 201).

## API summary
`GET /api/internship/form-token` · `POST /api/internship/applications` (multipart) · `POST /api/admin/login|logout` · `GET /api/admin/me|stats|applications|applications/:id|applications/:id/cv` · `PATCH /api/admin/applications/:id` · `POST /api/admin/applications/:id/notes`

## Content you must confirm (nothing invented)
`src/data/internshipConfig.ts`: stipend/paid-or-unpaid, fees, hours, start dates, deadline, review time. Empty = the site says "will be confirmed by the Goalings team".
`/privacy-policy` and `/terms-and-conditions` are **drafts** describing what the system actually does; have them reviewed before launch.
The certificate graphic is an illustration labelled as such. No testimonials, statistics or guarantees are shown.

## Automated tests
`cd server && DATABASE_URL=… npm test` runs 41 end-to-end API checks against real PostgreSQL and a local SMTP catcher (validation, upload rules, spam protection, auth, RBAC, filters, status/notes, CV download, rate limits, email delivery).

## Manual testing checklist
- [ ] Nav shows "Internship & Training" on desktop and in the mobile menu; opens `/internship-training`
- [ ] 5 program cards: 3 + 2 on desktop, 2 per row on tablet, 1 on mobile; Learn More opens each program page; Apply Now preselects the program
- [ ] Roadmap months, FAQ accordion (16 items), technology tabs, all animations calm; reduced-motion setting stops them
- [ ] Form: empty submit shows errors; bad email/phone/URL; non-PDF and >5 MB CV rejected; consents required; valid submit shows the thank-you message + reference
- [ ] Stop the API: form shows "not reachable" and Submit is disabled (never a fake success)
- [ ] Row appears in `internship_applications`; CV file exists in `UPLOAD_DIR`; emails arrive (set SMTP)
- [ ] `/admin/internships`: login, stats, search, 4 filters, details, CV download, status, interview date, feedback, notes, sign out; logged-out users see only the login form
- [ ] No horizontal scroll at 320 to 2560 px; no console errors; all links work
