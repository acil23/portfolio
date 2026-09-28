import { prisma } from "@/lib/db/prisma";

export async function getEducations() {
  return prisma.education.findMany({
    orderBy: [
      { startDate: "desc" },
      { createdAt: "desc" },
    ],
  });
}