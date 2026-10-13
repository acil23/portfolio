"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";

type Prof = {
  displayName: string;
  longBio: string | null;
  shortBio: string;
  location: string | null;
  avatarMedia?: { url: string } | null;
} | null;

export function Philosophy({ profile }: { profile: Prof }) {
  const initial = profile?.displayName ? profile.displayName.trim()[0]?.toUpperCase() + "." : "A.";
  const bio1 = profile?.longBio || "I build full-stack products where engineering and design are not separate phases — they are the same craft. Type-safe, fast, and maintainable, but also warm and human where it counts.";
  const avatarUrl = profile?.avatarMedia?.url;
  return (
    <section id="about" className="bg-[#FDFCFB] px-6 py-24 text-[#0A0A0A] md:px-8 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <SectionHeader
            overline="Philosophy"
            title="Precision over noise — taste over trends."
            description="I care about the last 5%. The spacing, the timing, the copy — the details that make a product feel inevitable."
          />
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-black/10 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-[#0A0A0A] to-[#2A2A2A] flex items-center justify-center">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={profile?.displayName || "Aklein"} fill className="object-cover" />
              ) : (
                <span className="font-display text-5xl tracking-[-0.04em] text-white/90">{initial}</span>
              )}
            </div>
            <p className="font-mono mt-4 text-[10px] uppercase tracking-[0.12em] text-black/40">
              {profile?.displayName || "Aklein"} — {profile?.shortBio?.slice(0, 44) || "Full-Stack Developer · Indonesia"}
            </p>
            {profile?.location && <p className="font-mono mt-1 text-[10px] uppercase tracking-[0.1em] text-black/30">{profile.location}</p>}
          </motion.div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <p className="text-[17px] leading-relaxed text-black/70">{bio1}</p>
          <p className="text-[17px] leading-relaxed text-black/70">
            If your team values clean architecture, boundary validation, and a portfolio that actually reflects taste — we should talk.
          </p>
        </div>
      </div>
    </section>
  );
}
