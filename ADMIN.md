# Admin Portal & Content API

The public website is unchanged in design and behaviour. What changed is where its
content comes from: services, categories, testimonials, FAQs, trust pillars, business
contact details and section imagery are now stored in MongoDB and edited at `/admin`.

```
Admin portal (/admin)  ->  Express API (/api/admin/*)  ->  MongoDB
                                                             |
Public website (/)     <-  Express API (/api/public/*)  <----+
```

If the API is unreachable or the database has not been seeded, the site automatically
falls back to the bundled French/English copy in `src/i18n`. It can never go blank.

---

## 1. Setup
 
```bash
npm install
cp .env.example .env
```

Fill in `.env`. The required values are:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string. Never hardcoded in source. |
| `ADMIN_EMAIL` | Bootstrap admin account, created on first seed / first API start. |
| `ADMIN_PASSWORD` | Bootstrap admin password. Change it later from `/admin/settings`. |
| `AUTH_SECRET` | Signs the admin session cookie. |

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Optional variables (`PORT`, `SESSION_TTL_DAYS`, `MONGODB_DB_NAME`, `SITE_URL`, the
`CLOUDINARY_*` group) are documented inline in `.env.example`.

`.env` is git-ignored. No secret is ever exposed to the browser.

---

## 2. Seed the database

Imports the six services, three categories, three testimonials, four FAQs, four trust
pillars and the business settings that are currently hardcoded on the site:

```bash
npm run seed
```

Safe to re-run — it only inserts what is missing. To overwrite existing documents with
the bundled defaults:

```bash
npm run seed -- --force
```

---

## 3. Run locally

Two processes, two terminals.

```bash
npm run dev:api
```

```bash
npm run dev
```

- Website: http://localhost:3000
- Admin portal: http://localhost:3000/admin

Vite proxies `/api` to the Express server on `PORT` (default 4000).

### Production

```bash
npm run build
NODE_ENV=production npm start
```

With `NODE_ENV=production` the Express process also serves the built site from `dist/`,
so a single process handles the website, `/admin` and the API.

---

## 4. Admin routes

| Route | What it manages |
| --- | --- |
| `/admin` | Redirects to the dashboard (or the login screen). |
| `/admin/login` | Sign in. |
| `/admin/dashboard` | Content counts, recent services, latest quote requests. |
| `/admin/services` | Service list: search, filter by category/status, paginate. |
| `/admin/services/create` | Create a service. |
| `/admin/services/:id/edit` | Edit a service (bilingual FR/EN). |
| `/admin/categories` | Service categories, i.e. the filter tabs on the website. |
| `/admin/testimonials` | Customer and partner-shop reviews. |
| `/admin/faqs` | Pricing-section questions. |
| `/admin/trust-pillars` | The four value pillars under the hero. |
| `/admin/leads` | Quote requests from the contact form and quote pop-up. |
| `/admin/media` | Image and video library. |
| `/admin/settings` | Business identity, contact details, imagery, password change. |

Public routes are untouched: `/` with its `#home`, `#about`, `#services`, `#pricing`,
`#testimonials` and `#contact` anchors.

---

## 5. API routes

**Public — no authentication**

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/public/content` | All published content in one payload (cached 60s server-side). |
| `POST` | `/api/public/leads` | Submit a quote request (validated, rate-limited). |
| `GET` | `/api/health` | Liveness plus database connection state. |

**Admin — requires a valid session cookie**

| Method | Route |
| --- | --- |
| `POST` | `/api/admin/auth/login`, `/api/admin/auth/logout`, `/api/admin/auth/password` |
| `GET` | `/api/admin/auth/me`, `/api/admin/stats` |
| `GET/POST` | `/api/admin/services`, `/categories`, `/testimonials`, `/faqs`, `/trust-pillars` |
| `GET/PATCH/DELETE` | the same collections with `/:id` |
| `GET/PUT` | `/api/admin/settings` |
| `GET/PATCH/DELETE` | `/api/admin/leads`, `/api/admin/leads/:id` |
| `GET/POST/DELETE` | `/api/admin/media`, `/api/admin/media/upload`, `/api/admin/media/:id` |

Every response uses the same envelope: `{ ok: true, data }` or `{ ok: false, error, fields? }`.

---

## 6. MongoDB collections

| Collection | Contents |
| --- | --- |
| `adminusers` | Admin accounts. Password stored as a scrypt hash, never selected by default. |
| `categories` | Service categories (`key`, bilingual label, order, published). |
| `services` | Services with bilingual title, descriptions, features, symptoms, media, order. |
| `testimonials` | Reviews with bilingual copy, rating, verified/published flags. |
| `faqs` | Bilingual question/answer pairs. |
| `trustpillars` | Bilingual value pillars with icon names. |
| `settings` | Single document: business identity, contact details, social links, imagery. |
| `leads` | Quote requests with status (`new` → `contacted` → `quoted` → `won`/`lost`) and notes. |
| `media` | Image and video library. Videos are a distinct `kind` and never mix with images. |

All collections carry `createdAt` / `updatedAt`. Indexes exist on `slug`, `key`,
`categoryKey`, `published + order`, and `leads.createdAt` / `leads.status`.

---

## 7. Media

The library works with no external service: paste a URL and it is registered.

Direct file upload appears only when Cloudinary is configured
(`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`). Uploads go
through the server — the browser never sees the credentials. Files are capped at 8 MB;
larger assets should be hosted externally and added by URL.

---

## 8. Notes for editors

- Every text field is captured in **French and English**. French is the site default; if
  an English value is left empty the French one is shown, and vice versa.
- Unpublishing a service, testimonial, FAQ, category or pillar hides it from the website
  immediately without deleting it.
- The public payload is cached for 60 seconds server-side, but any admin save clears that
  cache at once. Browsers may hold their own copy for up to 30 seconds.
- Deleting a category does not delete its services — reassign them first, or they will not
  appear under any filter tab.
