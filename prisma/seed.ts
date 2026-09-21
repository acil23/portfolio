// prisma/seed.ts
import 'dotenv/config';
import { UserRole } from '../src/generated/prisma';
import { prisma } from "../src/lib/db/prisma";
import { hashPassword } from '../src/lib/security/password';

async function main() {
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.siteProfile.deleteMany();
  await prisma.media.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hashPassword("Admin12345!");

  const adminUser = await prisma.user.create({
    data: {
      name: "Aklein Admin",
      email: "admin@aklein.tech",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const avatarMedia = await prisma.media.create({
    data: {
      name: "Aklein Avatar",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80",
      type: "image/jpeg",
      folder: "branding",
    },
  });

  const siteProfile = await prisma.siteProfile.create({
    data: {
      displayName: "Aklein",
      headline: "Full-Stack Developer & Portfolio Builder",
      shortBio:
        "Saya membangun website dan aplikasi full-stack dengan struktur rapi, pengalaman pengguna yang jelas, dan kode yang mudah dipelihara.",
      longBio:
        "Saya adalah fresh graduate Teknik Informatika yang sedang membangun portofolio full-stack untuk menunjukkan kemampuan di frontend, backend, database, dan deployment. Proyek ini saya jadikan tempat belajar sekaligus etalase karya yang bisa dipakai untuk melamar kerja dan menjelaskan proses teknis secara nyata.",
      location: "Indonesia",
      avatarMediaId: avatarMedia.id,
      emailPublic: "hello@aklein.tech",
      whatsappNumber: "6281234567890",
      githubUrl: "https://github.com/username",
      linkedinUrl: "https://linkedin.com/in/username",
      instagramUrl: "https://instagram.com/username",
      cvUrl: "https://aklein.tech/cv.pdf",
      heroCtaPrimaryLabel: "Lihat Project",
      heroCtaPrimaryHref: "/projects",
      heroCtaSecondaryLabel: "Hubungi Saya",
      heroCtaSecondaryHref: "/contact",
    },
  });

  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Next.js" } }),
    prisma.tag.create({ data: { name: "TypeScript" } }),
    prisma.tag.create({ data: { name: "Prisma" } }),
    prisma.tag.create({ data: { name: "Supabase" } }),
    prisma.tag.create({ data: { name: "Tailwind CSS" } }),
    prisma.tag.create({ data: { name: "React" } }),
    prisma.tag.create({ data: { name: "Node.js" } }),
    prisma.tag.create({ data: { name: "PostgreSQL" } }),
  ]);

  const tagMap = Object.fromEntries(tags.map((tag) => [tag.name, tag]));

  await prisma.skill.createMany({
    data: [
      { name: "Next.js", category: "Frontend", level: 4 },
      { name: "React", category: "Frontend", level: 4 },
      { name: "TypeScript", category: "Language", level: 4 },
      { name: "Tailwind CSS", category: "Styling", level: 4 },
      { name: "Prisma", category: "Database", level: 4 },
      { name: "PostgreSQL", category: "Database", level: 3 },
      { name: "Node.js", category: "Backend", level: 3 },
      { name: "Supabase", category: "Backend", level: 3 },
      { name: "Git & GitHub", category: "Workflow", level: 4 },
      { name: "Figma", category: "Design", level: 3 },
    ],
  });

  const projectAtlas = await prisma.project.create({
    data: {
      title: "Project Atlas",
      slug: "project-atlas",
      summary:
        "Sistem portfolio full-stack untuk menampilkan identitas profesional, project, dan perjalanan belajar secara terstruktur.",
      description:
        "Project Atlas adalah website portfolio personal yang dibangun dengan Next.js, Prisma, dan Supabase. Fokus utamanya adalah menampilkan brand pribadi, project unggulan, serta alur data yang jelas dari UI sampai database.",
      isPublished: true,
      projectImages: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1600&q=80",
            alt: "Tampilan utama Project Atlas",
            order: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80",
            alt: "Dashboard Project Atlas",
            order: 2,
          },
        ],
      },
    },
  });

  const projectBloom = await prisma.project.create({
    data: {
      title: "Project Bloom",
      slug: "project-bloom",
      summary:
        "Website landing page modern untuk menampilkan identitas personal dan CTA yang kuat.",
      description:
        "Project Bloom berfokus pada kesan visual yang bersih, animasi ringan, dan tata letak yang mudah dibaca. Proyek ini menekankan pengalaman pengguna tanpa mengorbankan struktur komponen yang rapi.",
      isPublished: true,
      projectImages: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80",
            alt: "Hero section Project Bloom",
            order: 1,
          },
        ],
      },
    },
  });

  const projectNova = await prisma.project.create({
    data: {
      title: "Project Nova",
      slug: "project-nova",
      summary:
        "Aplikasi studi kasus untuk memperlihatkan alur CRUD, upload file, dan pengelolaan konten.",
      description:
        "Project Nova dirancang sebagai contoh aplikasi yang menampilkan konsep data-driven website. Di dalamnya ada pengelolaan konten, file media, dan pola kerja backend yang mudah dijelaskan saat interview.",
      isPublished: false,
      projectImages: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80",
            alt: "Preview Project Nova",
            order: 1,
          },
        ],
      },
    },
  });

  await prisma.project.update({
    where: { id: projectAtlas.id },
    data: {
      tags: {
        connect: [
          { id: tagMap["Next.js"].id },
          { id: tagMap["TypeScript"].id },
          { id: tagMap["Prisma"].id },
          { id: tagMap["Supabase"].id },
        ],
      },
    },
  });

  await prisma.project.update({
    where: { id: projectBloom.id },
    data: {
      tags: {
        connect: [
          { id: tagMap["Next.js"].id },
          { id: tagMap["Tailwind CSS"].id },
          { id: tagMap["React"].id },
        ],
      },
    },
  });

  await prisma.project.update({
    where: { id: projectNova.id },
    data: {
      tags: {
        connect: [
          { id: tagMap["Node.js"].id },
          { id: tagMap["PostgreSQL"].id },
          { id: tagMap["Prisma"].id },
        ],
      },
    },
  });

  await prisma.experience.createMany({
    data: [
      {
        company: "Freelance / Personal Project",
        position: "Full-Stack Developer",
        startDate: new Date("2025-01-01"),
        endDate: null,
        detail:
          "Membangun portfolio platform, mempelajari arsitektur full-stack, Prisma, Supabase, dan workflow deployment modern.",
      },
      {
        company: "Study / Campus Project",
        position: "Web Development Contributor",
        startDate: new Date("2024-08-01"),
        endDate: new Date("2024-12-31"),
        detail:
          "Berpartisipasi dalam proyek kuliah dan studi kasus pengembangan web dengan fokus pada UI yang rapi dan integrasi data.",
      },
    ],
  });

  await prisma.education.createMany({
    data: [
      {
        school: "Universitas / Kampus",
        degree: "Sarjana",
        field: "Teknik Informatika",
        startDate: new Date("2021-09-01"),
        endDate: new Date("2025-07-01"),
        detail:
          "Mempelajari dasar pemrograman, basis data, pengembangan web, dan rekayasa perangkat lunak.",
      },
    ],
  });

  await prisma.post.createMany({
    data: [
      {
        title: "Membangun Portfolio yang Bisa Menjelaskan Skill Secara Nyata",
        slug: "membangun-portfolio-yang-bisa-menjelaskan-skill-secara-nyata",
        excerpt:
          "Catatan tentang bagaimana sebuah portfolio seharusnya membantu recruiter memahami alur pikir dan kemampuan teknis.",
        content:
          "Portfolio yang baik bukan hanya tampilan menarik, tetapi juga memperlihatkan keputusan teknis, struktur data, dan cara kerja aplikasi dari ujung ke ujung.",
        isPublished: true,
      },
    ],
  });

  await prisma.contactMessage.createMany({
    data: [
      {
        name: "Sample Visitor",
        email: "visitor@example.com",
        subject: "Ingin berdiskusi mengenai project portfolio",
        message:
          "Halo, saya tertarik melihat bagaimana struktur project ini dibangun dan ingin berdiskusi lebih lanjut.",
        isRead: false,
      },
    ],
  });

  console.log("Seed completed successfully");
  console.log({
    adminUserId: adminUser.id,
    siteProfileId: siteProfile.id,
    projectIds: [projectAtlas.id, projectBloom.id, projectNova.id],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });