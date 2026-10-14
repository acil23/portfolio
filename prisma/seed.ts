// prisma/seed.ts — REAL DATA (Jupri Naldi)
// Source: CV_Jupri_Naldi_ATS_Updated_2026 + BIMBEL_YS_Portfolio_Case_Study.docx
import "dotenv/config";
import { UserRole } from "../src/generated/prisma";
import { prisma } from "../src/lib/db/prisma";
import { hashPassword } from "../src/lib/security/password";

async function main() {
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.siteProfile.deleteMany();
  await prisma.media.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hashPassword("portAdm#key99");
  const admin = await prisma.user.create({
    data: { name: "Jupri Naldi", email: "juprinaldi023@gmail.com", passwordHash, role: UserRole.ADMIN },
  });

  const siteProfile = await prisma.siteProfile.create({
    data: {
      displayName: "Jupri Naldi",
      headline: "Full-Stack Web Developer \u00b7 Next.js \u00b7 TypeScript \u00b7 PostgreSQL",
      shortBio: "Lulusan Teknik Informatika Universitas Brawijaya (IPK 3.52) \u2014 membangun aplikasi full-stack production-oriented. Fokus pada Next.js, TypeScript, PostgreSQL/Prisma, dan deployment yang terukur.",
      longBio: "Saya Jupri Naldi, Full-Stack Web Developer berbasis di Malang, Indonesia. Saya mengembangkan Bimbel YS \u2014 platform company profile & CMS production untuk bisnis bimbingan belajar di Dharmasraya \u2014 end-to-end dari requirement, pemodelan data relasional (PostgreSQL + Prisma), REST-style API dengan validasi Zod, autentikasi Argon2id & opaque database sessions, integrasi Azure Blob Storage yang dikontrol server, hingga SEO teknis/lokal dan deployment. Saya juga membangun sistem penjadwalan akademik dengan Memetic Algorithm (FastAPI + Next.js) dan mengelola infrastruktur self-hosted dengan Ubuntu, Docker, Nginx, WireGuard & Cloudflare Tunnels. Pendidikan: S.Kom Teknik Informatika Universitas Brawijaya, Yudisium 24 Juli 2026 (IPK 3.52).",
      location: "Malang, Indonesia",
      emailPublic: "juprinaldi023@gmail.com",
      whatsappNumber: "628993034849",
      githubUrl: "https://github.com/juprinaldi023",
      linkedinUrl: "https://linkedin.com/in/juprinaldi",
      instagramUrl: null,
      cvUrl: null,
      heroCtaPrimaryLabel: "Lihat Project",
      heroCtaPrimaryHref: "/projects",
      heroCtaSecondaryLabel: "Hubungi Saya",
      heroCtaSecondaryHref: "/contact",
    },
  });

  await prisma.skill.createMany({
    data: [
      { name: "JavaScript", category: "Programming", level: 4 },
      { name: "TypeScript", category: "Programming", level: 4 },
      { name: "SQL", category: "Programming", level: 4 },
      { name: "Python", category: "Programming", level: 3 },
      { name: "React", category: "Frontend", level: 4 },
      { name: "Next.js", category: "Frontend", level: 4 },
      { name: "Tailwind CSS", category: "Frontend", level: 4 },
      { name: "Node.js", category: "Backend & API", level: 4 },
      { name: "REST API", category: "Backend & API", level: 4 },
      { name: "Zod", category: "Backend & API", level: 4 },
      { name: "FastAPI", category: "Backend & API", level: 3 },
      { name: "PostgreSQL", category: "Database", level: 4 },
      { name: "Prisma ORM", category: "Database", level: 4 },
      { name: "Oracle SQL", category: "Database", level: 3 },
      { name: "Azure Blob Storage", category: "Cloud & Server", level: 3 },
      { name: "Docker", category: "Cloud & Server", level: 3 },
      { name: "Nginx", category: "Cloud & Server", level: 3 },
      { name: "Linux (Ubuntu & Arch)", category: "Cloud & Server", level: 3 },
      { name: "Cloudflare Tunnels", category: "Cloud & Server", level: 3 },
      { name: "WireGuard", category: "Cloud & Server", level: 3 },
      { name: "Vitest", category: "Testing & Tools", level: 3 },
      { name: "Playwright", category: "Testing & Tools", level: 3 },
      { name: "Git & GitHub", category: "Testing & Tools", level: 4 },
      { name: "Technical SEO", category: "Web & SEO", level: 3 },
      { name: "Local SEO", category: "Web & SEO", level: 3 },
    ],
  });

  const tagNames = ["Next.js","React","TypeScript","Tailwind CSS","PostgreSQL","Prisma","Zod","Vitest","Playwright","Azure Blob Storage","Python","FastAPI","Docker","Nginx"];
  const tags = await Promise.all(tagNames.map((name) => prisma.tag.create({ data: { name } })));
  const tagMap = Object.fromEntries(tags.map((t) => [t.name, t]));

  const bimbel = await prisma.project.create({
    data: {
      title: "Bimbel YS \u2014 Full-Stack Web Application & CMS",
      slug: "bimbel-ys",
      summary: "Company profile & CMS production untuk bimbingan belajar di Dharmasraya (5 programs, 17 packages, 2 locations, 11 DB tables). Live di bimbelys.me.",
      description: "Bimbel YS adalah full-stack web application production yang menggabungkan public website dengan authenticated CMS untuk bisnis bimbingan belajar nyata di Dharmasraya.\\n\\nPeran: Full-Stack Web Developer end-to-end \u2014 Level 1 production scope yang sengaja dibatasi agar berguna hari ini tanpa memaksa kompleksitas learning-platform, multi-tenant, atau AI.\\n\\nPublic website: program, paket harga, profil tutor, prestasi siswa, profil perusahaan, lokasi & CTA kontak langsung. Admin CMS: manajemen terotentikasi untuk program, package, tutor (+ education/experience), achievement, company & contact.\\n\\nArsitektur: Modular monolith Next.js 16 + React 19 + TypeScript + Tailwind CSS 4, backend Route -> Service -> Repository -> Prisma 7.10 -> PostgreSQL 18.6, validasi Zod, pengujian Vitest & Playwright, upload server-controlled ke Azure Blob Storage (JPEG/PNG/WebP, max 5MB), keamanan Argon2id + opaque database sessions + HttpOnly/Secure/SameSite cookies + ADMIN authorization + rate limiting + same-origin mutation protection, serta SEO teknis/terstruktur + local SEO + Google Business Profile & Search Console (44 URL tersubmits).\\n\\nLive: https://bimbelys.me",
      isPublished: true,
    },
  });

  const jadwal = await prisma.project.create({
    data: {
      title: "Sistem Penjadwalan Mata Kuliah Berbasis Algoritma Memetika",
      slug: "penjadwalan-memetika",
      summary: "Sistem penjadwalan akademik untuk menyeimbangkan beban kerja dosen dengan optimasi Memetic Algorithm (GA + First-Improvement Hill Climbing).",
      description: "Academic Project \u2014 sistem penjadwalan akademik yang menyeimbangkan beban kerja dosen menggunakan Memetic Algorithm (kombinasi Genetic Algorithm dan First-Improvement Hill Climbing). Backend FastAPI (Python) dan frontend Next.js. Fokus pada pemodelan constraint, representasi kromosom, operator crossover/mutasi, dan evaluasi fitness.",
      isPublished: true,
    },
  });

  const infra = await prisma.project.create({
    data: {
      title: "Self-Hosted Server & Web Deployment",
      slug: "self-hosted-server",
      summary: "Infrastruktur self-hosted Ubuntu + Docker + Nginx + WireGuard + Cloudflare Tunnels dengan custom domain untuk deployment aman.",
      description: "Personal Infrastructure Project \u2014 mengelola lingkungan server mandiri self-hosted berbasis Ubuntu Linux, containerization Docker, reverse proxy Nginx, serta jaringan & deployment aman menggunakan WireGuard dan Cloudflare Tunnels (custom domain).",
      isPublished: true,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      { projectId: bimbel.id, url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80", alt: "Bimbel YS \u2014 hero", order: 0 },
      { projectId: bimbel.id, url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80", alt: "Bimbel YS \u2014 CMS", order: 1 },
      { projectId: jadwal.id, url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80", alt: "Penjadwalan memetika", order: 0 },
      { projectId: infra.id, url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80", alt: "Self-hosted infra", order: 0 },
    ],
  });

  await prisma.project.update({ where: { id: bimbel.id }, data: { tags: { connect: [{ id: tagMap["Next.js"].id },{ id: tagMap["React"].id },{ id: tagMap["TypeScript"].id },{ id: tagMap["Tailwind CSS"].id },{ id: tagMap["PostgreSQL"].id },{ id: tagMap["Prisma"].id },{ id: tagMap["Zod"].id },{ id: tagMap["Vitest"].id },{ id: tagMap["Playwright"].id },{ id: tagMap["Azure Blob Storage"].id }] } } });
  await prisma.project.update({ where: { id: jadwal.id }, data: { tags: { connect: [{ id: tagMap["Python"].id },{ id: tagMap["FastAPI"].id },{ id: tagMap["Next.js"].id },{ id: tagMap["PostgreSQL"].id }] } } });
  await prisma.project.update({ where: { id: infra.id }, data: { tags: { connect: [{ id: tagMap["Docker"].id },{ id: tagMap["Nginx"].id },{ id: tagMap["Next.js"].id }] } } });

  await prisma.experience.createMany({
    data: [
      { company: "Bimbel YS", position: "Full-Stack Web Developer", startDate: new Date("2026-01-01"), endDate: null, detail: "Membangun & mendeploy website company profile + admin CMS untuk bisnis bimbingan belajar dengan Next.js, TypeScript, PostgreSQL, Prisma. REST-style API, CRUD konten, auth berbasis session (Argon2id, opaque sessions, HttpOnly cookies), validasi Zod, upload Azure Blob Storage, serta fondasi SEO teknis & local SEO. Live: bimbelys.me." },
      { company: "FIA Universitas Brawijaya", position: "Mentor PKBR", startDate: new Date("2024-08-01"), endDate: new Date("2024-09-30"), detail: "Membimbing mahasiswa dalam kegiatan pembinaan karakter sebagai rangkaian PKKMB FIA UB." },
      { company: "Pusat Tahfidz Quran MRP Universitas Brawijaya", position: "Pengajar Baca Tulis Al-Qur'an", startDate: new Date("2024-01-01"), endDate: new Date("2024-12-31"), detail: "Mengajar Baca Tulis Al-Qur'an di Masjid Raden Patah Universitas Brawijaya." },
      { company: "LKI-AMD", position: "Ketua Departemen Hubungan Masyarakat", startDate: new Date("2024-01-01"), endDate: new Date("2024-12-31"), detail: "Memantau pelaksanaan program kerja dan koordinasi hubungan dengan lembaga serta civitas akademika UB." },
      { company: "UAKI Universitas Brawijaya", position: "Staff Ahli Creative Event", startDate: new Date("2024-01-01"), endDate: new Date("2025-06-30"), detail: "Perencanaan & pelaksanaan NgabarKuy, SMMABA, Muslim Youth Festival, Ramadhan Brawijaya." },
      { company: "MTQMN XVII 2023", position: "Panitia MTQMN di Universitas Brawijaya", startDate: new Date("2023-08-01"), endDate: new Date("2023-11-30"), detail: "Berperan aktif dalam pelaksanaan MTQ Mahasiswa Nasional XVII di Universitas Brawijaya." },
      { company: "Departemen Teknik Informatika UB", position: "Staff Acara RECON 2023", startDate: new Date("2023-03-01"), endDate: new Date("2023-06-30"), detail: "Panitia penyelenggaraan RECON 2023." },
      { company: "UAKI Universitas Brawijaya", position: "Staff Ahli Kominfo", startDate: new Date("2023-01-01"), endDate: new Date("2023-12-31"), detail: "Kolaborasi kreatif, dakwah, dan kelas desain." },
    ],
  });

  await prisma.education.createMany({
    data: [{ school: "Universitas Brawijaya", degree: "S.Kom.", field: "Teknik Informatika", startDate: new Date("2022-08-01"), endDate: new Date("2026-07-24"), detail: "Lulus Yudisium: 24 Juli 2026 | IPK: 3.52. Sertifikasi: Oracle Database Design (Jan 2024), Oracle Database Programming with SQL (Feb 2024), Coding Camp 2025 DBS Foundation, Siswa Tersertifikasi Gemini Google for Education (Mei 2026)." }],
  });

  console.log("Seed real data completed");
  console.log({ adminId: admin.id, siteProfileId: siteProfile.id, projects: [bimbel.id, jadwal.id, infra.id] });
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
