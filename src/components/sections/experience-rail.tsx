"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";

type Exp = { id: string; position: string; company: string; startDate: Date; endDate: Date | null; detail: string | null };
type Edu = { id: string; school: string; degree: string | null; field: string | null; startDate: Date; endDate: Date | null; detail: string | null };

const MOCK_EXP: Exp[] = [
  { id: "1", position: "Full-Stack Developer", company: "Freelance · Remote", startDate: new Date("2024-01-01"), endDate: null, detail: "Shipping Next.js + Prisma products, design systems, and admin platforms for founders." },
  { id: "2", position: "Frontend Engineer", company: "Studio — Jakarta", startDate: new Date("2022-01-01"), endDate: new Date("2024-01-01"), detail: "Built editorial sites and dashboards — obsession with motion, a11y, and performance." },
];

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
function range(start: Date, end: Date | null) {
  return `${fmt(start)} — ${end ? fmt(end) : "Present"}`;
}

export function ExperienceRail({ experiences, educations }: { experiences: Exp[]; educations: Edu[] }) {
  const exps = experiences.length ? experiences : MOCK_EXP;
  const showMockNote = experiences.length === 0;
  return (
    <section id="experience" className="bg-[#0A0A0A] px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader overline="Experience" title="Timeline of craft." description="A quick trace of where I've been — and what I shipped along the way." />
        {showMockNote && <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-gold/60">Preview timeline — add entries in dashboard to go live</p>}

        <div className="relative mt-12 border-l border-white/10 pl-8 md:pl-10">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-0 h-full w-px origin-top bg-gold/50"
          />
          <div className="flex flex-col gap-10">
            {exps.map((it) => (
              <div key={it.id} className="relative">
                <span className="absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_10px_oklch(0.75_0.08_75/50%)] md:-left-[45px]" />
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold">{range(new Date(it.startDate), it.endDate ? new Date(it.endDate) : null)}</p>
                <h3 className="font-display mt-1 text-xl tracking-[-0.02em] text-foreground">{it.position} <span className="text-muted-foreground">· {it.company}</span></h3>
                {it.detail && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{it.detail}</p>}
              </div>
            ))}
            {educations.length > 0 && (
              <>
                <div className="pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Education</div>
                {educations.map((ed) => (
                  <div key={ed.id} className="relative">
                    <span className="absolute -left-[37px] top-1.5 h-2 w-2 rounded-full bg-white/30 md:-left-[45px]" />
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">{range(new Date(ed.startDate), ed.endDate ? new Date(ed.endDate) : null)}</p>
                    <h3 className="font-display mt-1 text-lg tracking-[-0.02em] text-foreground">{[ed.degree, ed.field].filter(Boolean).join(" · ") || ed.school} <span className="text-muted-foreground">· {ed.school}</span></h3>
                    {ed.detail && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{ed.detail}</p>}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
