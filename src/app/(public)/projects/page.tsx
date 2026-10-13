import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionHeader } from "@/components/ui/section-header";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { fetchPublishedProjects } from "@/server/services/project.service";
import { fetchTags } from "@/server/services/tag.service";

export const revalidate = 60;
export const metadata = { title: "Projects" };

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const [projects, tags] = await Promise.all([
    fetchPublishedProjects().catch(() => []),
    fetchTags().catch(() => []),
  ]);

  const filtered = tag ? projects.filter((p) => p.tags.some((t) => t.name === tag)) : projects;

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A]">
      <Navbar />
      <main className="flex-1 px-6 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeader
            overline="Archive"
            title="All projects — built with obsession."
            description="Every published piece, from product platforms to design systems."
          />

          {/* Tag filter - Opsi A deep dive */}
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/projects"
              className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${!tag ? "border-gold bg-gold text-black" : "border-white/15 text-white/60 hover:border-gold/50 hover:text-gold"}`}
            >
              All
            </Link>
            {tags.map((t) => (
              <Link
                key={t.id}
                href={`/projects?tag=${encodeURIComponent(t.name)}`}
                className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${tag === t.name ? "border-gold bg-gold text-black" : "border-white/15 text-white/60 hover:border-gold/50 hover:text-gold"}`}
              >
                {t.name}
              </Link>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-16 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-white/50">
                {tag ? `No projects tagged "${tag}"` : "No published projects yet — publish from dashboard"}
              </p>
              <Link href="/#work" className="mt-4 inline-block font-mono text-xs text-gold hover:underline">
                ← Back to Home
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => {
                const cover = p.projectImages[0]?.url;
                return (
                  <Link key={p.slug} href={`/projects/${p.slug}`}>
                    <SpotlightCard>
                      <div className="relative flex aspect-[16/11] flex-col justify-end overflow-hidden p-6">
                        {cover ? (
                          <Image src={cover} alt={p.title} fill className="object-cover opacity-70" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-white/[0.02]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="relative">
                          <h3 className="font-display text-xl tracking-[-0.02em] text-white">{p.title}</h3>
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/60">{p.summary}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {p.tags.slice(0, 3).map((t) => (
                              <span key={t.id} className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/50">
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
