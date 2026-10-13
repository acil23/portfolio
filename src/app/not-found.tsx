import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Halaman tidak ditemukan.</p>
        <Link href="/" className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
