# aklein.tech — Full-Stack Personal Portfolio Platform

**Owner:** gnt cnt / aklein.tech  
**Version:** v0.2-final  
**Status:** Final - Source of Truth  
**Last updated:** 2026-09-17

## 1. Purpose

- Dokumen ini adalah source of truth untuk perencanaan, implementasi, dan kelanjutan proyek portfolio full-stack untuk domain aklein.tech.
- Dokumen ini menyatukan ide, scope, arsitektur, keputusan teknis, milestone, dan progress agar pengerjaan bisa dilanjutkan tanpa kehilangan konteks.

## 2. Product Vision

- Membangun personal branding website yang bukan hanya tampilan profil, tetapi sebuah full-stack portfolio platform yang modern, meyakinkan, dan mudah dijelaskan saat interview.
- Public side ditujukan untuk recruiter/visitor, sementara private/admin side dipakai untuk mengelola konten secara rapi dan terstruktur.
- Proyek ini juga harus menunjukkan kualitas engineering: struktur folder rapi, separation of concerns, validasi yang benar, database layer yang jelas, autentikasi, dan deployment production-ready.

## 3. Target Outcome

- Profil profesional yang modern dan meyakinkan.
- Alur data yang jelas dari UI, validasi, server logic, hingga database.
- Contoh project yang kuat untuk dijelaskan saat interview atau presentasi portofolio.
- Codebase yang enak dibaca ulang, dipelajari ulang, dan dikembangkan bertahap.

## 4. Scope

### In scope

- Home / landing page personal branding
- About
- Skills
- Projects
- Experience / Education
- Contact
- Blog / notes (opsional)
- Admin login
- Dashboard CRUD
- Database-driven content
- Contact form
- File upload / media handling
- SEO basics

### Out of scope (initially)

- Mobile app
- Microservices
- Complex analytics platform
- Multi-tenant SaaS
- Real-time collaboration

## 5. Tech Stack

- **Frontend / full-stack framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Auth.js / NextAuth
- **Storage**: Provider storage belum dikunci; akan diputuskan saat implementasi jika memang dibutuhkan
- **Deploy**: Vercel
- **Version control**: Git + GitHub

## 6. Architecture Principles

- Pisahkan UI, server actions, services, repositories, dan schema.
- Gunakan komponen reusable dan typed data flow.
- Validasi input pada boundary dengan Zod.
- Jangan menaruh logic server di client component.
- Buat codebase yang mudah dijelaskan di interview dan mudah di-maintain.

## 7. Proposed Folder Structure

```txt
src/
  app/
    (public)/
    (auth)/
    (dashboard)/
    api/
  components/
    ui/
    layout/
    sections/
    forms/
    shared/
  lib/
    db/
    auth/
    validations/
    utils/
    constants/
  server/
    actions/
    services/
    repositories/
  hooks/
  types/
  styles/
  prisma/
```

## 8. Data Model (initial draft)

- User
- Project
- Post
- Skill
- Experience
- ContactMessage
- Media
- Tag

## 9. Milestone Log

### Phase 0 - Documentation & Planning

**Goal:** Mengunci visi, scope, stack, dan struktur.  
**Status:** Completed

**Completed:**
- Menetapkan proyek sebagai full-stack personal portfolio platform.
- Menentukan arah stack inti.
- Menetapkan kebutuhan SDD + context.md sebagai source of truth.
- Mendefinisikan milestone/progress tracking.

**Next:**
- Finalisasi scope MVP.
- Finalisasi content model dan page list.
- Finalisasi struktur folder awal.

### Phase 1 - Project Bootstrap

**Goal:** Membuat repo dasar dan skeleton yang siap berkembang.  
**Status:** Planned


**Next:**
- Initialize Next.js + TypeScript.
- Install styling dan UI foundation.
- Konfigurasi lint, formatting, dan alias path.
- Siapkan env template.
- Buat base layout dan navigasi.

### Phase 2 - Public Portfolio MVP

**Goal:** Menyelesaikan halaman publik yang layak dipakai untuk recruitment.  
**Status:** Planned


**Next:**
- Hero section.
- About.
- Skills.
- Projects.
- Experience / education.
- Contact section.
- Responsive polish.

### Phase 3 - Database & Content Layer

**Goal:** Memindahkan konten ke entity berbasis database.  
**Status:** Planned


**Next:**
- Buat Prisma schema.
- Jalankan migration.
- Siapkan seed data.
- Baca konten dari DB.
- Refactor komponen agar reusable dan data-driven.

### Phase 4 - Auth & Admin Dashboard

**Goal:** Mengaktifkan pengelolaan konten yang terproteksi.  
**Status:** Planned


**Next:**
- Login.
- Session handling.
- Protected routes.
- Dashboard shell.
- CRUD untuk content.

### Phase 5 - Production Hardening

**Goal:** Menjadikan proyek siap dipublikasikan dan dipercaya.  
**Status:** Planned


**Next:**
- SEO.
- Metadata.
- Sitemap.
- Error handling.
- Security checks.
- Stabilitas file upload.
- Final deploy.

## 10. Decisions Log

| Date | Decision | Reason |
|---|---|---|
| 2026-09-08 | Use Next.js + TypeScript as core stack | Strong market relevance and good for full-stack learning |
| 2026-09-08 | Build as a full-stack portfolio platform, not static-only site | Higher portfolio value and better interview story |
| 2026-09-08 | Maintain SDD + context.md as source of truth | Avoid losing progress and decisions |

## 11. Risks & Notes

- Scope dapat melebar terlalu cepat; jaga MVP tetap kecil dan selesai.
- Jangan over-engineer sebelum public MVP selesai.
- Setiap keputusan besar harus dicatat agar konteks tidak hilang.
- Update dokumen ini setelah setiap milestone atau keputusan teknis penting.

## 12. Update Rule

- Setiap selesai task, update status phase.
- Catat pekerjaan yang selesai.
- Catat next step.
- Catat notes atau blocker bila ada.

## 13. Current Snapshot

- **Current phase**: Phase 0 - Documentation & Planning
- **Current focus**: Mengunci visi, scope, stack, dan struktur dasar.
- **Current blockers**: None
- **Immediate next step**: Finalisasi SDD, context.md, lalu mulai project bootstrap.