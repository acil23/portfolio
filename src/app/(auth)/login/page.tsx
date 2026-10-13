"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fallbackError = searchParams.get("error") === "forbidden" ? "Akses ditolak." : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Email atau password tidak valid.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Login gagal. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 text-neutral-100">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-400">Admin Access</p>
          <h1 className="text-3xl font-semibold tracking-tight">Masuk ke dashboard</h1>
          <p className="text-sm leading-6 text-neutral-400">
            Gunakan akun admin untuk mengelola konten portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm text-neutral-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-neutral-100 outline-none transition focus:border-white/30"
              autoComplete="email"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-neutral-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-neutral-100 outline-none transition focus:border-white/30"
              autoComplete="current-password"
              required
            />
          </label>

          {(error || fallbackError) && (
            <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error ?? fallbackError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 font-medium text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
