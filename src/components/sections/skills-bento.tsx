"use client";

import { motion } from "framer-motion";

type Skill = { id: string; name: string; category: string | null; level: number | null };

const FALLBACK_GROUPS = [
  {
    label: "3D & Interactive",
    items: ["WebGL / GLSL", "Three.js", "Framer Motion", "Lenis Smooth Scroll", "Interactive HUD"],
  },
  {
    label: "Frontend Core",
    items: ["Next.js 16", "React 19", "TypeScript 5", "Tailwind CSS v4", "Design Systems"],
  },
  {
    label: "Backend & Data",
    items: ["Prisma 7", "Supabase", "PostgreSQL", "Zod Validation", "REST & Server Actions"],
  },
  {
    label: "Performance & Ops",
    items: ["60 FPS Optimization", "Vercel Edge", "Technical SEO", "Clean Architecture"],
  },
];

function groupByCategory(skills: Skill[]) {
  const map = new Map<string, Skill[]>();
  for (const s of skills) {
    const k = s.category?.trim() || "General";
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(s);
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

export function SkillsBento({ skills }: { skills: Skill[] }) {
  const groups = skills.length
    ? groupByCategory(skills)
    : FALLBACK_GROUPS.map((g) => ({
        label: g.label,
        items: g.items.map((name, i) => ({
          id: `${g.label}-${i}`,
          name,
          category: g.label,
          level: 92 - i * 3,
        })),
      }));

  return (
    <section
      id="lab"
      className="relative overflow-hidden bg-[#060609] px-6 py-24 text-white md:px-10 md:py-32"
    >
      <div className="hud-grid-overlay pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative mx-auto max-w-[1380px]">
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]" />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#f5d782]">
                05 // TECHNICAL ARSENAL &amp; SHADER LAB
              </p>
            </div>
            <h2 className="mt-3 font-display text-[clamp(34px,4.8vw,56px)] font-light tracking-[-0.02em] text-white">
              Stack shaped by <span className="text-holographic-chrome font-normal">precision</span>.
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
            TELEMETRY: ALL MODULES NOMINAL
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {groups.map((g, idx) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.55 }}
              whileHover={{ y: -6 }}
              className="glass-obsidian group flex flex-col justify-between rounded-[22px] p-6 transition-all duration-300 hover:border-[#e5c168]/45"
            >
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#f5d782]">
                    {g.label}
                  </p>
                  <span className="font-mono text-[10px] text-white/35">0{idx + 1}</span>
                </div>

                <ul className="mt-5 flex flex-col gap-2.5">
                  {g.items.map((it: Skill | { id: string; name: string; level?: number | null }) => (
                    <li
                      key={("id" in it && it.id) || it.name}
                      className="flex items-center justify-between text-sm text-white/75 group-hover:text-white transition-colors"
                    >
                      <span>{it.name}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#e5c168]/60" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="mb-1.5 flex justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
                  <span>CAPACITY</span>
                  <span className="text-[#f5d782]">
                    {Math.min(100, Math.max(60, (g.items[0] as Skill)?.level ?? 92))}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#e5c168] via-[#fff2ba] to-[#93c5fd] shadow-[0_0_12px_#e5c168]"
                    style={{
                      width: `${Math.min(100, Math.max(60, (g.items[0] as Skill)?.level ?? 92))}%`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
