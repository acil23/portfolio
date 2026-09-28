import { prisma } from "@/lib/db/prisma";

export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      projectImages: true,
      tags: true,
    },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: {
      slug,
    },
    include: {
      projectImages: {
        orderBy: {
          order: "asc",
        },
      },
      tags: true,
    },
  });
}