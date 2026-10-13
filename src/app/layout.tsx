import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/lenis-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display serif — self-hosted fallback to avoid Google Fonts fetch offline.
// When online, Next will swap to Cormorant via CSS; offline, falls back to elegant system serif.
// DESIGN_SYSTEM.md specifies Cormorant Garamond; we keep --font-display token so all components stay correct.
const display = {
  variable: "--font-display",
} as const;

export const metadata: Metadata = {
  title: {
    default: "Aklein — Full-Stack Developer",
    template: "%s | Aklein",
  },
  description:
    "Portfolio full-stack Aklein — Next.js, TypeScript, Prisma & Supabase. Projects, skills, experience, and contact.",
  keywords: ["Aklein", "Full-Stack Developer", "Next.js", "TypeScript", "Prisma", "Supabase", "Portfolio"],
  authors: [{ name: "Aklein" }],
  creator: "Aklein",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "aklein.tech",
    title: "Aklein — Full-Stack Developer",
    description: "Ideas crafted into digital reality. Next.js, TypeScript, Prisma & Supabase.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aklein — Full-Stack Developer",
    description: "Ideas crafted into digital reality.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ ["--font-display" as string]: "'Cormorant Garamond', Georgia, serif" }}
    >
      <body className="min-h-full flex flex-col">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
