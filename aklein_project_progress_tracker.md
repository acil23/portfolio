# aklein.tech — Project Progress Tracker

**Owner:** gnt cnt / aklein.tech  
**Project:** aklein.tech — Full-Stack Personal Portfolio Platform  
**Purpose of this file:**  
This document tracks what has been completed, what is currently in progress, and what comes next. It is intended to stay readable for:
- the developer,
- future AI assistants,
- and anyone who needs to continue the project without losing context.

This file should be updated after every major milestone and after any important technical decision.

---

## 1. Project Summary

`aklein.tech` is planned as a **full-stack personal portfolio platform**, not a static profile page.

The project is designed to:
- present professional personal branding,
- showcase engineering quality,
- provide public pages for visitors and recruiters,
- provide a private admin area for content management,
- show a clear data flow from UI → validation → server logic → database.

The long-term goal is for this project to be strong enough to explain in interviews and to serve as a meaningful portfolio piece.

---

## 2. High-Level Milestones

The project is divided into four major milestones:

### Milestone A — Database & Data Layer
Focus:
- Prisma setup
- Supabase database connection
- schema design
- migrations
- generated client
- seed data foundations
- database access layer
- content model finalization for MVP

Status: **completed for MVP / final draft locked**

### Milestone B — Backend, Auth & Security
Focus:
- admin login flow
- password hashing
- repository and service layers
- session handling
- route protection
- API endpoints
- auth guards

Status: **in progress**

### Milestone C — Frontend & UI
Focus:
- public pages
- dashboard pages
- responsive layout
- reusable UI components
- forms
- UX polish
- content presentation

Status: **not started in depth**

### Milestone D — Deployment & Hardening
Focus:
- environment configuration
- production checks
- SEO
- metadata
- error handling
- security review
- deployment to production

Status: **not started**

---

## 3. More Detailed Milestone Breakdown

### Phase 0 — Documentation & Planning
Goal:
- lock project vision, scope, stack, and structure.

Completed:
- Defined `aklein.tech` as a full-stack personal portfolio platform.
- Chosen stack direction around Next.js, TypeScript, Tailwind/shadcn, Prisma, PostgreSQL, and Auth.js/NextAuth.
- Agreed that the project needs both `SDD` and `context.md` / tracker-style documentation.
- Drafted milestone tracking rules.
- Finalized the MVP scope at a high level.

Next:
- Keep the tracker updated after every major phase.
- Start implementation from the database layer.

Status: **completed**

---

### Phase 1 — Project Bootstrap
Goal:
- create the base repo and production-ready skeleton.

Completed:
- Initialized the Next.js project.
- Set up TypeScript.
- Set up Tailwind CSS.
- Added shadcn/ui foundation.
- Created initial route groups:
  - `(public)`
  - `(auth)`
  - `(dashboard)`
- Created initial layout and placeholder pages.
- Set up core folder structure.
- Added base UI components.
- Initialized Git tracking.
- Created the first project baseline commit locally.

Next:
- Continue refining structure only when needed.
- Avoid expanding frontend implementation too early.
- Keep the project focused on backend/database stability first.

Status: **completed / usable baseline created**

---

### Phase 2 — Database & Content Layer
Goal:
- move content into a structured database model.

Completed:
- Installed `prisma` and `@prisma/client`.
- Ran `prisma init`.
- Created Prisma configuration file from Prisma 7 workflow.
- Connected Prisma to Supabase using `DATABASE_URL`.
- Verified `prisma generate` works.
- Verified `prisma validate` works.
- Created initial `User` model.
- Added core content models:
  - `Project`
  - `Skill`
  - `Experience`
  - `ContactMessage`
  - `Media`
  - `Tag`
  - `ProjectImage`
  - `Post`
  - `Education`
- Added `SiteProfile` for global website content.
- Added many-to-many `Project` ↔ `Tag` relation.
- Migrated schema to Supabase successfully.
- Confirmed tables were created in Supabase.
- Seeded realistic example data for all core tables.
- Confirmed JSON inspect output for `SiteProfile`, `Project`, `Skill`, `Experience`, `Education`, `Post`, `Tag`, `Media`, and `ContactMessage`.
- Created the Prisma client singleton file.
- Set up a basic repository pattern for database access.

Important notes:
- The project uses a Supabase PostgreSQL database.
- Prisma 7 required a driver adapter for the direct Postgres connection.
- The Prisma client is currently configured to use a PostgreSQL adapter via `pg` and `@prisma/adapter-pg`.
- The `User` table was updated to support authentication.
- The database/content layer is now stable enough for MVP use.

Next:
- Keep model changes minimal unless driven by actual UI/backend needs.
- Begin wiring backend auth flow and session logic.

Status: **completed for MVP / final draft locked**

---

### Phase 3 — Backend, Auth & Security
Goal:
- make admin access secure and maintainable.

Completed:
- Updated `User` schema to support:
  - `passwordHash`
  - `role`
- Created `user.repository.ts`.
- Created password hashing helper using Argon2.
- Created auth service for admin login checks.
- Seeded one admin account in Supabase.
- Confirmed the admin seed can be created successfully.
- Learned that password is stored as hash only, not plain text.

Next:
- Create the actual login endpoint / auth route.
- Add session handling.
- Protect dashboard/admin routes.
- Build auth guard middleware or equivalent server-side protection.
- Decide the final login flow architecture before frontend styling.

Status: **in progress**

---

### Phase 4 — Frontend & UI
Goal:
- build the visible experience after the backend foundation is stable.

Planned work:
- public landing page
- about page
- skills page
- projects page
- experience / education page
- contact page
- login page styling
- dashboard shell
- reusable UI sections
- responsive layout
- polished animation and interaction

Status: **not started in depth**

---

### Phase 5 — Deployment & Hardening
Goal:
- prepare the project for production.

Planned work:
- environment audit
- production config review
- SEO and metadata
- sitemap
- error handling
- security review
- deployment setup
- final polish

Status: **not started**

---

## 4. Current Technical State

### Completed foundation
- Next.js project exists.
- TypeScript is active.
- Tailwind and shadcn are set up.
- Git is initialized.
- Prisma is set up and connected.
- Supabase Postgres is connected.
- Prisma schema is migrated.
- A first admin user has been seeded.
- Prisma client singleton is available.
- Repository/service structure has started.

### Current concern
The project has started to move into auth/backend work, but the frontend should remain secondary until:
- login flow is stable,
- session handling is clear,
- route protection is decided,
- and the backend structure is finalized.

### Current focus
Backend authentication flow, public read APIs, and security.

---

## 5. Progress Log

### Completed in order
1. Created the planning / source-of-truth documents.
2. Defined the full-stack portfolio direction.
3. Initialized the Next.js project.
4. Added base UI and folder structure.
5. Installed Prisma and Prisma Client.
6. Initialized Prisma configuration.
7. Created a Supabase project.
8. Connected Prisma to Supabase via `DATABASE_URL`.
9. Verified Prisma generate and validate.
10. Created the first `User` model.
11. Migrated the first table to Supabase.
12. Expanded schema with the portfolio-related models.
13. Added `SiteProfile` and finalized the MVP content model.
14. Added the `Project` ↔ `Tag` many-to-many relation.
15. Seeded realistic example data for all core tables.
16. Migrated the expanded schema to Supabase.
17. Confirmed JSON inspect output for all key tables.
18. Created the Prisma client singleton.
19. Created the first repository file.
20. Added password hashing utilities.
21. Added auth service logic.
22. Updated `User` to support hashed passwords and admin roles.
23. Migrated the `User` auth changes.
24. Seeded the first admin account.
25. Initialized Git tracking.

### Important learning so far
- Prisma 7 needs a driver adapter for direct PostgreSQL usage.
- Supabase direct connection works with the current setup.
- Passwords are stored as hashes only.
- The backend should be built before the frontend gets too far ahead.
- The tracker file should be updated after each major milestone.

---

## 6. Current Snapshot

- **Current major milestone:** Backend, Auth & Security
- **Current sub-focus:** public read APIs and backend architecture after schema finalization
- **Database status:** connected and migrated
- **Admin seed:** created
- **Git status:** initialized
- **Next immediate step:** start Milestone B2 public read APIs

---

## 7. Next Steps

### Next immediate step
Start Milestone B2 — Public Read API:
- define public data access patterns
- create read-only services/repositories for public pages
- prepare API contracts for Home, About, Skills, Projects, and Experience/Education

### After that
- continue to admin write APIs
- then session/protection layers
- keep backend logic separate from UI
- only then continue deeper into frontend implementation

---

## 8. Update Rule

After each major milestone, update this file with:
- what was completed,
- what is now in progress,
- what comes next,
- any important technical blockers or decisions.

If a milestone is finished, mark it clearly as completed and note any follow-up ideas in the next steps section.

---

## 9. Notes for Future Continuation

This file is intentionally written to help:
- the developer understand what has already been done,
- another AI assistant continue the project safely,
- and future debugging sessions avoid repeated setup work.

If the project is reopened in a new chat, this document should be enough to recover the current state quickly.
