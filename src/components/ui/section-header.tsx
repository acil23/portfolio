import { cn } from "cn";

export function SectionHeader({
  overline,
  title,
  description,
  align = "left",
  className,
}: {
  overline?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {overline && (
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-gold">{overline}</p>
      )}
      <h2 className="font-display mt-3 text-balance text-[clamp(32px,4.5vw,52px)] font-[400] leading-[0.95] tracking-[-0.03em] text-foreground">
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
      <div className={cn("mt-6 h-px w-12 bg-gold/60", align === "center" && "mx-auto")} />
    </div>
  );
}
