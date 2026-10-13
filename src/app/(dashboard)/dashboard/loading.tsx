export default function Loading() {
  return (
    <div className="mx-auto max-w-[1080px] animate-pulse">
      <div className="h-3 w-40 rounded-full bg-black/10" />
      <div className="mt-4 h-8 w-64 rounded-xl bg-black/10" />
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[96px] rounded-2xl border border-black/10 bg-white" />
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="h-[220px] rounded-2xl border border-black/10 bg-white" />
        <div className="h-[220px] rounded-2xl border border-black/10 bg-white" />
      </div>
    </div>
  );
}
