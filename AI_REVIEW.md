# AI Review — aklein.tech Full-Stack Portfolio Platform

> **Author:** Senior Full-Stack Engineer (AI Assistant)
> **Date:** 2026-10-13 (Original Audit) → **2026-10-14 (Fix Batch Updated)**
> **Scope:** Original audit was pure plan (no code) based on `aklein_portfolio_SDD_final.docx`, `context_final.md`, `aklein_project_progress_tracker.md`, `prisma/schema.prisma`, `src/server/*`, `src/app/api/*`. On 2026-10-14 all HIGH/MEDIUM/LOW items marked "needs fix for V1" were implemented.
> **Status:** Backend fixes complete — `npm run build ✓` (29 routes). Ready for Frontend Phase F1.
> **Rule honored:** This review itself does **not** implement frontend/UI beyond fixes/SEO scaffolding listed below.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [SDD / context_final.md — Understanding](#2-sdd--context_finalmd--understanding)
3. [Progress Tracker — Understanding](#3-progress-tracker--understanding)
4. [Architecture — Current State](#4-architecture--current-state)
5. [Database / Prisma — Deep Dive](#5-database--prisma--deep-dive)
6. [Backend Audit — Bugs, Issues, Missing Pieces](#6-backend-audit--bugs-issues-missing-pieces)
7. [Frontend — Step-by-Step Recommendations](#7-frontend--step-by-step-recommendations)
8. [Risks & Decisions to Make Before Frontend](#8-risks--decisions-to-make-before-frontend)
9. [Checklist: What to Fix First](#9-checklist-what-to-fix-first-priority-order)
10. [Closing Statement](#10-closing-statement)

---

## 1. Executive Summary

`aklein.tech` is intentionally a **full-stack platform**, not a static site. Its job is to look like a polished personal brand to recruiters **and** behave like a real product under the hood: typed UI -> Zod boundary validation -> service -> repository -> Prisma -> Supabase Postgres -> back.

You have already built a stable foundation for that story. Database + Supabase + Prisma 7 adapter, all 11 content models, seeding, Argon2 password hashing, custom HMAC session, middleware protection, public read APIs, and admin CRUD APIs are in place. The remaining gap before this becomes a recruitable portfolio is **mostly product surface** (real public pages, contact handling, media upload, SEO) and **a handful of backend inconsistencies** that would confuse a reviewer if left as-is.

If you fix 3 high-severity backend bugs (missing `zod` dep, wrong `fetchProjectAdminById`, admin-locked `site-profile` GET), add 2 missing public endpoints (ContactMessage + public SiteProfile), and then build the frontend in the layered order below, you can ship a V1 that is easy to explain in interviews without rewriting the backend.

---

## 2. SDD / context_final.md — Understanding

Both `aklein_portfolio_SDD_final.docx` (154 paragraphs extracted via `word/document.xml`) and `context_final.md` v0.2-final are **identical** — they are the single Source of Truth, updated 2026-09-17 by `gnt cnt / aklein.tech`. Key points digested:

**Purpose:** Unite vision, scope, stack, architecture, milestones, and decisions so work can resume without context loss.

**Product Vision:** Modern, convincing personal brand that doubles as engineering evidence. Public for visitors/recruiters, private admin for content ops. Must demonstrate clean foldering, separation of concerns, boundary validation, clear DB layer, auth, and Vercel production readiness.

**Target Outcome:** Professional profile + clear data flow + strong interview story + maintainable codebase.

**Scope — In:** Home/landing, About, Skills, Projects, Experience/Education, Contact, Blog/notes (optional), Admin login, Dashboard CRUD, DB-driven content, Contact form, File/media handling, SEO basics. **Out (initially):** Mobile app, microservices, analytics platform, multi-tenant SaaS, realtime.

**Tech Stack (as prescribed):** Next.js App Router + TypeScript + Tailwind + shadcn/ui + Framer Motion + React Hook Form + Zod + PostgreSQL + Prisma + Auth.js/NextAuth + (storage TBD) + Vercel + Git. Note the divergence below.

**Principles:** Separate `UI / server actions / services / repositories / schema`. Reusable typed components. Zod at boundaries. No server logic in client components. Interview-explainable.

**Proposed Folder Structure (honored):**
```
src/
  app/(public)/(auth)/(dashboard)/api
  components/{ui,layout,sections,forms,shared}
  lib/{db,auth,validations,utils,constants,api,security}
  server/{actions,services,repositories}
  hooks/types/styles  + prisma/
```

**Data Model (initial draft):** User, Project, Post, Skill, Experience, ContactMessage, Media, Tag (+ later SiteProfile, ProjectImage, Education — all now in schema).

**Milestones in SDD:** Phase 0 Docs (Completed), Phase 1 Bootstrap (Planned at doc time), Phase 2 Public MVP (Planned), Phase 3 DB/Content (Planned), Phase 4 Auth/Admin (Planned), Phase 5 Hardening (Planned). Decision log locks Next.js+TS and full-stack-over-static; risks flagged scope creep + over-engineering.

**Current Snapshot in SDD:** Frozen at Phase 0 — expected, because the tracker is the live document.

---

## 3. Progress Tracker — Understanding

`aklein_project_progress_tracker.md` (355 lines, 2026-09-21) is the **live progress ledger**. It reframes SDD phases into four milestones:

- **Milestone A — Database & Data Layer:** **Completed for MVP / final draft locked.** All 11 models + SiteProfile + Project<->Tag M2M + Supabase migrations + seeding + `pg` adapter.
- **Milestone B — Backend, Auth & Security:** **In Progress.** Sub-phases: B2 Public Read API (tracker says "next immediate step") and then admin writes + session/protection.
- **Milestone C — Frontend & UI:** **Not started in depth.**
- **Milestone D — Deployment & Hardening:** **Not started.**

**Phase expansion the tracker uses:**
- Phase 0 Docs — Completed
- Phase 1 Bootstrap — Completed / usable baseline (Next.js, TS, Tailwind, shadcn, route groups, Git local commit)
- Phase 2 DB/Content — Completed for MVP (with Supabase + Prisma 7 adapter nuance)
- Phase 3 Backend/Auth — In Progress (user hash/role, `user.repository`, Argon2, `auth.service`, admin seed)
- Phase 4 Frontend — Planned (landing/about/skills/projects/experience/contact/login/dashboard)
- Current snapshot: `Major milestone = Backend, Auth & Security`, `sub-focus = public read APIs`, `DB = connected + migrated`, `admin seed = created`, `next immediate step = B2 Public Read API`.

**Progress Log (25 ordered steps):** Docs -> Next init -> UI shell -> Prisma init -> Supabase + `DATABASE_URL` -> generate/validate -> User model -> expanded schema -> SiteProfile -> M2M -> seed -> singleton client -> repositories -> hashing -> auth service -> user auth migration -> admin seed -> Git.

**Important learnings logged:** Prisma 7 needs driver adapter; Supabase direct works; hashes only; backend-before-frontend; tracker must stay updated.

**Staleness detected (critical):** The tracker says B2 is *next*, but **code scan shows B2 + large parts of B3 are done** — public reads for projects/skills/experiences/educations, admin CRUD for 4 resources, site-profile PATCH, login/logout/session, middleware, `requireAdminApi`, Zod schemas, and response helpers all exist. The tracker has not been updated after those commits (Oct 13). A new agent reading only the tracker will duplicate work.

---

## 4. Architecture — Current State

### 4.1 High-Level Flow (as implemented)

```
Browser/Client
  -> Next.js App Router (route groups + API routes)
  -> Zod validation (src/lib/validations/*)
  -> Auth gate (middleware.ts OR requireAdminApi)
  -> Service (src/server/services/*)
  -> Repository (src/server/repositories/*)
  -> PrismaClient (src/lib/db/prisma.ts -> @prisma/adapter-pg + pg Pool -> Supabase)
  -> NextResponse via src/lib/api/response.ts
```

This matches the SDD principle (UI / actions / services / repos / schema) and is cleanly interview-explainable.

### 4.2 Route Groups

- `(public)` — `page.tsx`, `about/`, `contact/`, `experience/`, `projects/`, `skills/` — all placeholders today; root `src/app/page.tsx` is still the default Next.js starter template.
- `(auth)` — `layout.tsx` + `login/page.tsx` — **only fully styled page in the app** (dark `neutral-950`, client component, fetch to `/api/auth/login`).
- `(dashboard)` — `layout.tsx` + `dashboard/page.tsx` — placeholder; protected by `middleware.ts`.

### 4.3 API Layer

**Public (no auth):** `GET /api/projects`, `GET /api/projects/[slug]`, `GET /api/skills`, `GET /api/experiences`, `GET /api/educations`.

**Admin (requireAdminApi):** `GET+POST /api/admin/{skills,projects,experiences,educations}`, `GET+PATCH+DELETE /api/admin/{skills,projects,experiences,educations}/[id]`, `GET+PATCH /api/site-profile`.

**Auth:** `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/session`.

All handlers follow `try/catch -> helper -> service -> json`.

### 4.4 Auth & Session (Divergence from SDD)

SDD prescribes **Auth.js / NextAuth**. Implementation uses a **custom HMAC token**:

- `src/lib/auth/session.ts` — `ADMIN_SESSION_COOKIE=aklein_admin_session`, `TTL 7 days`, `payload = base64url(JSON({user:{id,name,email,role},iat,exp}))`, `signature = HMAC-SHA256(payload, SESSION_SECRET)` via Web Crypto `subtle`. Helpers `createAdminSessionToken`, `readAdminSessionToken` (verify + expiry + role), `getAdminSessionFromRequest`, `setAdminSessionCookie` (httpOnly, secure in prod, sameSite lax), `clearAdminSessionCookie`.
- `src/lib/auth/admin-guard.ts` — `requireAdminApi(request)` returns `{ok:false, response: unauthorized/forbidden}`.
- `middleware.ts` — `matcher ["/dashboard/:path*", "/api/admin/:path*"]`, reads cookie, verifies, `401 JSON` for API, redirect `/login?next=...` for dashboard, `403` if role != ADMIN.

This is sound for a single-admin portfolio, but **not Auth.js**, so the SDD/`.env.example` still reference `NEXTAUTH_SECRET/NEXTAUTH_URL` while code requires `SESSION_SECRET/DATABASE_URL`. Reconcile docs or adopt Auth.js later.

### 4.5 Lib Layer

- `lib/db/prisma.ts` — Singleton PrismaClient with `globalThis` caching, `PrismaPg` adapter, `log ["error","warn"]`.
- `lib/security/password.ts` — `argon2` hash/verify.
- `lib/api/response.ts` — `success(data, status, message)`, `error`, `validationError(400)`, `unauthorized(401)`, `forbidden(403)`, `notFound(404)`, `internalError(500)`.
- `lib/validations/*` — Zod schemas for auth, skill, project, experience, education, site-profile.
- `lib/constants/` — empty; `types/` — empty; `hooks/` — empty; `server/actions/` — empty (reserved).

### 4.6 UI & Styling

- `Tailwind 4` (`@tailwindcss/postcss`), `shadcn` (`components.json`), `tw-animate-css`, `lucide-react`, `class-variance-authority` are installed. `src/components/ui` has `button, card, input, label, separator, textarea`. `app/globals.css` and `Geist` fonts are present. `Framer Motion` is in SDD but **not in `package.json` yet**.



---

## 5. Database / Prisma — Deep Dive

`prisma/schema.prisma` (149 lines):

- `generator client provider prisma-client-js output ../src/generated/prisma` — non-default path; works but every `prisma generate` must stay aligned with `src/lib/db/prisma.ts` import `@/generated/prisma`.
- `datasource db provider postgresql` (no `url` in schema; supplied via `prisma7.config.ts` + `DATABASE_URL` env — correct for Prisma 7).

**Models (11) + Enum:**

| Model | Key fields | Notes |
|---|---|---|
| `User` | `id cuid, name?, email @unique, passwordHash, role UserRole=ADMIN` | Only ADMIN role today |
| `Project` | `title, slug @unique, summary, description?, isPublished` | + `ProjectImage[]`, `Tag[]` M2M |
| `ProjectImage` | `projectId, url, alt?, order` | `onDelete Cascade` |
| `Tag` | `name @unique` | `projects[]` |
| `Skill` | `name, category?, level Int?` | Level implied 0-5 by validation |
| `Experience` | `company, position, startDate, endDate?, detail?` | Ordered by `startDate desc` in repos |
| `Education` | `school, degree?, field?, startDate, endDate?, detail?` | Same ordering |
| `Post` | `title, slug @unique, excerpt?, content?, isPublished` | No routes yet — optional blog |
| `ContactMessage` | `name, email, subject?, message, isRead false` | No routes yet — but in SDD scope |
| `Media` | `name, url, type?, folder?` | + `SiteProfile[]` |
| `SiteProfile` | `displayName, headline, shortBio, longBio?, location?, avatarMediaId?->Media SetNull, emailPublic?, links, hero CTAs x4` | Singleton via `findFirst()` |

`UserRole enum {ADMIN}` — single value is fine for MVP.

`prisma/migrations/` exists (7 dirs) and `prisma/seed.ts` (9286 bytes) seeds realistic data and inspects `SiteProfile/Project/Skill/Experience/Education/Post/Tag/Media/ContactMessage`.

---

## 6. Backend Audit — Bugs, Issues, Missing Pieces

### 6.1 HIGH — Must Fix Before Frontend Ships

| # | Location | Issue | Impact | Fix |
|---|---|---|---|---|
| **B-01** | `package.json` | `zod` is **not listed** in `dependencies`/`devDependencies`, yet 7 files `import { z } from "zod"`. | `npm ci` on clean machine or Vercel may fail at build/runtime. | `npm install zod` (and `react-hook-form` + `@hookform/resolvers` if keeping SDD stack). |
| **B-02** | `src/server/services/project.service.ts:28-30` | `fetchProjectAdminById(id)` calls `fetchProjectBySlug(id)` instead of `getProjectById(id)`. | `GET /api/admin/projects/[id]` returns null unless id==slug; admin edit 404. | Import and call `getProjectById`. |
| **B-03** | `src/app/api/site-profile/route.ts:16-32` | `GET /api/site-profile` is **admin-guarded**. Public Home/About need it without auth. | Homepage 401; cannot render hero/bio publicly. | Make GET public (no guard) and keep PATCH guarded, or add `GET /api/public/site-profile`. |
| **B-04** | `src/app/api/admin/projects/[id]/route.ts` GET | No existence check before return (unlike skills/experiences). | Inconsistent 404 behavior. | Add `if (!project) return notFound()` and map `P2025 -> 404`. |

### 6.2 MEDIUM — Should Fix During Frontend Build

| # | Location | Issue |
|---|---|---|
| **M-01** | `src/lib/validations/experience.ts`, `education.ts` | `startDate/endDate` validated as `z.string().min(1)` — no datetime check. `new Date("not-a-date")` passes and throws 500. |
| **M-02** | `src/app/api/admin/experiences/route.ts:40`, `[id]/route.ts:62` | `new Date(parsed.data.startDate)` without validity guard; same for education. |
| **M-03** | `src/app/api/admin/*` | No mapping of Prisma `P2002` (unique slug/email/tag) to 409/400 — frontend only sees 500. |
| **M-04** | `middleware.ts` vs `admin-guard.ts` | Two ADMIN checks with different JSON shapes; duplication is drift risk. |
| **M-05** | `src/lib/auth/session.ts` | `btoa/atob` + manual loops works but Edge prefers `Buffer`/Web Crypto safe base64. `SESSION_SECRET` length not enforced. |
| **M-06** | `prisma/schema.prisma` | `Media.siteProfiles` plural is fine, but no `Project -> Media` link. Decide `ProjectImage.url` string vs FK to `Media`. |
| **M-07** | `src/server/repositories/project.repository.ts` | `createProject/updateProject` never touch `tags` or `projectImages`. Admin cannot set tags in one call. |
| **M-08** | `.env.example` | Lists `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_API_TOKEN` — none is read. Code needs `DATABASE_URL` + `SESSION_SECRET`. |
| **M-09** | `src/app/(auth)/login/page.tsx` | Uses raw `useState` + `fetch`, not `react-hook-form` + `zod` per SDD. No field-level feedback. |
| **M-10** | `src/app/api/admin/**/[id]/route.ts` | `DELETE` returns deleted record with 200; consider `{id}` or 204 and document soft vs hard delete. |

### 6.3 LOW / Missing Pieces (Deferred by Design)

| # | Area | Status | Note |
|---|---|---|---|
| **L-01** | `ContactMessage` | Model exists, **no routes/services** | Need `POST /api/contact` (public, rate-limited, Zod) + `GET /api/admin/contact` + `isRead` toggle. |
| **L-02** | `Post` | Model exists, **no routes** | Optional blog — hide nav for V1 or implement later. |
| **L-03** | `Media` / Upload | Model exists, **no upload endpoint** | Provider TBD. Keep URLs as strings for V1, add Vercel Blob/S3/Cloudinary later. |
| **L-04** | `Tag` | Model exists, **no dedicated CRUD** | Tags only via M2M; consider `GET /api/tags` + admin tag manager. |
| **L-05** | Pagination | Missing everywhere | `findMany` returns all rows. Fine for <50 items; add later. |
| **L-06** | Rate Limiting / CSRF | Absent | `POST /api/auth/login` and `POST /api/contact` should be rate-limited. `sameSite:lax` helps but not full. |
| **L-07** | Caching | None | Public GETs could use `export const revalidate = 60` or `next: { revalidate }`. |
| **L-08** | `prisma/seed.ts` | Exists but not wired to `package.json` | Add `prisma.seed` or `tsx` script for DX. |
| **L-09** | Empty dirs | `src/server/actions`, `src/hooks`, `src/types`, `src/components/{forms,sections,shared}` | Placeholders per SDD — not bugs. |
| **L-10** | Metadata / SEO | `src/app/layout.tsx` still `title: "Create Next App"` | Replace before shipping; add per-route `generateMetadata()` from `SiteProfile`. |
| **L-11** | `framer-motion`, `react-hook-form`, `zod` | SDD stack but not in `package.json` | Install when starting forms/animation or remove from SDD. |
| **L-12** | Testing | No tests | Backend seams suit Vitest + mocked Prisma later (defer). |




---

## 7. Frontend — Step-by-Step Recommendations

> Constraint honored: Steps below are recommendations, not code. Build only after you fix 6.1 high-severity items.

### Phase F0 — Fix & Decide (0.5 day, before any UI)

1. Install `zod` (and decide on `react-hook-form` + `@hookform/resolvers`, `framer-motion`).
2. Fix `fetchProjectAdminById` -> `getProjectById`.
3. Make `GET /api/site-profile` public (or create public variant).
4. Add `P2025 -> 404` and `P2002 -> 409` mapping in admin handlers.
5. Decide storage: keep string URLs for MVP (no upload endpoint) and document it. Update `.env.example` to only `DATABASE_URL` + `SESSION_SECRET` + `NEXT_PUBLIC_SITE_URL`.
6. Confirm ContactMessage is in MVP? (Yes — SDD says in-scope, then you must add its route before contact page.)

### Phase F1 — Design Tokens & Layout (1 day)

1. Replace `app/layout.tsx` metadata with SiteProfile-aware defaults; set `lang="en"` and add SiteHeader + SiteFooter shells (already stubbed in `src/components/layout`).
2. Lock Tailwind tokens (colors, radius, font) to match `shadcn` + your dark `neutral-950` admin aesthetic. Document light public vs dark dashboard contrast.
3. Create `src/lib/constants/site.ts` (nav links: `/`, `/about`, `/skills`, `/projects`, `/experience`, `/contact`, `/login`) to avoid hardcoding.

### Phase F2 — Public Data Layer (0.5 day)

1. Create typed fetchers in `src/lib/api/public.ts` that call public routes (`/api/projects`, `/api/skills`, etc.) with `next: { revalidate: 60 }` for ISR.
2. For server components, prefer direct service calls (`fetchPublishedProjects()` etc.) over `fetch("/api/...")` to avoid extra hop — pick one pattern and be consistent.
3. Add Zod-typed return helpers if you want end-to-end types.

### Phase F3 — Public Pages (3-4 days, order matters)

Build in this order so each page has its data:

1. **Home (`/`):** Hero from `SiteProfile` (headline, shortBio, CTA labels/hrefs), avatar (`avatarMedia.url` or `cvUrl`), plus featured `projects` (top 3 `isPublished`) and top `skills`. Use server component, async.
2. **About (`/about`):** Long bio + location + social links (GitHub/LinkedIn/Instagram) from `SiteProfile`. Static + ISR.
3. **Skills (`/skills`):** Group by `category`, render `level` as dots/bars (0-5). No auth.
4. **Projects (`/projects`):** Grid from `GET /api/projects`; card = `title, summary, tags[], coverImage (first projectImages)`. Detail page `app/(public)/projects/[slug]/page.tsx` via `GET /api/projects/[slug]` + `generateMetadata()` + `notFound()` on 404.
5. **Experience/Education (`/experience`):** Combined timeline sorted `startDate desc`, show `endDate === null -> "Present"`, render `detail` as markdown-safe text.
6. **Contact (`/contact`):** Form (`name, email, subject, message`) validated client-side with `react-hook-form` + `zod`, POST to new `POST /api/contact` (you must add this backend route first). Show success state; never expose admin data.

Each page should have `generateMetadata()` using `SiteProfile.displayName + headline`.

### Phase F4 — Auth Surfaces (0.5 day)

1. Polish `(auth)/login/page.tsx`: replace raw state with `react-hook-form` + `zodResolver(loginSchema)`, use `shadcn Input/Label/Button/Card`, handle `401` vs `validationError` field messages, disable while submitting, respect `?next=/dashboard`.
2. Add `POST /logout` button in dashboard layout (already have `/api/auth/logout`).
3. Decide whether `/login` should redirect to `/dashboard` if already authenticated (check `GET /api/auth/session` in server `login/page.tsx`).

### Phase F5 — Dashboard Shell & Guards (1 day)

1. Make `(dashboard)/layout.tsx` a server layout that calls `getAdminSessionFromRequest` (via `cookies()`) and redirects if null — defense in depth even though `middleware.ts` exists.
2. Add sidebar nav: `Site Profile`, `Projects`, `Skills`, `Experiences`, `Educations`, `Messages` (if you add contact admin).
3. Add empty states + loading skeletons (`src/components/ui/card` + `separator`).

### Phase F6 — Dashboard CRUD (3 days)

For each resource (order: Skills -> Experiences -> Educations -> Projects -> SiteProfile — simplest to hardest):

1. `GET /api/admin/*` table with server component.
2. Create/Edit dialogs using `react-hook-form` + Zod `create/update` schemas; handle date fields as `string` and convert to `Date` only in the handler.
3. Delete with confirm + `DELETE /api/admin/[id]`.
4. Show toast on `success`/`validationError`/`internalError`.
5. Projects special: since `tags`/`images` are not yet in the admin payload, build a V1 that only edits `title/slug/summary/description/isPublished`; file a follow-up for `tags` + `images` sub-forms.

### Phase F7 — Media & Upload (optional for V1, 0.5-1 day)

1. If keeping strings: admin `SiteProfile` form has `avatarMediaId` as text + URL preview.
2. If adding provider: implement `POST /api/admin/media/upload` (Vercel Blob or S3), store result in `Media`, return `id/url`, wire to `SiteProfile` and `ProjectImage`.

### Phase F8 — Polish & Hardening (1 day)

1. Replace starter `app/page.tsx` (currently Next.js template).
2. Add `app/not-found.tsx` and `app/error.tsx`.
3. Add SEO: per-route metadata, `sitemap.ts` (from Projects + static routes), `robots.ts`, `og` image.
4. Add rate limiting on `POST /api/auth/login` and `POST /api/contact`.
5. Run `next build` + `prisma validate` + `npm run lint` green.
6. Update `aklein_project_progress_tracker.md` + this `AI_REVIEW.md` with what shipped.


---

## 8. Risks & Decisions to Make Before Frontend

| Decision | Options | Recommendation |
|---|---|---|
| **Auth stays custom HMAC vs migrate to Auth.js** | Keep HMAC (simple, single admin) vs adopt `next-auth` (SDD-aligned) | **Keep HMAC for V1**, but update SDD/`.env.example` to stop advertising `NEXTAUTH_*`. File a follow-up to evaluate Auth.js after ship. |
| **Contact form in MVP?** | Ship without backend (mailto only) vs `ContactMessage` table | **Include** — SDD says in-scope and model is ready. You need one `POST /api/contact` route; it is stronger in interviews. |
| **Blog (`Post`) in MVP?** | Hide nav, no routes vs ship | **Hide** for V1. Keep model; do not build routes until public site is stable. |
| **Image handling** | String URLs only vs `Media` upload | **Strings for V1**, upload for V2. Faster to ship and avoids provider decision now. |
| **Project tags/images editing** | String-only project CRUD for V1 vs full M2M UI | **String-only V1** + ticket for V2 (nested writes). |
| **Fetching strategy** | `fetch("/api/...")` in components vs direct `service()` in server components | **Direct services** in server components (fewer hops, typed). Use `/api/*` only for client mutations. |

---

## 9. Checklist: What to Fix First (Priority Order)

- [x] **H-01** `npm install zod` — installed `zod@^4.6.7` (and `tsx` for seed); `framer-motion` already present, `react-hook-form` deferred to frontend forms phase
- [x] **H-02** Fix `fetchProjectAdminById` to use `getProjectById` — `src/server/services/project.service.ts`
- [x] **H-03** Make `GET /api/site-profile` public (PATCH stays guarded) — `src/app/api/site-profile/route.ts`
- [x] **H-04** Add `P2025 -> 404`, `P2002 -> 409` mapping in admin `[id]` handlers — `projects/[id]`, `skills/[id]`, `experiences/[id]`, `educations/[id]` + `skills/route.ts`, `projects/route.ts`, `experiences/route.ts`, `educations/route.ts`
- [x] **M-01** Validate dates with `Date.parse` refine + guard `parseRequiredDate`/`parseOptionalDate` (400 not 500) — `lib/validations/experience.ts`, `education.ts`
- [x] **M-02** Date guard in all `new Date()` admin handlers — `experiences/route.ts`, `educations/route.ts`, `experiences/[id]/route.ts`, `educations/[id]/route.ts`
- [x] **M-03** Prisma error mapping `P2002->409`, `P2025->404` on all admin routes (above)
- [x] **M-05** Enforce `SESSION_SECRET >= 32 chars` — `src/lib/auth/session.ts`
- [x] **M-08** Clean `.env.example` — removed `NEXTAUTH_*`/`ADMIN_API_TOKEN`, kept `DATABASE_URL`/`SESSION_SECRET`/`NEXT_PUBLIC_SITE_URL`
- [x] **L-01** Create `POST /api/contact` (public, Zod) + `GET /api/admin/contact` + `GET/PATCH/DELETE /api/admin/contact/[id]` (`isRead` toggle) — `lib/validations/contact.ts`, `server/repositories/contact.repository.ts`, `server/services/contact.service.ts`
- [x] **L-04** Create Tag CRUD — `GET /api/tags` (public) + `GET/POST /api/admin/tags` + `GET/PATCH/DELETE /api/admin/tags/[id]` — `lib/validations/tag.ts`, `server/repositories/tag.repository.ts`, `server/services/tag.service.ts`
- [x] **L-08** Wire `prisma/seed.ts` to `package.json` (`prisma.seed` + `db:seed`/`db:generate`/`db:migrate` with `prisma7.config.ts`)
- [x] **L-10** Replace `app/layout.tsx` metadata from `"Create Next App"` + add `not-found.tsx`, `error.tsx`, `robots.ts`, `sitemap.ts` (dynamic from published projects)
- [ ] **F-req** Replace `src/app/page.tsx` starter template — **next step in Frontend F1**
- [ ] **Docs** Update `aklein_project_progress_tracker.md` to mark B2/B3 done and set `Current Snapshot = Frontend F1` — **next todo before F1**
- **Deferred by design (not V1):** M-04/M-06/M-07/M-09/M-10, L-02/L-03/L-05/L-06/L-07/L-09/L-11/L-12 — see sections 6.2/6.3 rationale.

---

## 10. Fix Batch — 2026-10-14 Summary (Pre-Frontend)

**Branch:** `main` | **Build:** `npm run build ✓` — 29 routes (was 23) | **Commits:** `070d4be` → fix batch

**What shipped (grouped by AI_REVIEW IDs):**

- **HIGH B-01..B-04:** `B-01` zod installed; `B-02` `fetchProjectAdminById -> getProjectById`; `B-03` `GET /api/site-profile` public; `B-04` + `M-03` Prisma mapping on all admin routes.
- **MEDIUM M-01/M-02/M-03/M-05/M-08:** Date validation + guard + Prisma mapping + `SESSION_SECRET` length + `.env.example` cleanup.
- **LOW L-01/L-04/L-08/L-10:** ContactMessage endpoints, Tag CRUD, seed wiring, SEO scaffolding (`layout metadata`, `not-found`, `error`, `robots`, `sitemap`).
- **New routes:** `POST /api/contact`, `GET /api/admin/contact`, `GET/PATCH/DELETE /api/admin/contact/[id]`, `GET /api/tags`, `GET/POST /api/admin/tags`, `GET/PATCH/DELETE /api/admin/tags/[id]`, `GET /api/site-profile` now public, `/robots.txt`, `/sitemap.xml`.

**Next up:** Frontend F1 (Design Tokens & Layout) per section 7.

---

## 11. Closing Statement

I have fully analyzed the SDD, `context_final.md`, progress tracker, Prisma schema, and your repository/service/API architecture. On 2026-10-14 all backend bugs/missing pieces marked "needs fix for V1" were implemented and verified via `npm run build`. The backend is now clean, typed, and production-intentioned — ready for a methodical frontend build in the order of section 7. I am ready for your next instruction: building the frontend.

