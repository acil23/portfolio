"use client";

import { cn } from "cn";

export type HoloArtVariant = "astral" | "torus" | "ore" | "wave";

/**
 * Bespoke high-definition SVG/Shader-style 3D Iridescent Chrome & Liquid Gold Renders
 * Matches the Astral Design (ringed planet), Chrome Lab (iridescent torus),
 * Virtual Ore (crystalline mineral), and Liquid Wave visuals in design_porto.jpeg.
 */
export function HolographicArt({
  variant,
  className,
  mini = false,
}: {
  variant: HoloArtVariant;
  className?: string;
  mini?: boolean;
}) {
  if (variant === "astral") {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden",
          !mini && "bg-[radial-gradient(circle_at_30%_25%,rgba(225,215,255,0.45)_0%,rgba(145,165,220,0.22)_42%,rgba(14,14,22,0.95)_100%)]",
          className
        )}
      >
        <svg
          viewBox="0 0 320 220"
          className="h-full w-full drop-shadow-[0_16px_32px_rgba(0,0,0,0.65)]"
          fill="none"
        >
          <defs>
            <radialGradient id="astralSphere" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="18%" stopColor="#a8f0ff" />
              <stop offset="38%" stopColor="#b388ff" />
              <stop offset="62%" stopColor="#ffd584" />
              <stop offset="82%" stopColor="#49d49d" />
              <stop offset="100%" stopColor="#161426" />
            </radialGradient>
            <linearGradient id="astralRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#d8b4fe" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#7dd3fc" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#fde68a" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="astralCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#09090f" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="160" cy="112" r="95" fill="url(#astralCoreGlow)" />

          {/* Back portion of orbital ring */}
          <ellipse
            cx="160"
            cy="114"
            rx="118"
            ry="34"
            transform="rotate(-18 160 114)"
            stroke="url(#astralRing)"
            strokeWidth="14"
            strokeOpacity="0.45"
          />

          {/* Main iridescent chrome sphere */}
          <circle cx="160" cy="110" r="56" fill="url(#astralSphere)" />
          {/* Inner specular chrome reflection */}
          <ellipse
            cx="144"
            cy="90"
            rx="34"
            ry="20"
            transform="rotate(-22 144 90)"
            fill="white"
            fillOpacity="0.48"
          />
          <circle
            cx="160"
            cy="110"
            r="55.5"
            stroke="white"
            strokeOpacity="0.45"
            strokeWidth="1"
          />

          {/* Front portion of holographic ring */}
          <path
            d="M 48 150 A 118 34 -18 0 0 272 78"
            stroke="url(#astralRing)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 44 152 A 122 36 -18 0 0 276 76"
            stroke="#ffffff"
            strokeOpacity="0.7"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (variant === "torus") {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden",
          !mini && "bg-[radial-gradient(circle_at_50%_30%,rgba(65,70,88,0.42)_0%,rgba(12,12,18,0.96)_78%)]",
          className
        )}
      >
        <svg
          viewBox="0 0 320 220"
          className="h-full w-full drop-shadow-[0_20px_36px_rgba(0,0,0,0.85)]"
          fill="none"
        >
          <defs>
            <linearGradient id="holoTorusMain" x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="18%" stopColor="#93c5fd" />
              <stop offset="36%" stopColor="#e879f9" />
              <stop offset="54%" stopColor="#6ee7b7" />
              <stop offset="74%" stopColor="#fde047" />
              <stop offset="90%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="holoTorusRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Outer chrome torus body */}
          <circle
            cx="160"
            cy="112"
            r="56"
            stroke="url(#holoTorusMain)"
            strokeWidth="34"
          />
          {/* Specular studio highlight */}
          <circle
            cx="160"
            cy="112"
            r="62"
            stroke="url(#holoTorusRim)"
            strokeWidth="4"
            strokeOpacity="0.85"
          />
          <circle
            cx="160"
            cy="112"
            r="44"
            stroke="#09090d"
            strokeWidth="5"
            strokeOpacity="0.7"
          />
          <path
            d="M 112 78 A 58 58 0 0 1 206 76"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />
        </svg>
      </div>
    );
  }

  if (variant === "ore") {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden",
          !mini && "bg-[radial-gradient(circle_at_55%_35%,rgba(88,65,120,0.28)_0%,rgba(10,10,15,0.96)_80%)]",
          className
        )}
      >
        <svg
          viewBox="0 0 320 220"
          className="h-full w-full drop-shadow-[0_20px_38px_rgba(0,0,0,0.85)]"
          fill="none"
        >
          <defs>
            <linearGradient id="orePoly1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="28%" stopColor="#c084fc" />
              <stop offset="58%" stopColor="#38bdf8" />
              <stop offset="82%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#18181b" />
            </linearGradient>
            <linearGradient id="orePoly2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="35%" stopColor="#f472b6" />
              <stop offset="70%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
            <linearGradient id="oreSpec" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Crystalline virtual ore facets */}
          <polygon
            points="160,34 218,58 242,115 206,174 122,180 82,126 104,62"
            fill="url(#orePoly1)"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.5"
          />
          <polygon
            points="160,34 218,58 178,112 104,62"
            fill="url(#oreSpec)"
            opacity="0.55"
          />
          <polygon
            points="178,112 242,115 206,174 122,180"
            fill="url(#orePoly2)"
            opacity="0.82"
          />
          <polyline
            points="104,62 178,112 206,174"
            stroke="white"
            strokeOpacity="0.65"
            strokeWidth="1.5"
          />
          <polyline
            points="160,34 178,112 122,180"
            stroke="white"
            strokeOpacity="0.4"
            strokeWidth="1.2"
          />
          <circle cx="178" cy="112" r="3" fill="white" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.22)_0%,rgba(10,10,14,0.96)_80%)]",
        className
      )}
    >
      <svg viewBox="0 0 320 220" className="h-full w-full" fill="none">
        <defs>
          <linearGradient id="chromeWave" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff7d6" />
            <stop offset="40%" stopColor="#d4af37" />
            <stop offset="75%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>
        </defs>
        <path
          d="M 20 150 Q 95 45, 165 115 T 300 75"
          stroke="url(#chromeWave)"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <path
          d="M 40 170 Q 115 75, 185 135 T 290 105"
          stroke="white"
          strokeOpacity="0.45"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

