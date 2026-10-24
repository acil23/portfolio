"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { LiquidGoldOrb, type OrbTelemetry } from "@/components/three/liquid-gold-orb";
import { HolographicArt, type HoloArtVariant } from "@/components/ui/holographic-art";
import { LuxuryText } from "@/components/ui/luxury-text";

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

type HeroProjectCard = {
  slug: string;
  title: string;
  summary: string;
  tags: { id: string; name: string }[];
  projectImages: { url: string; alt: string | null }[];
};

type ShowcaseItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  variant: HoloArtVariant;
  coverUrl?: string;
  featured?: boolean;
};

const DEFAULT_SHOWCASE: ShowcaseItem[] = [
  {
    id: "lunar-chrome",
    title: "LUNAR FLUX",
    subtitle: "WEBGL SHADERS",
    href: "/#work",
    variant: "wave",
  },
  {
    id: "astral-design",
    title: "ASTRAL DESIGN",
    subtitle: "3D DIRECTION",
    href: "/#work",
    variant: "astral",
  },
  {
    id: "chrome-lab",
    title: "CHROME LAB",
    subtitle: "3D DESIGN",
    href: "/#work",
    variant: "torus",
    featured: true,
  },
  {
    id: "virtual-ore",
    title: "VIRTUAL ORE",
    subtitle: "3D RENDERS",
    href: "/#work",
    variant: "ore",
  },
  {
    id: "relic-engine",
    title: "RELIC ENGINE",
    subtitle: "MATERIAL LAB",
    href: "/#work",
    variant: "wave",
  },
];

export function Hero({
  profile,
  projects = [],
}: {
  profile: HeroProfile;
  projects?: HeroProjectCard[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 65]);

  // Interactive HUD state
  const [telemetry, setTelemetry] = useState<OrbTelemetry>({
    rotX: 0.45,
    rotY: -0.22,
    vel: 0.004,
    fps: 60,
    webglActive: true,
  });
  const [cursorCoords, setCursorCoords] = useState({ x: 0.42, y: 0.58 });
  const [activeSection, setActiveSection] = useState<"01" | "02" | "03">("01");
  const [audioActive, setAudioActive] = useState(true);
  const [knob1Angle, setKnob1Angle] = useState(42); // Controls Liquid Morph
  const [knob2Angle, setKnob2Angle] = useState(-28); // Controls Orbit Speed
  const [activeCardIdx, setActiveCardIdx] = useState(2);

  // Optional Web Audio synthesizer for interactive HUD audio wave
  const audioCtxRef = useRef<AudioContext | null>(null);

  const toggleAudioWave = () => {
    const next = !audioActive;
    setAudioActive(next);
    try {
      if (next) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = audioCtxRef.current || new AudioCtx();
          audioCtxRef.current = ctx;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.18);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.24);
        }
      }
    } catch {
      // Ignore if browser blocks audio before interaction
    }
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursorCoords({
        x: e.clientX / Math.max(1, window.innerWidth),
        y: e.clientY / Math.max(1, window.innerHeight),
      });
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 600) setActiveSection("01");
      else if (y < 1600) setActiveSection("02");
      else setActiveSection("03");
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleTelemetry = useCallback((data: OrbTelemetry) => {
    setTelemetry(data);
  }, []);

  // Split display name into Left (Gold Serif) and Right (Holographic Chrome Sans)
  const rawName = (profile?.displayName || "JUPRI NALDI").trim().toUpperCase();
  const nameParts = rawName.split(/\s+/);
  const firstName = nameParts[0] || "JUPRI";
  const secondName = nameParts.slice(1).join(" ") || "NALDI";

  // Build 5-card bottom floating dock combining real projects (if any) with the holographic showcase
  const showcaseItems: ShowcaseItem[] = DEFAULT_SHOWCASE.map((item, idx) => {
    const projIdx = idx - 1;
    const realProj = projIdx >= 0 && projIdx < projects.length ? projects[projIdx] : null;
    if (!realProj) return item;
    return {
      id: realProj.slug,
      title: realProj.title.toUpperCase(),
      subtitle: (realProj.tags[0]?.name || item.subtitle).toUpperCase(),
      href: `/projects/${realProj.slug}`,
      variant: item.variant,
      coverUrl: realProj.projectImages[0]?.url,
      featured: idx === 2,
    };
  });

  // Live formatted coordinates for HUD
  const coordMain = (12.4796 + cursorCoords.x * 0.42 + telemetry.rotX * 0.08).toFixed(4);
  const coordH1 = (2.704683 + cursorCoords.y * 0.15).toFixed(6);
  const coordH2 = (1.25926 + Math.abs(telemetry.rotY) * 0.22).toFixed(5);
  const coordL = (3.36489 + telemetry.vel * 12).toFixed(5);
  const coordRight = (0.942885 + cursorCoords.x * 0.05).toFixed(6);

  const morphIntensity = Math.max(0.35, Math.min(2.0, 1 + knob1Angle / 90));
  const orbitSpeed = Math.max(0.3, Math.min(2.2, 1 + knob2Angle / 80));

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[#060609] pt-24 pb-6 select-none"
    >
      {/* Subtle Obsidian Radial Vignette & Technical Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_42%,rgba(212,175,55,0.09)_0%,rgba(20,24,38,0.18)_45%,rgba(5,5,8,0.98)_100%)]" />
      <div className="hud-grid-overlay pointer-events-none absolute inset-0 opacity-45" />
      <div className="grain pointer-events-none absolute inset-0" />

      {/* ═══════════════════════════════════════════════════════════════════
          LEFT VERTICAL HUD — METALLIC BADGE, RUNNING COORDINATES & TIMELINE
         ═══════════════════════════════════════════════════════════════════ */}
      <aside
        aria-label="HUD Section Timeline & Coordinates"
        className="pointer-events-auto absolute left-5 top-28 bottom-56 z-30 hidden xl:flex flex-col justify-between"
      >
        <div className="flex flex-col items-start gap-5">
          {/* Metallic Pill Badge */}
          <div className="flex items-center gap-4">
            <span className="h-2 w-2 rounded-full bg-white/40" />
            <button
              type="button"
              onClick={() => setKnob1Angle((a) => (a > 80 ? -30 : a + 35))}
              title="Cycle Metallic Shader Displacement"
              className="rounded-[5px] border border-white/40 bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-950 shadow-[0_4px_16px_rgba(255,255,255,0.18),inset_0_1px_0_#fff] transition-transform hover:scale-105 active:scale-95"
            >
              METALLIC
            </button>
          </div>

          {/* Running Ratio Readout */}
          <div className="pl-6 font-mono text-[10px] leading-[1.45] tracking-[0.12em] text-white/40">
            <p>{(551.18 + cursorCoords.x * 0.8).toFixed(2)}:1</p>
            <p>{(28.888 + cursorCoords.y * 0.11).toFixed(3)}</p>
          </div>
        </div>

        {/* Vertical Timeline Rail (01 HERO, 02 WORKS, 03 ABOUT) */}
        <div className="relative flex flex-col gap-12 pl-6">
          {/* Continuous vertical hairline */}
          <div className="pointer-events-none absolute left-[3px] -top-16 -bottom-16 w-px bg-gradient-to-b from-white/20 via-[#e5c168]/40 to-white/15" />

          {[
            { id: "01", label: "HERO", href: "#" },
            { id: "02", label: "WORKS", href: "#work" },
            { id: "03", label: "ABOUT", href: "#about" },
          ].map((node) => {
            const isActive = activeSection === node.id;
            return (
              <a
                key={node.id}
                href={node.href}
                onClick={() => setActiveSection(node.id as "01" | "02" | "03")}
                className="group relative flex items-center gap-4"
              >
                {/* Node Circle on Vertical Line */}
                <span className=" -ml-[29px] relative flex h-7 w-7 items-center justify-center">
                  {isActive ? (
                    <>
                      <span className="absolute inset-0 rounded-full border border-[#f5d782]/80 bg-[#e5c168]/20 shadow-[0_0_22px_rgba(245,215,130,0.85)]" />
                      <span className="relative h-2.5 w-2.5 rounded-full bg-[#fff5d6] shadow-[0_0_10px_#fff]" />
                    </>
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-[#08080c] transition-colors group-hover:border-[#e5c168]/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/40 group-hover:bg-[#e5c168]" />
                    </span>
                  )}
                </span>

                <div className="font-mono text-[11px] leading-[1.25] tracking-[0.16em] uppercase">
                  <p className={isActive ? "text-[#f5d782] font-semibold" : "text-white/45 group-hover:text-white/80"}>
                    {node.id}
                  </p>
                  <p className={isActive ? "text-[#f5d782]" : "text-white/45 group-hover:text-white/80"}>
                    {node.label}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Bottom Left Rail Readout */}
        <div className="relative pl-6 font-mono text-[10px] leading-[1.4] tracking-[0.12em] text-white/35">
          <span className="absolute left-0 bottom-0 h-2 w-2 rounded-full bg-white/30" />
          <p>1.101</p>
          <p>2085</p>
        </div>
      </aside>

      {/* Lower-Left Floating Coordinate Telemetry Block (Matches design_porto.jpeg) */}
      <div className="pointer-events-none absolute left-32 bottom-[250px] z-20 hidden xl:block font-mono text-[10px] leading-[1.55] tracking-[0.14em] text-white/45">
        <div className="mb-2 flex items-center gap-2 text-white/65">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80]" />
          <span>+ {coordMain}</span>
        </div>
        <p>H +{coordH1}</p>
        <p>H +{coordH2}</p>
        <p>L +{coordL}</p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          RIGHT VERTICAL HUD — AUDIO WAVE, FPS, WEBGL, SOCIALS & ROTARY DIALS
         ═══════════════════════════════════════════════════════════════════ */}
      <aside
        aria-label="HUD Audio Telemetry & Shader Controls"
        className="pointer-events-auto absolute right-6 top-28 bottom-56 z-30 hidden xl:flex flex-col items-end justify-between"
      >
        {/* Dual Audio Waveform Visualizers */}
        <div className="flex flex-col items-end gap-4">
          <button
            type="button"
            onClick={toggleAudioWave}
            title="Toggle Ambient Harmonic Synth & Audio Telemetry"
            className="group flex flex-col gap-3 rounded-lg p-1.5 transition-opacity hover:opacity-95"
          >
            {[0, 1].map((row) => (
              <div key={row} className="flex h-7 items-center gap-[3px]">
                {[3, 6, 12, 8, 18, 24, 14, 9, 26, 20, 11, 16, 22, 10, 6, 13, 7, 4, 2].map(
                  (baseH, bIdx) => (
                    <motion.span
                      key={bIdx}
                      animate={{
                        height: audioActive
                          ? [
                              `${Math.max(3, baseH * 0.55)}px`,
                              `${Math.min(28, baseH * 1.15)}px`,
                              `${Math.max(3, baseH * 0.45)}px`,
                            ]
                          : "3px",
                      }}
                      transition={{
                        duration: 0.9 + (bIdx % 5) * 0.18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: bIdx * 0.04 + row * 0.15,
                      }}
                      className="w-[2px] rounded-full bg-white/55 group-hover:bg-[#f5d782]"
                    />
                  )
                )}
              </div>
            ))}
          </button>

          {/* Frequency Buffer Bar (0  250  1800) */}
          <div className="w-28">
            <div className="h-2.5 w-full overflow-hidden rounded-[3px] border border-white/15 bg-white/[0.04] p-[1px]">
              <motion.div
                animate={{
                  width: [`${42 + cursorCoords.x * 25}%`, `${58 + cursorCoords.y * 20}%`],
                }}
                transition={{ duration: 1.4, repeat: Infinity, repeatType: "mirror" }}
                className="h-full rounded-[2px] bg-gradient-to-r from-[#d8f3ff] via-[#a5f3fc] to-transparent shadow-[0_0_10px_#a5f3fc]"
              />
            </div>
            <div className="mt-1 flex justify-between font-mono text-[8px] tracking-[0.1em] text-white/40">
              <span>0</span>
              <span>250</span>
              <span>1800</span>
            </div>
          </div>

          {/* Live FPS & WebGL Readout */}
          <div className="mt-1 w-28 space-y-1 font-mono text-[12px] tracking-[0.12em] text-white/65">
            <div className="flex justify-between">
              <span>FPS:</span>
              <span className="text-white/90">{telemetry.fps}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>WebGL:</span>
              <span className="text-[#f5d782]">{telemetry.webglActive ? "ON" : "SIM"}</span>
            </div>
          </div>

          {/* 2x2 Minimalist Social / Lab Matrix */}
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-white/50">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub / Discord"
              className="transition-colors hover:text-[#f5d782]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.02.06.03.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-[#f5d782]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
            <Link
              href="/#lab"
              aria-label="Shader Lab"
              className="font-mono text-[13px] font-bold leading-none transition-colors hover:text-[#f5d782]"
            >
              F<span className="text-[10px]">=</span>
            </Link>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              className="transition-colors hover:text-[#f5d782]"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Two Interactive Brushed-Metal Rotary Knobs (Modulate 3D Shader) */}
        <div className="flex flex-col items-center gap-4 pt-4">
          {[
            {
              angle: knob1Angle,
              setAngle: setKnob1Angle,
              label: "Liquid Gold Morph Dial",
            },
            {
              angle: knob2Angle,
              setAngle: setKnob2Angle,
              label: "Orbital Velocity Dial",
            },
          ].map((knob, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={knob.label}
              title={`${knob.label} — Click to modulate 3D shader`}
              onClick={() => knob.setAngle((a) => ((a + 45 + 180) % 360) - 180)}
              className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#0b0b10] p-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.85)] transition-transform hover:scale-105 active:scale-95"
            >
              {/* Golden Rim Arc Indicator */}
              <span className="pointer-events-none absolute -inset-[2px] rounded-full border border-transparent border-b-[#e5c168]/70 border-l-[#e5c168]/40 opacity-80 transition-opacity group-hover:opacity-100" />
              <div
                style={{ transform: `rotate(${knob.angle}deg)` }}
                className="rotary-knob-surface relative h-full w-full rounded-full border border-white/30 transition-transform duration-500 ease-out"
              >
                <span className="absolute left-1/2 top-1.5 h-2 w-[2px] -translate-x-1/2 rounded-full bg-[#09090d]" />
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Lower-Right Floating Coordinate Telemetry */}
      <div className="pointer-events-none absolute right-28 bottom-[250px] z-20 hidden xl:block text-right font-mono text-[10px] leading-[1.55] tracking-[0.14em] text-white/45">
        <p>+L.{coordRight}</p>
        <p>++3.000000</p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CENTERPIECE — GIANT METALLIC/CHROME TITLE & 3D LIQUID GOLD ORB
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative mx-auto flex w-full max-w-[1380px] flex-1 flex-col items-center justify-center px-4 pt-2 md:px-8">
        {/* Top Overline Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 flex flex-wrap items-center justify-center gap-2 text-center font-sans text-[11px] sm:text-[13px] md:text-[15px] font-medium uppercase tracking-[0.26em]"
        >
          <span className="text-[#f5d98e]">{rawName}</span>
          <span className="text-white/40">•</span>
          <span className="text-white/65">
            {profile?.headline
              ? profile.headline.toUpperCase().slice(0, 42)
              : "CREATIVE DEVELOPER & 3D ARCHITECT"}
          </span>
        </motion.div>

        {/* Giant Split Typography: Metallic Gold Serif (Left) • Iridescent Chrome Sans (Right) */}
        <motion.div
          style={{ y: titleY }}
          initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative z-10 mt-1 flex flex-col items-center w-full"
        >
          <h1 className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 text-center leading-[0.88]">
            <LuxuryText
              text={firstName}
              variant="gold"
              className="font-display text-[clamp(48px,9.2vw,134px)] font-semibold tracking-[0.02em]"
              charClassName="text-metallic-gold"
            />
            <span className="inline-block h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-gradient-to-br from-white via-[#f5d782] to-white/50 shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
            <LuxuryText
              text={secondName}
              variant="chrome"
              className="font-sans text-[clamp(44px,8.5vw,124px)] font-light tracking-[0.05em]"
              charClassName="text-holographic-chrome"
            />
          </h1>

          {/* Micro-Typography Right Sub-Caption */}
          <div className="mt-1 flex w-full max-w-[980px] justify-end pr-4 sm:pr-12">
            <p className="text-right font-mono text-[9px] sm:text-[10px] leading-[1.4] uppercase tracking-[0.18em] text-white/45">
              MICRO-TYPOGRAPHIES
              <br />&amp; SHADERS
            </p>
          </div>
        </motion.div>

        {/* 3D Interactive Liquid Gold & Chrome Sculpture overlapping the giant title */}
        <motion.div
          style={{ y: orbY }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
          className="relative z-20 -mt-12 sm:-mt-20 md:-mt-28 flex items-center justify-center"
        >
          {/* Left "DRAG TO ROTATE" HUD Indicator */}
          <div className="pointer-events-none hidden md:flex items-center gap-3 mr-2 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-[#e5c168]/75">
            <span>DRAG TO ROTATE</span>
            <svg className="h-8 w-6 text-white/35" viewBox="0 0 24 36" fill="none">
              <path
                d="M18 4 C 8 12, 8 24, 18 32"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <path d="M15 2 L19 4 L16 8" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          <LiquidGoldOrb
            morphIntensity={morphIntensity}
            orbitSpeed={orbitSpeed}
            onTelemetry={handleTelemetry}
          />

          {/* Right "DRAG TO ROTATE" HUD Indicator */}
          <div className="pointer-events-none hidden md:flex items-center gap-3 ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#e5c168]/75">
            <svg className="h-8 w-6 text-white/35" viewBox="0 0 24 36" fill="none">
              <path
                d="M6 4 C 16 12, 16 24, 6 32"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <path d="M9 30 L5 32 L8 28" stroke="currentColor" strokeWidth="1" />
            </svg>
            <span>DRAG TO ROTATE</span>
          </div>
        </motion.div>

        {/* SCROLL TO EXPLORE prompt directly below the 3D Orb */}
        <motion.a
          href="#work"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="relative z-30 -mt-4 mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[#e5c168]/85 transition-colors hover:text-[#fff4cc]"
        >
          SCROLL TO EXPLORE
        </motion.a>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM FLOATING GLASSMORPHISM PROJECT SHOWCASE DOCK
          (Matches Astral Design / Chrome Lab / Virtual Ore in design_porto.jpeg)
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative z-30 mx-auto w-full max-w-[1520px] px-3 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-[0.42fr_1fr_1.08fr_1fr_0.42fr] items-end">
          {showcaseItems.map((card, idx) => {
            const isEdge = idx === 0 || idx === 4;
            const isCenter = activeCardIdx === idx;

            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => setActiveCardIdx(idx)}
                initial={{ opacity: 0, y: 36 }}
                animate={{
                  opacity: isEdge ? 0.65 : 1,
                  y: isCenter ? -10 : 0,
                }}
                whileHover={{
                  y: -14,
                  scale: 1.015,
                  opacity: 1,
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={isEdge ? "hidden lg:block" : "block"}
              >
                <Link
                  href={card.href}
                  className={`group relative block overflow-hidden rounded-[22px] transition-all duration-500 ${
                    isCenter ? "glass-obsidian-gold" : "glass-obsidian hover:border-white/25"
                  }`}
                >
                  {/* Top Specular Golden / Holographic Rim Highlight */}
                  {isCenter && (
                    <div className="pointer-events-none absolute inset-x-10 top-0 z-20 h-[2px] bg-gradient-to-r from-transparent via-[#fff2ba] to-transparent shadow-[0_0_20px_#f5d782]" />
                  )}

                  {/* Card Visual Stage */}
                  <div className="relative h-[168px] sm:h-[184px] w-full overflow-hidden">
                    {card.coverUrl ? (
                      <Image
                        src={card.coverUrl}
                        alt={card.title}
                        fill
                        className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <HolographicArt
                        variant={card.variant}
                        className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    {/* Floating Mini Picture-in-Picture Glass Preview Badge (Top-Right) */}
                    {!isEdge && (
                      <div className="absolute right-3.5 top-3.5 z-20 h-12 w-16 overflow-hidden rounded-xl border border-white/30 bg-white/10 p-1 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] transition-transform duration-300 group-hover:scale-105">
                        <HolographicArt variant={card.variant} mini className="h-full w-full" />
                      </div>
                    )}

                    {/* Bottom Glass Vignette for Title Readability */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#08080c] via-[#08080c]/75 to-transparent" />
                  </div>

                  {/* Card Footer Metadata + Four-Point Golden Star ✦ */}
                  <div className="relative z-10 flex items-end justify-between px-5 pb-4 pt-1">
                    <div className="min-w-0">
                      <h3 className="truncate font-sans text-[17px] sm:text-[19px] font-semibold uppercase tracking-[0.06em] text-white group-hover:text-[#fff6d6]">
                        {card.title}
                      </h3>
                      <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                        {card.subtitle}
                      </p>
                    </div>

                    {/* Signature 4-Point Golden Star Icon */}
                    <span className="ml-3 inline-flex h-6 w-6 shrink-0 items-center justify-center text-[#f0cb6e] transition-transform duration-500 group-hover:rotate-90 group-hover:scale-125">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 drop-shadow-[0_0_8px_rgba(240,203,110,0.8)]" fill="currentColor">
                        <path d="M12 1 L14.4 9.6 L23 12 L14.4 14.4 L12 23 L9.6 14.4 L1 12 L9.6 9.6 Z" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
