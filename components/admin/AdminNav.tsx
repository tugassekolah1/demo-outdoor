"use client";

/**
 * Navigasi panel admin: link tab utama + user profile badge + tombol Keluar.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Produk", icon: "⛺" },
  { href: "/admin/categories", label: "Kategori", icon: "🏷️" },
  { href: "/admin/bookings", label: "Booking", icon: "📋" },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <div className="border-b border-border-subtle bg-surface sticky top-[57px] z-30 shadow-2xs backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <nav className="flex flex-wrap items-center gap-1.5" aria-label="Menu admin">
          {LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-foreground-muted hover:bg-surface-alt hover:text-brand-primary"
                }`}
              >
                <span className="text-xs">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-surface-alt px-3 py-1 text-xs text-foreground-muted border border-border-subtle">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-foreground">{email}</span>
          </div>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-full border border-border-subtle px-3.5 py-1 text-xs font-semibold text-foreground-muted transition-all hover:border-brand-accent hover:bg-brand-accent/10 hover:text-brand-accent-dark"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
