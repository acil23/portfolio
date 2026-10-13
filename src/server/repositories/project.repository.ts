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

export async function getProjectsAdmin() {
  return prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      projectImages: true,
      tags: true,
    },
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      projectImages: true,
      tags: true,
    },
  });
}

export async function createProject(data: {
  title: string;
  slug: string;
  summary: string;
  description?: string | null;
  isPublished?: boolean;
}) {
  return prisma.project.create({
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      description: data.description ?? null,
      isPublished: data.isPublished ?? false,
    },
  });
}

export async function updateProject(
  id: string,
  data: {
    title?: string;
    slug?: string;
    summary?: string;
    description?: string | null;
    isPublished?: boolean;
  }
) {
  return prisma.project.update({
    where: { id },
    data,
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({
    where: { id },
  });
}