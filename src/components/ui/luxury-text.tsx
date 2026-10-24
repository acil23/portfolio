"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "cn";

type LuxuryTextProps = {
  text: string;
  className?: string;
  charClassName?: string;
  variant?: "gold" | "chrome" | "default";
};

/**
 * Interactive character-by-character luxury hover effect with metallic/holographic specular lift.
 */
export function LuxuryText({
  text,
  className,
  charClassName,
  variant = "default",
}: LuxuryTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <span
      className={cn("inline-flex flex-wrap items-baseline select-none", className)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {text.split("").map((char, idx) => {
        const isSpace = char === " ";
        const dist = hoveredIndex === null ? 99 : Math.abs(idx - hoveredIndex);
        const isHovered = dist === 0;
        const isNeighbor = dist === 1;

        return (
          <motion.span
            key={`${char}-${idx}`}
            onMouseEnter={() => setHoveredIndex(idx)}
            animate={{
              y: isHovered ? -5 : isNeighbor ? -2 : 0,
              scale: isHovered ? 1.07 : isNeighbor ? 1.02 : 1,
              filter: isHovered
                ? variant === "chrome"
                  ? "drop-shadow(0 0 18px rgba(185, 230, 255, 0.75)) brightness(1.22)"
                  : "drop-shadow(0 0 18px rgba(235, 200, 115, 0.75)) brightness(1.2)"
                : "drop-shadow(0 0 0px rgba(0,0,0,0)) brightness(1)",
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 22,
              mass: 0.4,
            }}
            className={cn(
              "inline-block transition-colors duration-200 will-change-transform",
              isSpace && "w-[0.28em]",
              charClassName
            )}
          >
            {isSpace ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </span>
  );
}

