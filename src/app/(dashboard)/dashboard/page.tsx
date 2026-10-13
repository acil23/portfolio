import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  let stats = { projects: 0, published: 0, skills: 0, experiences: 0, inbox: 0, unread: 0 };
  let recentProjects: { id: string; title: string; slug: string; isPublished: boolean }[] = [];
  let recentMessages: { id: string; name: string; email: string; subject: string | null; createdAt: Date }[] = [];
  try {
    const [projects, published, skills, experiences, inbox, unread] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { isPublished: true } }),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);
    stats = { projects, published, skills, experiences, inbox, unread };
    recentProjects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, title: true, slug: true, isPublished: true } });
    recentMessages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, subject: true, createdAt: true } });
  } catch {}
  const cards = [
    { label: "Projects", value: stats.projects, sub: `${stats.published} published` },
    { label: "Skills", value: stats.skills, sub: "across categories" },
    { label: "Experience", value: stats.experiences, sub: "timeline entries" },
    { label: "Inbox", value: stats.inbox, sub: `${stats.unread} unread`, accent: stats.unread > 0 },
  ];
  return (
    <div className="mx-auto max-w-[1080px]">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">Content Studio — Overview</p>
      <h1 className="font-display mt-2 text-[32px] leading-none tracking-[-0.03em] md:text-[42px]">Welcome back.</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/55">Your portfolio is live. Publish from here — changes go live in ~60s (ISR).</p>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-2xl border p-5 ${c.accent ? "border-gold/30 bg-gold/[0.06]" : "border-black/10 bg-white"}`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/40">{c.label}</p>
            <p className="font-display mt-2 text-[30px] leading-none tracking-[-0.02em]">{c.value}</p>
            <p className={`mt-1 font-mono text-[11px] ${c.accent ? "text-gold" : "text-black/40"}`}>{c.sub}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="flex items-center justify-between"><h2 className="font-display text-lg tracking-[-0.01em]">Recent Projects</h2><Link href="/" className="font-mono text-[11px] uppercase tracking-[0.08em] text-gold hover:underline">View site →</Link></div>
          {recentProjects.length === 0 ? <p className="mt-6 rounded-xl border border-dashed border-black/10 bg-black/[0.02] px-4 py-8 text-center font-mono text-xs text-black/40">No projects yet — create your first one.</p> : <ul className="mt-4 divide-y divide-black/5">{recentProjects.map((p) => (<li key={p.id} className="flex items-center justify-between py-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{p.title}</p><p className="font-mono text-[11px] text-black/40">/{p.slug}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] ${p.isPublished ? "bg-green-50 text-green-700 border border-green-200" : "bg-black/5 text-black/50 border border-black/10"}`}>{p.isPublished ? "Published" : "Draft"}</span></li>))}</ul>}
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="flex items-center justify-between"><h2 className="font-display text-lg tracking-[-0.01em]">Inbox — Recent</h2><span className="rounded-full bg-black px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-white">{stats.unread} unread</span></div>
          {recentMessages.length === 0 ? <p className="mt-6 rounded-xl border border-dashed border-black/10 bg-black/[0.02] px-4 py-8 text-center font-mono text-xs text-black/40">No messages yet — POST /api/contact is wired.</p> : <ul className="mt-4 divide-y divide-black/5">{recentMessages.map((m) => (<li key={m.id} className="py-3"><p className="truncate text-sm font-medium">{m.name} <span className="font-normal text-black/40">· {m.email}</span></p><p className="truncate text-xs text-black/60">{m.subject || "(no subject)"}</p><p className="font-mono text-[11px] text-black/30">{new Date(m.createdAt).toLocaleDateString()}</p></li>))}</ul>}
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-black/10 bg-[#0A0A0A] p-6 text-white">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">Quick actions</p>
        <p className="mt-2 text-sm leading-relaxed text-white/60">CRUD APIs at <span className="font-mono text-white">/api/admin/*</span> — tell me and I&apos;ll scaffold full forms next.</p>
        <div className="mt-4 flex flex-wrap gap-2"><Link href="/projects" target="_blank" className="inline-flex h-9 items-center rounded-full bg-white px-5 text-sm font-medium text-black">View Projects</Link><Link href="/#contact" target="_blank" className="inline-flex h-9 items-center rounded-full border border-white/15 px-5 font-mono text-xs uppercase tracking-[0.08em] text-white/70 hover:border-gold/40 hover:text-gold">Test Contact</Link></div>
      </div>
    </div>
  );
}
