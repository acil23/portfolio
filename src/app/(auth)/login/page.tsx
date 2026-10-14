"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
export default function LoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fallbackError = searchParams.get("error") === "forbidden" ? "Access denied." : null;
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { setError((body as { message?: string })?.message || "Invalid email or password."); return; }
      // Cookie is httpOnly — must hard-navigate so browser sends it and middleware/layout re-reads it
      const next = searchParams.get("next") || "/dashboard";
      window.location.assign(next);
    } catch { setError("Login failed. Try again."); } finally { setIsSubmitting(false); }
  }
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4 py-12">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.06] via-transparent to-transparent" />
      <div className="relative w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-[22px] tracking-[-0.02em] text-white">AKLEIN<span className="text-gold">.</span></Link>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">Content Studio — Admin Access</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">Sign in</p>
          <h1 className="font-display mt-2 text-[26px] tracking-[-0.02em] text-white">Welcome back.</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/50">Manage projects, skills, and inbox.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@aklein.tech" className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold/40" autoComplete="email" required />
            </label>
            <label className="block space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold/40" autoComplete="current-password" required />
            </label>
            {(error || fallbackError) && <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error ?? fallbackError}</p>}
            <button type="submit" disabled={isSubmitting} className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-60">{isSubmitting ? "Signing in..." : "Sign in →"}</button>
          </form>
          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.08em] text-white/25"><Link href="/" className="hover:text-gold">← Back to site</Link></p>
        </div>
      </div>
    </div>
  );
}
