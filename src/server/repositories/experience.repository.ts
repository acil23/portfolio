import { prisma } from "@/lib/db/prisma";

export async function getExperiences() {
  return prisma.experience.findMany({
    orderBy: [
      { startDate: "desc" },
      { createdAt: "desc" },
    ],
  });
}