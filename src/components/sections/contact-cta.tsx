"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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
        const msg =
          json?.message || (json?.issues ? JSON.stringify(json.issues) : "Failed to send");
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
    <section id="contact" className="relative overflow-hidden bg-[#060609] px-6 py-24 md:px-10 md:py-32">
      <div className="hud-grid-overlay pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-[1380px]">
        <div className="glass-obsidian-gold relative overflow-hidden rounded-[30px] px-8 py-12 md:px-14 md:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#e5c168]/15 blur-[100px]" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-[#93c5fd]/10 blur-[100px]" />

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]" />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#f5d782]">
                06 // DIRECT TRANSMISSION CHANNEL
              </p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
              RESPONSE SLA: &lt; 24 HOURS
            </span>
          </div>

          <h2 className="mt-6 font-display text-[clamp(34px,5vw,60px)] font-light leading-[0.95] tracking-[-0.02em] text-white">
            Initiate a <span className="text-metallic-gold italic">collaboration</span>.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/65">
            Have an ambitious product, interactive 3D showcase, or full-stack platform? Transmit
            your brief below.
          </p>

          <form onSubmit={onSubmit} className="mt-10 grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#f5d782]/80">
                01. IDENTIFIER / NAME
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                placeholder="Arthur Vane"
                className="rounded-xl border border-white/15 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-[#f5d782] focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#f5d782]/80">
                02. RETURN ADDRESS / EMAIL
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                placeholder="arthur@studio.com"
                className="rounded-xl border border-white/15 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-[#f5d782] focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#f5d782]/80">
                03. PROJECT PARAMETERS / MESSAGE
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
                maxLength={5000}
                placeholder="Tell me about the scope, timeline, and vision..."
                rows={4}
                className="resize-none rounded-xl border border-white/15 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-[#f5d782] focus:outline-none"
              />
            </label>

            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={status === "loading"}
                className="inline-flex h-12 items-center gap-2.5 rounded-full border border-[#f5d782]/70 bg-gradient-to-b from-[#f5d782]/25 to-[#09090d] px-8 font-mono text-xs font-medium uppercase tracking-[0.18em] text-[#fff6d6] shadow-[0_0_28px_rgba(212,175,55,0.3)] transition-all hover:border-[#fff2ba] hover:shadow-[0_0_36px_rgba(212,175,55,0.5)] disabled:opacity-60"
              >
                <span>
                  {status === "loading"
                    ? "TRANSMITTING..."
                    : status === "success"
                      ? "TRANSMISSION RECEIVED ✓"
                      : "TRANSMIT BRIEF"}
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#f5d782]" />
              </motion.button>

              {status === "success" && (
                <p className="font-mono text-xs text-[#4ade80]">
                  Transmission logged — I&apos;ll respond within 24h.
                </p>
              )}
              {status === "error" && (
                <p className="font-mono text-xs text-red-400">{errorMsg}</p>
              )}
              {status === "idle" && (
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                  ENCRYPTED ENDPOINT: POST /API/CONTACT
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
