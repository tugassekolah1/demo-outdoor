"use client";

/**
 * Form Booking Customer — PHASE 7.
 * Menggantikan placeholder Phase 1.
 *
 * SCOPE: hanya booking customer (form nama/WA/tanggal/catatan + pilih
 * produk&jumlah dari keranjang + kalkulasi total + kirim ke API +
 * redirect ke ringkasan). Tidak ada fitur admin.
 *
 * Produk & jumlah diambil dari CartContext (localStorage) — konsisten
 * dengan alur "tambah ke keranjang di katalog/detail produk → lanjut
 * ke booking" yang sudah ada sejak Phase 6. Customer masih bisa
 * mengubah quantity atau menghapus produk langsung di halaman ini
 * (tidak perlu bolak-balik ke /cart) lewat `useCart()`.
 */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils";
import { calculateRentalDays } from "@/lib/booking";
import ProductImage from "@/components/customer/ProductImage";

export default function BookingPage() {
  const router = useRouter();
  const { items, setQuantity, removeItem, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const todayStr = useMemo(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  }, []);

  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
    if (end.getTime() < start.getTime()) return 0;
    return calculateRentalDays(start, end);
  }, [startDate, endDate]);

  const subtotalPerHari = items.reduce(
    (sum, item) => sum + item.pricePerDay * item.quantity,
    0
  );
  const totalPrice = subtotalPerHari * rentalDays;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (items.length === 0) {
      setFormError("Keranjang kosong — pilih produk dulu di katalog.");
      return;
    }
    if (!startDate || !endDate) {
      setFormError("Tanggal mulai dan tanggal selesai harus diisi.");
      return;
    }
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setFormError("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          whatsapp,
          startDate,
          endDate,
          note,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setFormError(data.error ?? "Gagal membuat booking. Coba lagi.");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/booking/success?id=${data.bookingId}`);
    } catch {
      setFormError("Tidak bisa terhubung ke server. Periksa koneksi dan coba lagi.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:py-28 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-primary-tint text-4xl shadow-xs">
          🎒
        </div>
        <h1 className="font-display mt-6 text-2xl sm:text-3xl font-bold text-foreground">
          Keranjang Masih Kosong
        </h1>
        <p className="mt-2 text-sm text-foreground-muted max-w-md mx-auto leading-relaxed">
          Pilih peralatan di katalog terlebih dahulu sebelum mengisi data pemesanan rental.
        </p>
        <Link
          href="/catalog"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-primary px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-primary-dark hover:shadow-lg hover:-translate-y-0.5"
        >
          <span>Pilih Peralatan di Katalog</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* 3-Step Progress Header */}
      <div className="mb-8 border-b border-border-subtle/80 pb-6">
        <div className="flex items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium">
          <Link href="/cart" className="flex items-center gap-2 text-brand-primary hover:underline">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary-tint text-brand-primary text-xs font-bold">
              ✓
            </span>
            <span>Keranjang</span>
          </Link>
          <span className="text-border-subtle font-bold">——</span>
          <div className="flex items-center gap-2 text-brand-primary font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-white text-xs shadow-xs">
              2
            </span>
            <span>Form Booking</span>
          </div>
          <span className="text-border-subtle font-bold">——</span>
          <div className="flex items-center gap-2 text-foreground-muted">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-alt border border-border-subtle text-xs">
              3
            </span>
            <span>Konfirmasi WA</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
          Lengkapi Data Booking
        </h1>
        <p className="mt-1.5 text-sm text-foreground-muted">
          Isi detail sewa di bawah. Setelah terkirim, kamu dapat langsung menghubungkan pesanan ke WhatsApp admin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Kolom kiri: form data penyewa & tanggal */}
        <div className="lg:col-span-7 rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="font-display text-lg font-bold text-foreground border-b border-border-subtle/80 pb-3 flex items-center gap-2">
            <span>👤</span>
            <span>Informasi Penyewa</span>
          </h2>

          <div>
            <label htmlFor="customerName" className="block text-xs font-bold uppercase tracking-wider text-foreground">
              Nama Lengkap
            </label>
            <input
              id="customerName"
              type="text"
              required
              minLength={3}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="mt-1.5 w-full rounded-xl border border-border-subtle bg-surface-alt/50 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted transition-all focus:border-brand-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-xs font-bold uppercase tracking-wider text-foreground">
              Nomor WhatsApp (Aktif)
            </label>
            <input
              id="whatsapp"
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="mt-1.5 w-full rounded-xl border border-border-subtle bg-surface-alt/50 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted transition-all focus:border-brand-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
            <p className="mt-1 text-[11px] text-foreground-muted">
              Admin akan menghubungi nomor ini untuk konfirmasi serah terima alat.
            </p>
          </div>

          <div className="rounded-xl border border-border-subtle/80 bg-surface-alt/30 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Jadwal Waktu Sewa
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-[11px] font-semibold text-foreground-muted mb-1">
                  Mulai Ambil Alat
                </label>
                <input
                  id="startDate"
                  type="date"
                  required
                  min={todayStr}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground transition-all focus:border-brand-primary focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-[11px] font-semibold text-foreground-muted mb-1">
                  Pengembalian Alat
                </label>
                <input
                  id="endDate"
                  type="date"
                  required
                  min={startDate || todayStr}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground transition-all focus:border-brand-primary focus:outline-none"
                />
              </div>
            </div>

            {rentalDays > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-brand-primary-tint px-3 py-2 text-xs text-brand-primary font-bold">
                <span>🗓️ Durasi Masa Sewa:</span>
                <span className="text-sm font-extrabold">{rentalDays} Hari</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="note" className="block text-xs font-bold uppercase tracking-wider text-foreground">
              Catatan Khusus (Opsional)
            </label>
            <textarea
              id="note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Mau ambil malam hari, butuh panduan pasang tenda, dll."
              className="mt-1.5 w-full resize-none rounded-xl border border-border-subtle bg-surface-alt/50 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted transition-all focus:border-brand-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
        </div>

        {/* Kolom kanan: ringkasan produk & total harga */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm space-y-5">
            <h2 className="font-display text-lg font-bold text-foreground border-b border-border-subtle/80 pb-3 flex items-center justify-between">
              <span>Produk Sewa</span>
              <span className="text-xs font-semibold text-brand-primary bg-brand-primary-tint px-2.5 py-0.5 rounded-full">
                {items.length} item
              </span>
            </h2>

            <ul className="divide-y divide-border-subtle/60 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      categorySlug={item.categorySlug}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-foreground line-clamp-1">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-foreground-muted">
                        {formatRupiah(item.pricePerDay)} /hari
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center rounded-full border border-border-subtle bg-surface-alt/60">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          className="flex h-5 w-5 items-center justify-center text-[10px] font-bold text-foreground-muted hover:text-brand-primary"
                          aria-label={`Kurangi ${item.name}`}
                        >
                          −
                        </button>
                        <span className="min-w-5 px-1 text-center text-[11px] font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              item.productId,
                              Math.min(item.stock, item.quantity + 1)
                            )
                          }
                          className="flex h-5 w-5 items-center justify-center text-[10px] font-bold text-foreground-muted hover:text-brand-primary"
                          aria-label={`Tambah ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-[11px] text-foreground-muted hover:text-brand-accent transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                  <span className="shrink-0 text-right text-xs font-bold text-foreground self-center">
                    {formatRupiah(item.pricePerDay * item.quantity)}
                    <span className="block text-[10px] font-normal text-foreground-muted">/hari</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-border-subtle pt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-foreground-muted text-xs">
                <span>Subtotal per hari</span>
                <span className="font-semibold text-foreground">
                  {formatRupiah(subtotalPerHari)}
                </span>
              </div>
              <div className="flex items-center justify-between text-foreground-muted text-xs">
                <span>Lama Sewa</span>
                <span className="font-semibold text-foreground">
                  {rentalDays > 0 ? `${rentalDays} hari` : "Isi tanggal"}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border-subtle/80 pt-3 text-base">
                <span className="font-bold text-foreground">Total Biaya Sewa</span>
                <span className="font-display text-xl font-extrabold text-brand-primary">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>

            {formError && (
              <div className="rounded-xl border border-brand-accent/40 bg-brand-accent/10 p-3 text-xs font-semibold text-brand-accent-dark">
                ⚠️ {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-accent-dark hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Memproses Booking...</span>
                </>
              ) : (
                <>
                  <span>Kirim Permintaan Booking</span>
                  <span>→</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-foreground-muted">
              🔒 Privasi data aman & pembayaran dilakukan saat serah terima alat.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
