"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";

export function ContactCta() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = json?.message || json?.issues ? JSON.stringify(json.issues) : "Failed to send";
        throw new Error(msg);
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section id="contact" className="bg-[#0A0A0A] px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#141414] px-8 py-12 md:px-12 md:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-[80px]" />
          <SectionHeader
            overline="Contact"
            title="Let's build something — remarkable."
            description="Have a role, a product, or a wild idea? I reply within 24 hours. No recruiters spam — just real work."
          />
          <form onSubmit={onSubmit} className="mt-10 grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                placeholder="Ada Lovelace"
                className="border-b border-white/15 bg-transparent py-3 text-sm text-foreground placeholder:text-white/30 focus:border-gold focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                placeholder="ada@company.com"
                className="border-b border-white/15 bg-transparent py-3 text-sm text-foreground placeholder:text-white/30 focus:border-gold focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
                maxLength={5000}
                placeholder="Tell me about the opportunity..."
                rows={4}
                className="resize-none border-b border-white/15 bg-transparent py-3 text-sm text-foreground placeholder:text-white/30 focus:border-gold focus:outline-none"
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
              >
                {status === "loading" ? "Sending..." : status === "success" ? "Sent ✓" : "Send Inquiry →"}
              </button>
              {status === "success" && <p className="mt-3 font-mono text-[11px] text-green-400">Message sent — I&apos;ll reply within 24h.</p>}
              {status === "error" && <p className="mt-3 font-mono text-[11px] text-red-400">{errorMsg}</p>}
              {status === "idle" && <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground/60">Posts to POST /api/contact — saved to dashboard inbox.</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
