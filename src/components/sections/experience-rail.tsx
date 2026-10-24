"use client";

import { motion } from "framer-motion";

type Exp = {
  id: string;
  position: string;
  company: string;
  startDate: Date;
  endDate: Date | null;
  detail: string | null;
};
type Edu = {
  id: string;
  school: string;
  degree: string | null;
  field: string | null;
  startDate: Date;
  endDate: Date | null;
  detail: string | null;
};

const MOCK_EXP: Exp[] = [
  {
    id: "1",
    position: "Senior Full-Stack & Creative Developer",
    company: "Independent Studio · Remote",
    startDate: new Date("2024-01-01"),
    endDate: null,
    detail:
      "Architecting high-end Next.js, WebGL, and Prisma/Supabase platforms with bespoke interactive 3D visuals and enterprise reliability.",
  },
  {
    id: "2",
    position: "Frontend & Motion Engineer",
    company: "Digital Collective — Jakarta",
    startDate: new Date("2022-01-01"),
    endDate: new Date("2024-01-01"),
    detail:
      "Engineered luxury editorial web applications, design systems, and fluid Framer Motion choreographies.",
  },
];

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
function range(start: Date, end: Date | null) {
  return `${fmt(start)} — ${end ? fmt(end) : "PRESENT"}`;
}

export function ExperienceRail({
  experiences,
  educations,
}: {
  experiences: Exp[];
  educations: Edu[];
}) {
  const exps = experiences.length ? experiences : MOCK_EXP;

  return (
    <section id="experience" className="relative overflow-hidden bg-[#060609] px-6 py-24 md:px-10 md:py-32">
      <div className="hud-grid-overlay pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative mx-auto max-w-[1380px]">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#e5c168] shadow-[0_0_10px_#e5c168]" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#f5d782]">
            04 // CHRONOLOGY &amp; EXPERIENCE RAIL
          </p>
        </div>
        <h2 className="mt-3 font-display text-[clamp(34px,4.8vw,56px)] font-light tracking-[-0.02em] text-white">
          Timeline of <span className="text-metallic-gold italic">execution</span>.
        </h2>

        <div className="relative mt-14 border-l border-white/15 pl-8 md:pl-12">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-[#f5d782] via-[#e5c168]/60 to-transparent"
          />

          <div className="flex flex-col gap-8">
            {exps.map((it, idx) => (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="glass-obsidian relative rounded-2xl p-6 md:p-8"
              >
                {/* Glowing Golden Node on Rail */}
                <span className="absolute -left-[39px] top-8 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#f5d782] bg-[#060609] shadow-[0_0_14px_#f5d782] md:-left-[55px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f5d782]" />
                </span>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#f5d782]">
                    {range(new Date(it.startDate), it.endDate ? new Date(it.endDate) : null)}
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                    LOG // 0{idx + 1}
                  </span>
                </div>

                <h3 className="mt-2 font-sans text-xl font-semibold tracking-[0.02em] text-white">
                  {it.position}{" "}
                  <span className="font-normal text-white/55">· {it.company}</span>
                </h3>
                {it.detail && (
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">
                    {it.detail}
                  </p>
                )}
              </motion.div>
            ))}

            {educations.length > 0 && (
              <>
                <div className="pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f5d782]/70">
                  ACADEMIC CREDENTIALS
                </div>
                {educations.map((ed) => (
                  <div key={ed.id} className="glass-obsidian relative rounded-2xl p-6">
                    <span className="absolute -left-[37px] top-7 h-2.5 w-2.5 rounded-full bg-white/40 md:-left-[53px]" />
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
                      {range(new Date(ed.startDate), ed.endDate ? new Date(ed.endDate) : null)}
                    </p>
                    <h3 className="mt-1 font-sans text-lg font-medium text-white">
                      {[ed.degree, ed.field].filter(Boolean).join(" · ") || ed.school}{" "}
                      <span className="text-white/50">· {ed.school}</span>
                    </h3>
                    {ed.detail && (
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
                        {ed.detail}
                      </p>
                    )}
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
