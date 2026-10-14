import { prisma } from "@/lib/db/prisma";
import { ProjectsClient } from "./projects-client";
export const dynamic = "force-dynamic";
export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  let tags: Awaited<ReturnType<typeof prisma.tag.findMany>> = [];
  try { [projects, tags] = await Promise.all([prisma.project.findMany({ orderBy: { createdAt: "desc" }, include: { tags: true, projectImages: { orderBy: { order: "asc" } } } }), prisma.tag.findMany({ orderBy: { name: "asc" } })]); } catch {}
  return (
    <div className="mx-auto max-w-[1080px]">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">02 — Projects</p>
      <h1 className="font-display mt-2 text-[28px] tracking-[-0.02em]">Projects</h1>
      <p className="mt-2 text-sm text-black/50">Create, publish, and curate work — tags & gallery inline.</p>
      <div className="mt-8"><ProjectsClient initial={projects as never[]} allTags={tags as never[]} /></div>
    </div>
  );
}
