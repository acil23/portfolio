import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionHeader } from "@/components/ui/section-header";
import { fetchSiteProfile } from "@/server/services/site-profile.service";

export const revalidate = 60;
export const metadata = { title: "About" };

export default async function AboutPage() {
  const profile = await fetchSiteProfile().catch(() => null);
  return (
    <div className="flex min-h-screen flex-col bg-[#060609] text-white">
      <Navbar />
      <main className="relative flex-1 px-6 py-28 md:px-10 md:py-36">
        <div className="hud-grid-overlay pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-[1280px]">
          <SectionHeader
            overline="03 // IDENTITY & PHILOSOPHY"
            title={profile?.headline || "Precision over noise — taste over trends."}
            description={
              profile?.shortBio ||
              "Full-stack developer & 3D creative technologist crafting products that feel as good as they perform."
            }
          />
          <div className="mt-12 grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-obsidian-gold relative aspect-[4/5] overflow-hidden rounded-3xl p-4">
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.22)_0%,rgba(10,10,16,0.95)_80%)]">
                {profile?.avatarMedia?.url ? (
                  <Image
                    src={profile.avatarMedia.url}
                    alt={profile.displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-7xl text-metallic-gold">
                    {(profile?.displayName?.[0] || "J") + "."}
                  </div>
                )}
              </div>
            </div>
            <div className="glass-obsidian flex flex-col justify-between rounded-3xl p-8 md:p-10">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#f5d782]">
                  {profile?.displayName || "JUPRI NALDI"} ·{" "}
                  {profile?.location || "INDONESIA — GLOBAL"}
                </p>
                <p className="mt-6 whitespace-pre-wrap text-[17px] leading-relaxed text-white/75">
                  {profile?.longBio ||
                    profile?.shortBio ||
                    "I build full-stack products and interactive 3D web experiences where engineering and design are not separate phases — they are the same craft."}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                {profile?.githubUrl && (
                  <Link
                    href={profile.githubUrl}
                    target="_blank"
                    className="rounded-full border border-white/15 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-white/80 hover:border-[#f5d782] hover:text-[#f5d782]"
                  >
                    GitHub →
                  </Link>
                )}
                {profile?.linkedinUrl && (
                  <Link
                    href={profile.linkedinUrl}
                    target="_blank"
                    className="rounded-full border border-white/15 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-white/80 hover:border-[#f5d782] hover:text-[#f5d782]"
                  >
                    LinkedIn →
                  </Link>
                )}
                <Link
                  href="/#contact"
                  className="rounded-full border border-[#e5c168]/60 bg-[#e5c168]/15 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-[#fff6d6] hover:border-[#f5d782]"
                >
                  Initiate Contact ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
