"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "cn";

const NAV_LINKS = [
  { href: "/#work", match: "work", label: "WORK" },
  { href: "/#experience", match: "experience", label: "EXPERIENCE" },
  { href: "/#lab", match: "lab", label: "LAB" },
  { href: "/#about", match: "about", label: "ABOUT" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("work");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const y = window.scrollY;
      if (y < 600) setActiveTab("work");
      else if (y < 1550) setActiveTab("work");
      else if (y < 2350) setActiveTab("about");
      else if (y < 3100) setActiveTab("experience");
      else setActiveTab("lab");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#060609]/75 py-3 backdrop-blur-2xl border-b border-white/[0.06]"
          : "bg-transparent py-5"
      )}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 md:px-10">
        {/* Left: Metallic Gold Brand Wordmark */}
        <Link
          href="/"
          aria-label="AKLEIN — Home"
          className="group flex items-center gap-2.5"
        >
          <span className="text-metallic-gold font-sans text-[19px] font-medium tracking-[0.22em] uppercase transition-transform duration-300 group-hover:scale-[1.02]">
            AKLEIN
          </span>
        </Link>

        {/* Center: Floating Glassmorphism Pill Navigation (Matches design_porto.jpeg) */}
        <div className="hidden md:flex items-center rounded-full border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-6 py-2 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.22)]">
          <Link
            href="/"
            className="mr-7 font-sans text-[16px] font-semibold tracking-[-0.02em] text-white/95 transition-opacity hover:opacity-80"
          >
            JN<span className="text-[#4ade80]">.</span>
          </Link>

          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive =
                activeTab === link.match ||
                (pathname !== "/" && pathname.includes(link.match));

              return (
                <li key={link.href} className="relative py-1">
                  <Link
                    href={link.href}
                    onClick={() => setActiveTab(link.match)}
                    className={cn(
                      "relative font-mono text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-300",
                      isActive
                        ? "text-white drop-shadow-[0_0_10px_rgba(255,235,175,0.65)]"
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>

                  {isActive && (
                    <>
                      {/* Top golden light bar */}
                      <motion.span
                        layoutId="nav-pill-top-glow"
                        className="pointer-events-none absolute -top-[9px] inset-x-[-6px] h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#f5d782] to-transparent shadow-[0_2px_12px_rgba(245,215,130,0.9)]"
                      />
                      {/* Bottom golden light bar */}
                      <motion.span
                        layoutId="nav-pill-bottom-glow"
                        className="pointer-events-none absolute -bottom-[9px] inset-x-[-6px] h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#f5d782] to-transparent shadow-[0_-2px_12px_rgba(245,215,130,0.9)]"
                      />
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Available Status + Golden Glow Contact Button */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]" />
            </span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#4ade80]/90">
              AVAILABLE FOR COLLABORATION
            </span>
          </div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/#contact"
              className="group relative inline-flex h-10 items-center gap-2 rounded-full border border-[#e5c168]/60 bg-gradient-to-b from-[#e5c168]/15 to-[#0A0A0E]/90 px-5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-[#fff6d6] shadow-[0_0_24px_rgba(212,175,55,0.28),inset_0_1px_0_rgba(255,240,195,0.4)] transition-all duration-300 hover:border-[#ffe599] hover:shadow-[0_0_32px_rgba(212,175,55,0.48)]"
            >
              <span>CONTACT</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#f3d27a] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-foreground md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/10 bg-[#08080C]/95 px-6 py-6 backdrop-blur-2xl md:hidden"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#4ade80]">
                AVAILABLE FOR COLLABORATION
              </span>
            </div>
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-mono text-[13px] uppercase tracking-[0.16em] text-white/85 hover:text-[#f3d27a]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e5c168]/60 bg-[#e5c168]/15 px-5 font-mono text-[11px] uppercase tracking-[0.15em] text-[#fff6d6]"
                >
                  CONTACT <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
