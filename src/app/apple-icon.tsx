import { ImageResponse } from "next/og";

// JN — Apple Touch Icon (180×180) — Noir Editorial
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090B",
          borderRadius: 42,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Inter, sans-serif",
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#FFFFFF",
          }}
        >
          JN
        </div>
      </div>
    ),
    size
  );
}
