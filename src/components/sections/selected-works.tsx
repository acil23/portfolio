"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { staggerContainer, staggerItem } from "@/lib/motion";

type ProjectCard = {
  slug: string;
  title: string;
  summary: string;
  tags: { id: string; name: string }[];
  projectImages: { url: string; alt: string | null }[];
};

const MOCK: ProjectCard[] = [
  {
    slug: "aklein-platform",
    title: "aklein.tech Platform",
    summary: "Full-stack portfolio platform — typed UI → Zod → Prisma → Supabase. Admin CRUD, auth, SEO.",
    tags: [{ id: "1", name: "Next.js 15" }, { id: "2", name: "Prisma 7" }, { id: "3", name: "Supabase" }],
    projectImages: [],
  },
  {
    slug: "commerce-engine",
    title: "Commerce Engine",
    summary: "Headless commerce with inventory sync and checkout orchestration — built for scale.",
    tags: [{ id: "4", name: "TypeScript" }, { id: "5", name: "Postgres" }, { id: "6", name: "Vercel" }],
    projectImages: [],
  },
  {
    slug: "design-system-noir",
    title: "Noir Editorial System",
    summary: "Luxury design tokens, motion, and narrative — crafted for editorial-grade portfolios.",
    tags: [{ id: "7", name: "Tailwind v4" }, { id: "8", name: "Framer Motion" }, { id: "9", name: "Lenis" }],
    projectImages: [],
  },
];

const LABELS = ["Featured — 2026", "Case Study", "Design System"];

export function SelectedWorks({ projects }: { projects: ProjectCard[] }) {
  const list = projects.length > 0 ? projects.slice(0, 3) : MOCK;
  const isEmpty = projects.length === 0;

  return (
    <section id="work" className="bg-[#0A0A0A] px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          overline="Selected Works"
          title="Work that speaks — quietly, clearly."
          description="Three pieces that best represent how I think, build, and ship. The rest lives in the archive."
        />
        {isEmpty && (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-gold/60">
            Showing curated preview — publish projects in dashboard to go live
          </p>
        )}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-6 md:grid-cols-2"
        >
          {list.map((p, i) => {
            const cover = p.projectImages[0]?.url;
            return (
              <motion.div key={p.slug} variants={staggerItem} className={i === 0 ? "md:col-span-2" : ""}>
                <Link href={`/projects/${p.slug}`}>
                  <SpotlightCard className="group">
                    <div className="relative flex aspect-[16/10] flex-col justify-end overflow-hidden bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8">
                      {cover ? (
                        <Image src={cover} alt={p.projectImages[0]?.alt || p.title} fill className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute right-6 top-6 h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_oklch(0.75_0.08_75/60%)]" />
                      <div className="relative">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">{LABELS[i] ?? "Project"}</p>
                        <h3 className="font-display mt-2 text-2xl tracking-[-0.02em] text-white md:text-3xl">{p.title}</h3>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60 line-clamp-2">{p.summary}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {p.tags.slice(0, 4).map((t) => (
                            <span key={t.id} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-white/50">
                              {t.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <Link href="/projects" className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-gold transition-colors">
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
