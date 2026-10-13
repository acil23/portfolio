import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { fetchProjectBySlug, fetchPublishedProjects } from "@/server/services/project.service";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const projects = await fetchPublishedProjects();
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await fetchProjectBySlug(slug).catch(() => null);
  if (!p) return { title: "Project Not Found" };
  return { title: p.title, description: p.summary };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug).catch(() => null);
  if (!project) notFound();

  const cover = project.projectImages[0]?.url;

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A]">
      <Navbar />
      <main className="flex-1">
        {/* Hero cover */}
        <div className="relative h-[48vh] min-h-[360px] overflow-hidden bg-[#141414]">
          {cover ? (
            <Image src={cover} alt={project.title} fill className="object-cover opacity-60" priority />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-white/[0.02]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1280px] px-6 pb-8 md:px-8">
            <Link href="/projects" className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 hover:text-gold">
              ← All Projects
            </Link>
            <h1 className="font-display mt-3 text-balance text-[clamp(32px,6vw,56px)] font-[300] tracking-[-0.03em] text-white">{project.title}</h1>
            <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-white/60">{project.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span key={t.id} className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] text-white/60">
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-8 md:py-16">
          {project.description ? (
            <article className="prose prose-invert max-w-3xl prose-p:leading-relaxed prose-p:text-white/70 prose-headings:font-display prose-headings:tracking-[-0.02em] prose-a:text-gold">
              <p className="whitespace-pre-wrap text-[17px] leading-relaxed text-white/70">{project.description}</p>
            </article>
          ) : (
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-white/40">No description yet.</p>
          )}

          {project.projectImages.length > 1 && (
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {project.projectImages.slice(1).map((img) => (
                <div key={img.id} className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                  <Image src={img.url} alt={img.alt || project.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/projects" className="inline-flex h-11 items-center rounded-full border border-white/15 px-6 font-mono text-xs uppercase tracking-[0.08em] text-white/70 hover:border-gold/50 hover:text-gold">
              ← Back to Archive
            </Link>
            <Link href="/#contact" className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-medium text-black hover:bg-white/90">
              Start a Project →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
