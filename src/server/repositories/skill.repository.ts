import { prisma } from "@/lib/db/prisma";

export async function getSkills() {
  return prisma.skill.findMany({
    orderBy: [
      { category: "asc" },
      { name: "asc" },
    ],
  });
}