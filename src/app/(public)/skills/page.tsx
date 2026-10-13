import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionHeader } from "@/components/ui/section-header";
import { fetchSkills } from "@/server/services/skill.service";

export const revalidate = 60;
export const metadata = { title: "Skills" };

export default async function SkillsPage() {
  const skills = (await fetchSkills().catch(() => [])) as Awaited<ReturnType<typeof fetchSkills>>;
  const grouped = (skills as typeof skills).reduce((acc: Record<string, typeof skills>, s) => {
    const k = s.category || "General";
    (acc[k] ||= []).push(s);
    return acc;
  }, {});
  const entries = Object.entries(grouped);
  return (
    <div className="flex min-h-screen flex-col bg-[#FDFCFB] text-[#0A0A0A]">
      <Navbar />
      <main className="flex-1 px-6 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeader overline="Skills" title="Stack, shaped by taste." description="Every tool I reach for — with level and craft." />
          {entries.length === 0 ? <p className="mt-10 font-mono text-xs text-black/40">No skills yet — add from dashboard.</p> :
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {entries.map(([cat, items]) => (
                <div key={cat} className="rounded-2xl border border-black/10 bg-white p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">{cat}</p>
                  <ul className="mt-4 space-y-2">
                    {items.map((s) => (
                      <li key={s.id} className="flex items-center justify-between text-sm text-black/70">
                        <span>{s.name}</span>
                        {s.level != null && <span className="font-mono text-[11px] text-black/40">{s.level}%</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          }
        </div>
      </main>
      <Footer />
    </div>
  );
}
