import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ADMIN_SESSION_COOKIE, readAdminSessionToken } from "@/lib/auth/session";
import { LogoutButton } from "@/components/dashboard/logout-button";

const NAV = [
  { href: "/dashboard", label: "Overview", mono: "01" },
  { href: "/dashboard/projects", label: "Projects", mono: "02" },
  { href: "/dashboard/skills", label: "Skills", mono: "03" },
  { href: "/dashboard/experiences", label: "Experience", mono: "04" },
  { href: "/dashboard/educations", label: "Education", mono: "05" },
  { href: "/dashboard/inbox", label: "Inbox", mono: "06" },
  { href: "/dashboard/site-profile", label: "Site Profile", mono: "07" },
] as const;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await readAdminSessionToken(sessionToken);
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] text-[#0A0A0A]">
      {/* Sidebar — Noir */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0A0A0A] md:flex">
        <div className="flex h-[64px] items-center border-b border-white/[0.06] px-6">
          <Link href="/dashboard" className="font-display text-[18px] tracking-[-0.02em] text-white">
            AKLEIN<span className="text-gold">.</span>
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-6">
          <p className="px-3 pb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">Navigate</p>
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <span className="font-mono text-[10px] tracking-[0.1em] text-gold/60">{item.mono}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">Tip</p>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Publish projects & skills from here — they go live on the site in ~60s.
            </p>
            <Link href="/" target="_blank" className="mt-3 inline-flex font-mono text-[11px] text-gold hover:underline">
              View site →
            </Link>
          </div>
        </nav>
        <div className="border-t border-white/[0.06] p-4">
          <p className="truncate text-sm text-white/80">{session.user.name || session.user.email}</p>
          <p className="truncate font-mono text-[11px] text-white/40">{session.user.email}</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-[64px] items-center justify-between border-b border-black/10 bg-[#FDFCFB]/80 px-6 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="font-display text-sm tracking-[-0.01em] md:hidden">
              AKLEIN<span className="text-gold">.</span>
            </Link>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-black/40 md:inline">
              Dashboard — Content Studio
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden font-mono text-[11px] uppercase tracking-[0.08em] text-black/50 hover:text-black md:inline-flex"
            >
              View site →
            </Link>
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 bg-[#FDFCFB] px-6 py-8 md:px-8 md:py-10">{children}</main>
        <footer className="border-t border-black/5 px-6 py-4 md:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/30">
            © {new Date().getFullYear()} Aklein — Dashboard
          </p>
        </footer>
      </div>
    </div>
  );
}
