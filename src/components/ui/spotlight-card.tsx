"use client";

import { useRef, useState } from "react";
import { cn } from "cn";

export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141414] transition-colors duration-500 hover:border-gold/20",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: active
            ? `radial-gradient(520px circle at ${pos.x}px ${pos.y}px, oklch(0.75 0.08 75 / 12%), transparent 70%)`
            : undefined,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
