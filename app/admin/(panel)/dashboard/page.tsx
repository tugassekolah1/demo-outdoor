import Link from "next/link";
import { getAdminStats, getBookings } from "@/lib/admin";
import BookingTable from "@/components/admin/BookingTable";

export default async function AdminDashboardPage() {
  const [stats, recentBookings] = await Promise.all([
    getAdminStats(),
    getBookings(5),
  ]);

  const cards = [
    {
      label: "Total Produk",
      value: stats.products,
      href: "/admin/products",
      icon: "⛺",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      desc: "Unit peralatan outdoor",
    },
    {
      label: "Kategori Alat",
      value: stats.categories,
      href: "/admin/categories",
      icon: "🏷️",
      color: "text-brand-primary bg-brand-primary-tint border-brand-primary/20",
      desc: "Tenda, carrier, cooking set",
    },
    {
      label: "Semua Booking",
      value: stats.bookings,
      href: "/admin/bookings",
      icon: "📋",
      color: "text-indigo-700 bg-indigo-50 border-indigo-200",
      desc: "Total transaksi tercatat",
    },
    {
      label: "Booking Pending",
      value: stats.pendingBookings,
      href: "/admin/bookings",
      icon: "⏳",
      color: "text-amber-700 bg-amber-50 border-amber-200",
      desc: "Menunggu konfirmasi admin",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Dashboard Admin
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
          Ringkasan status operasional dan transaksi rental terbaru.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative rounded-2xl border border-border-subtle bg-surface p-5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                {card.label}
              </span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl border text-sm ${card.color}`}>
                {card.icon}
              </span>
            </div>
            <p className="mt-3 font-display text-3xl sm:text-4xl font-black text-foreground group-hover:text-brand-primary transition-colors">
              {card.value}
            </p>
            <p className="mt-1 text-[11px] text-foreground-muted">
              {card.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Bookings Section */}
      <section className="rounded-2xl border border-border-subtle bg-surface p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Booking Terbaru
            </h2>
            <p className="text-xs text-foreground-muted">
              5 transaksi terakhir yang masuk dari customer
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-primary-dark transition-colors"
          >
            <span>Semua Booking</span>
            <span>→</span>
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-subtle py-12 text-center bg-surface-alt/20">
            <p className="font-semibold text-foreground text-sm">Belum ada booking</p>
            <p className="mt-1 text-xs text-foreground-muted">
              Pemesanan baru dari customer akan otomatis muncul di sini.
            </p>
          </div>
        ) : (
          <BookingTable bookings={recentBookings} />
        )}
      </section>
    </div>
  );
}
