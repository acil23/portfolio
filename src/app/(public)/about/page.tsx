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
    <div className="flex min-h-screen flex-col bg-[#FDFCFB] text-[#0A0A0A]">
      <Navbar />
      <main className="flex-1 px-6 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeader
            overline="About"
            title={profile?.headline || "Precision over noise — taste over trends."}
            description={profile?.shortBio || "Full-stack developer crafting products that feel as good as they perform."}
          />
          <div className="mt-10 grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-br from-[#0A0A0A] to-[#2A2A2A]">
              {profile?.avatarMedia?.url ? (
                <Image src={profile.avatarMedia.url} alt={profile.displayName} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center font-display text-6xl text-white/90">
                  {(profile?.displayName?.[0] || "A") + "."}
                </div>
              )}
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold">{profile?.displayName || "Aklein"} · {profile?.location || "Indonesia — Remote"}</p>
              <p className="mt-6 whitespace-pre-wrap text-[17px] leading-relaxed text-black/70">
                {profile?.longBio || profile?.shortBio || "I build full-stack products where engineering and design are not separate phases — they are the same craft."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {profile?.githubUrl && <Link href={profile.githubUrl} target="_blank" className="rounded-full border border-black/10 px-5 py-2 font-mono text-xs hover:border-gold">GitHub →</Link>}
                {profile?.linkedinUrl && <Link href={profile.linkedinUrl} target="_blank" className="rounded-full border border-black/10 px-5 py-2 font-mono text-xs hover:border-gold">LinkedIn →</Link>}
                <Link href="/#contact" className="rounded-full bg-[#0A0A0A] px-6 py-2.5 text-sm font-medium text-white hover:bg-black/80">Let&apos;s Talk</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
