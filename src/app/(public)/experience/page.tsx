import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionHeader } from "@/components/ui/section-header";
import { fetchExperiences } from "@/server/services/experience.service";
import { fetchEducations } from "@/server/services/education.service";

export const revalidate = 60;
export const metadata = { title: "Experience" };

function fmt(d: Date) { return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }); }

export default async function ExperiencePage() {
  const [experiences, educations] = await Promise.all([fetchExperiences().catch(() => []), fetchEducations().catch(() => [])]);
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A]">
      <Navbar />
      <main className="flex-1 px-6 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeader overline="Experience" title="Timeline of craft." description="Full trace — roles and education." />
          <div className="mt-12 space-y-8 border-l border-white/10 pl-8">
            {experiences.length === 0 ? <p className="font-mono text-xs text-white/40">No experience yet — add from dashboard.</p> :
              experiences.map((e) => (
                <div key={e.id}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold">{fmt(e.startDate)} — {e.endDate ? fmt(e.endDate) : "Present"}</p>
                  <h3 className="font-display mt-1 text-xl text-white">{e.position} <span className="text-white/50">· {e.company}</span></h3>
                  {e.detail && <p className="mt-2 text-sm text-white/60">{e.detail}</p>}
                </div>
              ))}
            {educations.length > 0 && (
              <>
                <p className="pt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">Education</p>
                {educations.map((ed) => (
                  <div key={ed.id}>
                    <p className="font-mono text-[11px] text-white/50">{fmt(ed.startDate)} — {ed.endDate ? fmt(ed.endDate) : "Present"}</p>
                    <h3 className="font-display text-lg text-white">{[ed.degree, ed.field].filter(Boolean).join(" · ") || ed.school} · {ed.school}</h3>
                    {ed.detail && <p className="mt-1 text-sm text-white/60">{ed.detail}</p>}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
