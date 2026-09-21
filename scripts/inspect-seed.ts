import "dotenv/config";
import { prisma } from "../src/lib/db/prisma";

async function main() {
  const siteProfile = await prisma.siteProfile.findFirst({
    include: {
      avatarMedia: true,
    },
  });

  const users = await prisma.user.findMany();

  const projects = await prisma.project.findMany({
    include: {
      projectImages: true,
      tags: true,
    },
  });

  const skills = await prisma.skill.findMany();
  const experiences = await prisma.experience.findMany();
  const educations = await prisma.education.findMany();
  const posts = await prisma.post.findMany();
  const tags = await prisma.tag.findMany();
  const media = await prisma.media.findMany();
  const contactMessages = await prisma.contactMessage.findMany();

  console.log("\n=== SiteProfile ===");
  console.log(JSON.stringify(siteProfile, null, 2));

  console.log("\n=== Users ===");
  console.log(JSON.stringify(users, null, 2));

  console.log("\n=== Projects ===");
  console.log(JSON.stringify(projects, null, 2));

  console.log("\n=== Skills ===");
  console.log(JSON.stringify(skills, null, 2));

  console.log("\n=== Experiences ===");
  console.log(JSON.stringify(experiences, null, 2));

  console.log("\n=== Educations ===");
  console.log(JSON.stringify(educations, null, 2));

  console.log("\n=== Posts ===");
  console.log(JSON.stringify(posts, null, 2));

  console.log("\n=== Tags ===");
  console.log(JSON.stringify(tags, null, 2));

  console.log("\n=== Media ===");
  console.log(JSON.stringify(media, null, 2));

  console.log("\n=== Contact Messages ===");
  console.log(JSON.stringify(contactMessages, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });