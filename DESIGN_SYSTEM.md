# DESIGN SYSTEM — aklein.tech

> **Concept Locked:** Noir Editorial Luxury `v1.0` — 2026-10-14
> **Positioning:** Mewah, cinematic, elegant — HR terkesima dalam 7 detik. Skill detail ada di CV; web adalah bukti taste & engineering level dewa.
> **Stack:** Next.js 15 (App Router) + Tailwind v4 + shadcn/base-nova + framer-motion + Lenis
> **Status:** READY FOR F1 — belum ada kode, hanya token & prinsip. Single Source of Truth visual.

---

## 1. Philosophy — Kenapa Noir Editorial?

HR buka 30 portfolio/hari. Yang colorful = pasaran. Yang full 3D = gimmick. **Noir Editorial** beda: seperti majalah luxury (Kinfolk, Aesop, Apple) — berani pakai whitespace, tipografi besar, animasi halus. Pesan: *"Orang ini senior, detail, punya taste."*

**3 Prinsip:**
1. **Restraint is Luxury** — 3 warna saja, aksen gold dipakai 3% saja.
2. **Motion is Meaning** — Animasi lambat, halus, presisi (`easeOutExpo`).
3. **Typography is Architecture** — Headline serif raksasa sebagai struktur.

---

## 2. Color System — 60-30-10 Rule

- **60% Noir Canvas:** Latar gelap hangat, bukan hitam pekat.
- **30% Warm Cream:** Teks & area light untuk kontras editorial.
- **10% Champagne Gold:** Hanya aksen — garis 1px, hover, dot.

| Token | HEX | OKLCH | Usage |
|---|---|---|---|
| `noir-950` | `#0A0A0A` | `oklch(0.145 0 0)` | Background utama (dark), hero |
| `noir-900` | `#141414` | `oklch(0.18 0 0)` | Card, surface elevated |
| `noir-800` | `#1E1E1E` | `oklch(0.22 0 0)` | Border, input |
| `cream-50` | `#FDFCFB` | `oklch(0.985 0.005 85)` | Background light |
| `cream-100` | `#F5F3EF` | `oklch(0.97 0.008 85)` | Card light, section alt |
| `cream-200` | `#E8E0D6` | `oklch(0.92 0.015 75)` | Border light |
| `gold-500` | `#C9A96A` | `oklch(0.75 0.08 75)` | Accent ONLY — CTA, underline |
| `gold-600` | `#B8944F` | `oklch(0.70 0.09 75)` | Hover gold |
| `stone-500` | `#78716C` | `oklch(0.58 0.01 60)` | Muted text |
| `stone-400` | `#A8A29E` | `oklch(0.70 0.01 60)` | Placeholder |

### Semantic Mapping (akan di-inject ke `globals.css`)

```css
:root { /* Light — untuk Admin/Dashboard agar clean */
  --background: oklch(0.985 0.005 85); /* cream-50 */
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --border: oklch(0.92 0.015 75);
  --primary: oklch(0.145 0 0);
  --primary-foreground: oklch(0.985 0.005 85);
  --gold: oklch(0.75 0.08 75);
}
.dark { /* Dark — untuk Public Site */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0.005 85);
  --card: oklch(0.18 0 0);
  --border: oklch(1 0 0 / 10%);
  --primary: oklch(0.985 0.005 85);
  --primary-foreground: oklch(0.145 0 0);
}
::selection { background: oklch(0.75 0.08 75 / 30%); }
```

**Aturan Gold:** Jangan pakai gold sebagai background blok besar. Hanya: `1px border-top` card hover, `underline` link, `dot` timeline, `ring` focus.

---

## 3. Typography

### Font Stack
- **Display / Serif:** `Cormorant Garamond` (elegant, high-contrast) via `next/font/google` — weight 300,400,500,600. Alternatif: `Fraunces` / `Instrument Serif`.
- **Sans (Body/UI):** `Geist Sans` (sudah ada).
- **Mono (Meta/Label):** `Geist Mono` (sudah ada).

```ts
// src/app/layout.tsx — rencana F1
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["300","400","500","600"] });
```

### Scale (Fluid via clamp)

| Level | Font | Size | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| Hero Display | Display | `clamp(56px,12vw,168px)` | 300 | `-0.04em` | AKLEIN watermark, Hero H1 |
| H1 | Display | `clamp(40px,6vw,72px)` | 400 | `-0.03em` | Section title |
| H2 | Display | `clamp(32px,4vw,48px)` | 400 | `-0.02em` | Project title |
| H3 | Sans | `24px` | 500 | `-0.02em` | Card title |
| Body L | Sans | `18px / 1.7` | 400 | `0` | About paragraph |
| Body | Sans | `16px / 1.6` | 400 | `0` | Default |
| Label | Mono | `11px / 1` | 500 | `0.12em` | OVERLINE, TAG, DATE |

Ritme: display `line-height 0.9`, sans `1.6`. Selalu `text-balance` untuk headline.

---

## 4. Spacing, Layout & Grid

- **Base Unit:** `4px` — semua spacing kelipatan 4.
- **Container:** `max-w-[1280px]` + `px-6 md:px-8`. Hero full-bleed.
- **Section Padding:** `py-24 md:py-32 lg:py-40` — biarkan napas, itu yang bikin mahal.
- **Grid:** 12-col, gap `16/24`. Projects: `1 col mobile, 2 col desktop` dengan featured `col-span-2`.
- **Radius:** `0.75rem` soft luxury. Card `rounded-2xl`, button `rounded-full` (pill).

---

## 5. Motion System — Jiwa dari "Kreatifitas Dewa"

Pakai `framer-motion` + `Lenis`. Prinsip: **lambat & presisi, bukan cepat & ramai.**

### Easing & Duration
- **Luxe Ease (utama):** `cubic-bezier(0.16,1,0.3,1)` — `easeOutExpo`.
- **Duration:** `700ms` reveal, `400ms` hover, `1200ms` parallax.
- **Stagger:** `0.08s` antar item.

### Signature Animations (Wajib Ada)
1. **Blur Reveal:** `blur(8px)+y:24 -> blur(0)+y:0` — untuk semua section title. Jauh lebih mewah dari fade.
2. **Parallax Watermark:** Teks `AKLEIN` `25vw` di belakang hero, `y` bergerak `0.3x` kecepatan scroll.
3. **Magnetic Button:** CTA "Let's Talk" tertarik ke kursor radius 80px (`spring stiffness:150`).
4. **Spotlight Card:** Project card radial gradient mengikuti mouse — border gold menyala halus.
5. **Line Draw:** Garis vertical timeline `scaleY:0->1` saat scroll.
6. **Grain & Noise:** Overlay `opacity 0.04` noise di atas background noir.

```ts
// src/lib/motion.ts — rencana
export const blurReveal = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (i=0) => ({ opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: i*0.08, duration: 0.7, ease: [0.16,1,0.3,1] } })
};
```

Aksesibilitas: `prefers-reduced-motion` → fallback ke `opacity` saja.

---

## 6. Elevation, Border & Effects

- **Border:** `1px solid oklch(1 0 0 / 8%)` di dark. Shadow hanya untuk hover: `shadow-[0_20px_60px_rgba(0,0,0,0.5)]`.
- **Glass:** Nav `backdrop-blur-xl bg-noir-950/40 border-b border-white/5`.
- **Grain:** `public/noise.png` + `before:opacity-[0.03] before:bg-[url(/noise.png)]`.
- **Gradient Mesh (Hero):** Radial `gold-500/8%` pojok kanan atas, `cream-100/5%` kiri bawah — blur `120px`.

---

## 7. Component Specs

### Navbar
- Fixed top, transparent -> glass on `scrollY>20`.
- Logo `AKLEIN.` Display 20px `-0.02em`. Menu mono `11px` uppercase `0.12em`.
- Active: underline gold `h-[1px] scaleX` animasi.

### Button
- **Primary:** `bg-foreground text-background rounded-full px-8 h-12` — hover `magnetic + scale 1.02`.
- **Ghost:** `border border-white/10 rounded-full` — hover `border-gold-500`.
- Selalu dengan arrow `→` yang `translate-x-2` on hover.

### Project Card (Hero Element)
- `rounded-2xl overflow-hidden bg-noir-900 border border-white/5` — hover `border-gold-500/30 + spotlight`.
- Image `aspect-[16/10] object-cover` + `scale 1.05` on hover (700ms).
- Content: Label mono (Featured) + H3 Display + Summary muted + Tags mono.

### Section Header
- Overline `mono gold` — H2 Display — Divider `w-12 h-[1px] bg-gold-500`.

---

## 8. Page Narrative — Storytelling yang Bikin HR Terkesima

Urutan section adalah cerita, bukan dump data:

1. **Hero — Cinematic Statement (100vh):** Watermark `AKLEIN`, headline `Ideas crafted into — digital reality.`, sub `Full-Stack Developer based in Indonesia`, 2 CTA (`View Selected Works` + `Download CV`), scroll indicator animasi.
2. **Selected Works (3 only):** 3 terbaik layout editorial besar. Link `View All Projects →`.
3. **Philosophy / About:** Foto + 2 paragraf personal — value, bukan buzzword.
4. **Experience Timeline (Interactive):** Vertical line + dot gold, card expand on hover.
5. **Skills — Bento Minimal:** Grid 4-6 kategori, icon + level bar tipis gold.
6. **Contact — Exclusive Invite:** Headline `Let's build something — remarkable.` Form dengan input `border-b` saja (underline), bukan box.

---

## 9. Do & Don't

| Do ✅ | Don't ❌ |
|---|---|
| Whitespace lega | Section mepet |
| 1 aksen gold tipis | Gold blok besar |
| Animasi lambat 700ms | Animasi cepat & bounce |
| Foto duotone warm | Foto oversaturated |
| Mono label kecil | Semua teks besar |

---

## 10. Implementation Checklist — F1

- [ ] Update `src/app/globals.css` dengan token baru + grain utility
- [ ] Update `src/app/layout.tsx` — inject `Cormorant_Garamond`, set `className dark` default untuk public
- [ ] Buat `src/lib/motion.ts` variants
- [ ] Buat `src/components/layout/Navbar.tsx` (glass) + `Footer.tsx`
- [ ] Buat `src/components/ui/magnetic-button.tsx` + `spotlight-card.tsx`
- [ ] Replace `src/app/page.tsx` dengan Hero + Section placeholders

> File ini hidup. Setelah F1 diimplement, screenshot dilampirkan untuk sign-off.
