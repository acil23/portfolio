/**
 * BrandMark — JN Monogram (Varian A)
 * Noir Editorial — 32px rounded 7px, noir #09090B on light, inverse on dark.
 * Used in Navbar, Footer, loading, and as reference for icon.svg / apple-icon.
 */
export function BrandMark({
  size = 32,
  variant = "dark",
  className = "",
}: {
  size?: number;
  variant?: "dark" | "light" | "ghost";
  className?: string;
}) {
  const isDark = variant === "dark";
  const isGhost = variant === "ghost";

  if (isGhost) {
    // Transparent box with border — for dark header (blends on #0A0A0A)
    return (
      <div
        aria-hidden
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.22,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.06)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-geist-sans), Inter, ui-sans-serif, system-ui",
          fontWeight: 800,
          fontSize: size * 0.42,
          letterSpacing: "-0.04em",
          color: "#fff",
          lineHeight: 1,
        }}
      >
        JN
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: isDark ? "#09090B" : "#FFFFFF",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-geist-sans), Inter, ui-sans-serif, system-ui",
        fontWeight: 800,
        fontSize: size * 0.44,
        letterSpacing: "-0.04em",
        color: isDark ? "#FFFFFF" : "#09090B",
        lineHeight: 1,
      }}
    >
      JN
    </div>
  );
}

export function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={className} style={{ letterSpacing: "-0.02em" }}>
      JN<span className="text-gold">.</span>
    </span>
  );
}
