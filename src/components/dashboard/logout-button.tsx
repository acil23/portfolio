"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }
  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-black/10 px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-black/60 hover:border-gold/40 hover:text-gold disabled:opacity-50"
    >
      <LogOut className="h-3.5 w-3.5" />
      {loading ? "..." : "Logout"}
    </button>
  );
}
