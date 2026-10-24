"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { HolographicArt, type HoloArtVariant } from "@/components/ui/holographic-art";
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
    slug: "astral-design-system",
    title: "Astral Design Engine",
    summary:
      "Interactive 3D WebGL & Next.js design system with custom GLSL shaders, real-time telemetry, and fluid physics.",
    tags: [
      { id: "1", name: "WebGL / GLSL" },
      { id: "2", name: "Next.js 16" },
      { id: "3", name: "Framer Motion" },
    ],
    projectImages: [],
  },
  {
    slug: "chrome-lab-platform",
    title: "Chrome Lab Platform",
    summary:
      "Full-stack architecture — typed UI → Zod → Prisma 7 → Supabase. Engineered with sub-50ms edge response.",
    tags: [
      { id: "4", name: "TypeScript" },
      { id: "5", name: "Prisma 7" },
      { id: "6", name: "Supabase" },
    ],
    projectImages: [],
  },
  {
    slug: "virtual-ore-commerce",
    title: "Virtual Ore Commerce",
    summary:
      "High-conversion spatial commerce experience with real-time 3D product inspection and automated checkout.",
    tags: [
      { id: "7", name: "Three / WebGL" },
      { id: "8", name: "PostgreSQL" },
      { id: "9", name: "Tailwind v4" },
    ],
    projectImages: [],
  },
];

const ART_VARIANTS: HoloArtVariant[] = ["astral", "torus", "ore", "wave"];
const HUD_CODES = ["SYS // 01.A", "SYS // 02.B", "SYS // 03.C"];

export function SelectedWorks({ projects }: { projects: ProjectCard[] }) {
  const list = projects.length > 0 ? projects.slice(0, 3) : MOCK;
  const isEmpty = projects.length === 0;

  return (
    <section id="work" className="relative overflow-hidden bg-[#060609] px-6 py-24 md:px-10 md:py-32">
      <div className="hud-grid-overlay pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#e5c168]/40 to-transparent" />

      <div className="relative mx-auto max-w-[1380px]">
        {/* HUD Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#e5c168] shadow-[0_0_10px_#e5c168]" />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#f5d782]">
                02 // SELECTED WORKS ARCHIVE
              </p>
            </div>
            <h2 className="mt-3 font-display text-[clamp(34px,5vw,60px)] font-light leading-[0.95] tracking-[-0.02em] text-white">
              Engineered for <span className="text-metallic-gold italic">cinema</span> &amp; scale.
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
              RENDER PIPELINE: PBR GOLD • HOLOGRAPHIC CHROME
            </p>
            {isEmpty && (
              <span className="rounded-full border border-[#e5c168]/30 bg-[#e5c168]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#f5d782]">
                Curated Preview Mode — Publish in Dashboard
              </span>
            )}
          </div>
        </div>

        {/* Glassmorphism Project Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-7 lg:grid-cols-3"
        >
          {list.map((p, i) => {
            const cover = p.projectImages[0]?.url;
            const variant = ART_VARIANTS[i % ART_VARIANTS.length];

            return (
              <motion.div
                key={p.slug}
                variants={staggerItem}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={isEmpty ? "/projects" : `/projects/${p.slug}`} className="block h-full">
                  <SpotlightCard className="glass-obsidian group flex h-full flex-col justify-between rounded-[24px] border-white/15 p-0 transition-all duration-500 hover:border-[#e5c168]/50">
                    {/* Top Visual Render Stage */}
                    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-t-[23px]">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={p.projectImages[0]?.alt || p.title}
                          fill
                          className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <HolographicArt
                          variant={variant}
                          className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                        />
                      )}

                      {/* Top-Left HUD Coordinate Tag */}
                      <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/75 backdrop-blur-md">
                        {HUD_CODES[i] ?? `SYS // 0${i + 1}`}
                      </div>

                      {/* Top-Right Mini Glass Picture-in-Picture Badge */}
                      <div className="absolute right-4 top-4 h-12 w-16 overflow-hidden rounded-xl border border-white/30 bg-white/10 p-1 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
                        <HolographicArt variant={variant} mini className="h-full w-full" />
                      </div>

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#09090e] via-[#09090e]/60 to-transparent" />
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col justify-between p-6 pt-3">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-sans text-xl font-semibold uppercase tracking-[0.04em] text-white group-hover:text-[#f5d782] transition-colors">
                            {p.title}
                          </h3>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-[#e5c168] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-white/60">
                          {p.summary}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex flex-wrap gap-1.5">
                          {p.tags.slice(0, 3).map((t) => (
                            <span
                              key={t.id}
                              className="rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white/65"
                            >
                              {t.name}
                            </span>
                          ))}
                        </div>
                        <span className="text-[#f0cb6e] transition-transform duration-500 group-hover:rotate-90">
                          ✦
                        </span>
                      </div>
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2.5 rounded-full border border-[#e5c168]/40 bg-[#e5c168]/10 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#fff4cc] shadow-[0_0_24px_rgba(212,175,55,0.18)] transition-all hover:border-[#f5d782] hover:bg-[#e5c168]/20"
          >
            <span>Explore Full Archive</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
