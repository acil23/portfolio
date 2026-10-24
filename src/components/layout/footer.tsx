import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050508]">
      <div className="mx-auto max-w-[1380px] px-6 py-12 md:px-10 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-metallic-gold font-sans text-xl font-medium tracking-[0.22em] uppercase">
                AKLEIN
              </span>
              <span className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#4ade80]">
                WEBGL // 60 FPS
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
              High-end interactive 3D &amp; full-stack digital experiences. Crafted in obsidian,
              liquid gold, and holographic chrome.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f5d782]">
              NETWORK NODES
            </p>
            <div className="flex flex-wrap gap-6 font-mono text-xs uppercase tracking-[0.14em]">
              <a
                href="mailto:hello@aklein.tech"
                className="text-white/65 transition-colors hover:text-[#f5d782]"
              >
                Email
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/65 transition-colors hover:text-[#f5d782]"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/65 transition-colors hover:text-[#f5d782]"
              >
                LinkedIn
              </a>
              <Link
                href="/projects"
                className="text-white/65 transition-colors hover:text-[#f5d782]"
              >
                Archive
              </Link>
            </div>
          </div>
        </div>
        <div className="hairline-gold mt-10" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
          <p>© {new Date().getFullYear()} AKLEIN · JUPRI NALDI. ALL RIGHTS RESERVED.</p>
          <p>STATUS: NOMINAL // SHADER ENGINE v2.4</p>
        </div>
      </div>
    </footer>
  );
}
