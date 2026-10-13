import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-6 text-center">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.03]" />
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">404 — Lost in the noir</p>
      <h1 className="font-display mt-4 text-[clamp(56px,14vw,160px)] font-[300] leading-none tracking-[-0.05em] text-white/10">404</h1>
      <p className="font-display -mt-4 text-2xl tracking-[-0.02em] text-white">Page not found.</p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/50">The page you seek has vanished into the dark — like a cut scene.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-medium text-black hover:bg-white/90">
          Back Home
        </Link>
        <Link href="/projects" className="inline-flex h-11 items-center rounded-full border border-white/15 px-6 font-mono text-xs uppercase tracking-[0.08em] text-white/70 hover:border-gold/50 hover:text-gold">
          Browse Projects →
        </Link>
      </div>
    </div>
  );
}
