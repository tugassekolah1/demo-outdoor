import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border-subtle bg-brand-primary-dark px-4 py-3.5 sm:px-6 text-white shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent text-white shadow-xs">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 20 L10 7 L15 15 L18 10 L22 20 Z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold tracking-tight text-white text-base">
              TAPAK
            </span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white/90 tracking-wide uppercase">
              Admin Panel
            </span>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 transition-all hover:bg-white/20 hover:text-white"
        >
          <span>Lihat Toko Rental</span>
          <span>→</span>
        </Link>
      </header>
      {children}
    </div>
  );
}
