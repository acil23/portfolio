import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aklein.tech";
  const envBase = process.env.NEXT_PUBLIC_SITE_URL ?? base;
  const staticRoutes: MetadataRoute.Sitemap = ["", "/about", "/skills", "/projects", "/experience", "/contact"].map((route) => ({
    url: `${envBase}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  try {
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
    const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${envBase}/projects/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
    return [...staticRoutes, ...projectRoutes];
  } catch {
    return staticRoutes;
  }
}
