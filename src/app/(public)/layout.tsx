import { CursorParticleTrail } from "@/components/ui/cursor-particle-trail";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CursorParticleTrail />
      {children}
    </>
  );
}
