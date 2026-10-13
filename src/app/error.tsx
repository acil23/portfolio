"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Terjadi kesalahan</h1>
        <p className="text-sm text-muted-foreground">{error.message || "Coba muat ulang halaman."}</p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-xl bg-foreground px-4 py-2 text-sm text-background"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
