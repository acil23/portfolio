"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">Something went wrong</p>
      <h1 className="font-display mt-3 text-3xl tracking-[-0.02em] text-white">A scene failed to load.</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/50">{error.message || "An unexpected error occurred. Try again."}</p>
      <button
        onClick={reset}
        className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-medium text-black hover:bg-white/90"
      >
        Try again
      </button>
    </div>
  );
}
