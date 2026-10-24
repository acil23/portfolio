"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Prof = {
  displayName: string;
  longBio: string | null;
  shortBio: string;
  location: string | null;
  avatarMedia?: { url: string } | null;
} | null;

export function Philosophy({ profile }: { profile: Prof }) {
  const initial = profile?.displayName ? profile.displayName.trim()[0]?.toUpperCase() + "." : "JN.";
  const bio1 =
    profile?.longBio ||
    "I architect digital experiences where WebGL aesthetics, fluid motion, and resilient full-stack engineering converge. Every shader, API boundary, and micro-interaction is tuned for 60 FPS precision.";
  const avatarUrl = profile?.avatarMedia?.url;

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#060609] px-6 py-24 text-white md:px-10 md:py-32"
    >
      <div className="hud-grid-overlay pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-[#e5c168]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[1380px]">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          {/* Left Column: Editorial Narrative & Telemetry */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]" />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#f5d782]">
                03 // PHILOSOPHY &amp; ARCHITECTURE
              </p>
            </div>

            <h2 className="mt-4 font-display text-[clamp(36px,5.2vw,64px)] font-light leading-[0.94] tracking-[-0.02em] text-white">
              Precision over noise —{" "}
              <span className="text-holographic-chrome font-normal">obsidian &amp; gold</span>{" "}
              craftsmanship.
            </h2>

            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/70">{bio1}</p>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                { k: "FRAME TARGET", v: "60 FPS" },
                { k: "ARCHITECTURE", v: "TYPE-SAFE" },
                { k: "RENDERING", v: "WEBGL + SSR" },
              ].map((stat) => (
                <div key={stat.k} className="glass-obsidian rounded-2xl p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">
                    {stat.k}
                  </p>
                  <p className="mt-1.5 font-mono text-base font-semibold tracking-[0.08em] text-[#f5d782]">
                    {stat.v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Obsidian Glassmorphic Identity Monolith */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="glass-obsidian-gold relative overflow-hidden rounded-[26px] p-6 sm:p-8"
          >
            <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
              <span>IDENTITY // VERIFIED</span>
              <span className="text-[#f5d782]">LOC: {profile?.location || "ID — GLOBAL"}</span>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.22)_0%,rgba(12,12,18,0.95)_80%)] flex items-center justify-center">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={profile?.displayName || "Aklein"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-metallic-gold font-display text-7xl font-semibold tracking-[-0.03em]">
                  {initial}
                </span>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08080c] via-transparent to-transparent" />
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="font-sans text-lg font-semibold uppercase tracking-[0.08em] text-white">
                  {profile?.displayName || "JUPRI NALDI"}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
                  {profile?.shortBio?.slice(0, 48) || "CREATIVE DEVELOPER & FULL-STACK ARCHITECT"}
                </p>
              </div>
              <span className="text-xl text-[#f5d782]">✦</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
