export function AdminTable({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white"><table className="w-full text-sm">{children}</table></div>;
}
export function AdminTh({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-black/40">{children}</th>;
}
export function AdminTd({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ""}`}>{children}</td>;
}
