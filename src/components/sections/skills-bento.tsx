"use client";

import { SectionHeader } from "@/components/ui/section-header";

type Skill = { id: string; name: string; category: string | null; level: number | null };

const FALLBACK_GROUPS = [
  { label: "Frontend", items: ["Next.js 15", "React 19", "TypeScript", "Tailwind v4", "Framer Motion"] },
  { label: "Backend", items: ["Prisma 7", "Supabase", "Postgres", "Zod", "Node.js"] },
  { label: "Craft", items: ["Design Systems", "Motion & A11y", "SEO & Perf", "Clean Architecture"] },
  { label: "Tooling", items: ["Vercel", "Git", "Figma", "ESLint"] },
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
  const groups = skills.length ? groupByCategory(skills) : FALLBACK_GROUPS.map((g) => ({ label: g.label, items: g.items.map((name, i) => ({ id: `${g.label}-${i}`, name, category: g.label, level: 88 })) }));
  const isMock = skills.length === 0;
  return (
    <section className="bg-[#FDFCFB] px-6 py-24 text-[#0A0A0A] md:px-8 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader overline="Skills" title="Stack, shaped by taste." description="Tools I reach for — chosen for clarity, speed, and longevity." />
        {isMock && <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-black/30">Preview stack — add skills in dashboard to go live</p>}
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g.label} className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">{g.label}</p>
              <ul className="mt-4 flex flex-col gap-2">
                {g.items.map((it: Skill | { id: string; name: string }) => (
                  <li key={("id" in it && it.id) || it.name} className="text-sm text-black/70">{it.name}</li>
                ))}
              </ul>
              <div className="mt-6 h-px w-full bg-black/5" />
              <div className="mt-4 h-1 w-full rounded-full bg-black/5">
                <div
                  className="h-1 rounded-full bg-gold"
                  style={{ width: `${Math.min(100, Math.max(40, (g.items[0] as Skill)?.level ?? 88))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
