export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A]">
      <div className="h-[64px] border-b border-white/[0.06] bg-[#0A0A0A]/60 backdrop-blur-xl" />
      <div className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-24 md:px-8">
        <div className="h-3 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="mt-6 h-20 w-3/4 animate-pulse rounded-2xl bg-white/[0.06]" />
        <div className="mt-4 h-4 w-1/2 animate-pulse rounded-full bg-white/5" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[220px] animate-pulse rounded-2xl bg-white/[0.04] border border-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
