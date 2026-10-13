"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";

type HeroProfile = {
  displayName: string;
  headline: string;
  shortBio: string;
  location?: string | null;
  heroCtaPrimaryLabel?: string | null;
  heroCtaPrimaryHref?: string | null;
  heroCtaSecondaryLabel?: string | null;
  heroCtaSecondaryHref?: string | null;
} | null;

export function Hero({ profile }: { profile: HeroProfile }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const watermark = profile?.displayName ? profile.displayName.replace(/\s+/g, "").toUpperCase().slice(0, 8) : "AKLEIN";
  const overline = profile?.location ? `${profile.location} — Available 2026` : "Available for new opportunities — 2026";

  // Headline: if custom, render as-is with gold accent on second word; fallback to crafted narrative
  const headlineNode = profile?.headline ? (
    <>{profile.headline}</>
  ) : (
    <>
      Ideas <span className="font-[400] italic text-gold">crafted</span> into
      <br />
      digital reality.
    </>
  );

  const ctaPrimaryLabel = profile?.heroCtaPrimaryLabel || "View Selected Works";
  const ctaPrimaryHref = profile?.heroCtaPrimaryHref || "/#work";
  const ctaSecondaryLabel = profile?.heroCtaSecondaryLabel || "Let's Talk →";
  const ctaSecondaryHref = profile?.heroCtaSecondaryHref || "/#contact";

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0A0A0A]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-[520px] w-[680px] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute -left-40 bottom-0 h-[480px] w-[560px] rounded-full bg-white/[0.04] blur-[100px]" />
      </div>
      <div className="grain pointer-events-none absolute inset-0" />

      <motion.div style={{ y, opacity }} className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span className="font-display select-none whitespace-nowrap text-[22vw] font-[300] leading-none tracking-[-0.05em] text-white/[0.04]">
          {watermark}
        </span>
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col px-6 pb-16 pt-28 md:px-8 md:pb-20 md:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold"
        >
          {overline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-display mt-6 max-w-4xl text-balance text-[clamp(42px,8vw,96px)] font-[300] leading-[0.88] tracking-[-0.04em] text-foreground"
        >
          {headlineNode}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground"
        >
          {profile?.shortBio || (
            <>
              Full-Stack Developer — Next.js, TypeScript, Prisma & Supabase.
              <br className="hidden sm:block" /> I build products that feel as good as they perform.
            </>
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticButton href={ctaPrimaryHref}>{ctaPrimaryLabel}</MagneticButton>
          <MagneticButton href={ctaSecondaryHref} variant="ghost">{ctaSecondaryLabel}</MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-auto flex items-center gap-3 pt-16 text-muted-foreground"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.16em]">Scroll</span>
          <span className="h-px w-12 bg-white/15" />
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="inline-block h-6 w-px bg-gold/60"
          />
        </motion.div>
      </div>
    </section>
  );
}
