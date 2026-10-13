"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "cn";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  external?: boolean;
};

export function MagneticButton({ href, children, variant = "primary", className, external }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist < 120) {
      x.set(dx * 0.25);
      y.set(dy * 0.35);
    } else {
      x.set(0);
      y.set(0);
    }
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const base = "group inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-medium transition-colors";
  const variants = {
    primary: "bg-foreground text-background hover:bg-foreground/90",
    ghost: "border border-white/15 text-foreground hover:border-gold/50 hover:text-gold bg-transparent",
  } as const;

  const inner = (
    <>
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  );

  return (
    <motion.div style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">
      <Link
        ref={ref}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cn(base, variants[variant], className)}
      >
        {inner}
      </Link>
    </motion.div>
  );
}
