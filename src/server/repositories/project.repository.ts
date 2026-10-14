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
  tagIds?: string[];
  images?: { url: string; alt?: string | null; order?: number }[];
}) {
  return prisma.project.create({
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      description: data.description ?? null,
      isPublished: data.isPublished ?? false,
      ...(data.tagIds ? { tags: { connect: data.tagIds.map((id) => ({ id })) } } : {}),
      ...(data.images && data.images.length
        ? { projectImages: { create: data.images.map((img, i) => ({ url: img.url, alt: img.alt ?? null, order: img.order ?? i })) } }
        : {}),
    },
    include: { tags: true, projectImages: { orderBy: { order: "asc" } } },
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
    tagIds?: string[];
    images?: { url: string; alt?: string | null; order?: number }[];
  }
) {
  const { tagIds, images, ...rest } = data;
  let orphanUrls: string[] = [];
  if (images !== undefined) {
    const before = await prisma.projectImage.findMany({ where: { projectId: id }, select: { url: true } });
    const keep = new Set((images ?? []).map((im) => im.url));
    orphanUrls = before.map((b) => b.url).filter((u) => !keep.has(u));
    await prisma.projectImage.deleteMany({ where: { projectId: id } });
  }
  const updated = await prisma.project.update({
    where: { id },
    data: {
      ...rest,
      ...(tagIds !== undefined ? { tags: { set: tagIds.map((tid) => ({ id: tid })) } } : {}),
      ...(images !== undefined && images.length
        ? { projectImages: { create: images.map((img, i) => ({ url: img.url, alt: img.alt ?? null, order: img.order ?? i })) } }
        : {}),
    },
    include: { tags: true, projectImages: { orderBy: { order: "asc" } } },
  });
  if (orphanUrls.length) {
    // fire-and-forget orphan cleanup: only our bucket
    (async () => {
      try {
        const { getSupabaseAdmin, getBucket, urlToStoragePath } = await import("@/lib/supabase/server");
        const paths = orphanUrls.map((u) => urlToStoragePath(u)).filter(Boolean) as string[];
        if (paths.length) await getSupabaseAdmin().storage.from(getBucket()).remove(paths);
        await prisma.media.deleteMany({ where: { url: { in: orphanUrls } } });
      } catch (e) { console.warn("orphan cleanup failed", e); }
    })();
  }
  return updated;
}

export async function deleteProject(id: string) {
  return prisma.project.delete({
    where: { id },
  });
}