import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0A0A0A]">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-8 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-2xl tracking-[-0.02em] text-foreground">
              AKLEIN<span className="text-gold">.</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Crafting digital experiences with precision and taste. Based in Indonesia — available worldwide.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Connect</p>
            <div className="flex gap-4 font-mono text-xs tracking-wide">
              <a href="mailto:hello@aklein.tech" className="text-foreground/70 hover:text-gold transition-colors">Email</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-gold transition-colors">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-gold transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="hairline-gold mt-10" />
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60">
          © {new Date().getFullYear()} Aklein. Built with obsession.
        </p>
      </div>
    </footer>
  );
}
