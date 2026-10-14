import { ImageResponse } from "next/og";

// OG 1200×630 — Noir Editorial — JN brand
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "JN — Jupri Naldi — Full-Stack Developer";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090B",
          padding: 56,
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#09090B",
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            JN
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", color: "#fff", fontSize: 18, letterSpacing: "0.14em", fontWeight: 600 }}>
              AKLEIN.TECH
            </div>
            <div style={{ display: "flex", color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: "0.12em" }}>
              JUPRI NALDI — FULL-STACK DEVELOPER
            </div>
          </div>
        </div>

        {/* Hero copy */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", color: "#fff", fontSize: 64, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
            Ideas crafted
          </div>
          <div style={{ display: "flex", color: "#D4AF37", fontSize: 64, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
            into digital reality.
          </div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.55)", fontSize: 20, marginTop: 8 }}>
            Next.js · TypeScript · Prisma · Supabase · PostgreSQL
          </div>
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.35)", fontSize: 12, letterSpacing: "0.12em" }}>
            © {new Date().getFullYear()} AKLEIN — aklein.tech
          </div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.35)", fontSize: 12, letterSpacing: "0.12em" }}>
            Available 2026 — Indonesia
          </div>
        </div>
      </div>
    ),
    size
  );
}
