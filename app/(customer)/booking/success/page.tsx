/**
 * Ringkasan Booking — PHASE 8 (digabung pengerjaannya dengan Phase 7
 * karena keduanya bagian dari alur "booking customer" yang diminta
 * dalam satu scope: form → kirim → tampilkan ringkasan).
 *
 * Server Component: mengambil booking dari database berdasarkan `id`
 * di query string (`?id=...`), supaya link ringkasan tetap bisa
 * dibuka ulang (refresh, dibagikan) tanpa bergantung pada state
 * client yang sudah hilang (cart sudah di-clear setelah submit).
 *
 * PHASE 8 (lanjutan): ditambahkan tombol "Kirim ke WhatsApp Admin"
 * yang membuka wa.me dengan pesan pre-filled berisi detail booking
 * (lihat lib/whatsapp.ts) — fitur customer lain TIDAK diubah.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingById } from "@/lib/booking";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import { calculateRentalDays } from "@/lib/booking";
import { BOOKING_STATUS_LABEL, type BookingStatus } from "@/types";
import { getWhatsAppBookingLink } from "@/lib/whatsapp";
import ProductImage from "@/components/customer/ProductImage";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const id = params.id;

  if (!id) {
    notFound();
  }

  const booking = await getBookingById(id);

  if (!booking) {
    notFound();
  }

  const rentalDays = calculateRentalDays(booking.startDate, booking.endDate);
  const statusLabel =
    BOOKING_STATUS_LABEL[booking.status as BookingStatus] ?? booking.status;

  // Link wa.me dengan pesan pre-filled (detail booking lengkap).
  // Nomor admin dari env WHATSAPP_ADMIN_NUMBER — kalau belum di-set,
  // tombol ditampilkan dalam keadaan nonaktif (lihat lib/whatsapp.ts).
  const waLink = getWhatsAppBookingLink(booking);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* 3-Step Progress Header */}
      <div className="mb-8 border-b border-border-subtle/80 pb-6">
        <div className="flex items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 text-brand-primary">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary-tint text-brand-primary text-xs font-bold">
              ✓
            </span>
            <span className="hidden sm:inline">Keranjang</span>
          </div>
          <span className="text-border-subtle font-bold">——</span>
          <div className="flex items-center gap-2 text-brand-primary">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary-tint text-brand-primary text-xs font-bold">
              ✓
            </span>
            <span className="hidden sm:inline">Form Booking</span>
          </div>
          <span className="text-border-subtle font-bold">——</span>
          <div className="flex items-center gap-2 text-brand-primary font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs shadow-xs">
              ✓
            </span>
            <span>Konfirmasi WA</span>
          </div>
        </div>
      </div>

      {/* Success Celebration Header */}
      <div className="text-center max-w-lg mx-auto">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700 text-3xl shadow-xs">
          ✓
        </div>
        <h1 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
          Booking Berhasil Diterima!
        </h1>
        <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
          Terima kasih, <strong className="text-foreground">{booking.customerName}</strong>. Segera klik tombol WhatsApp di bawah untuk menghubungkan pesananmu ke admin TAPAK.
        </p>
      </div>

      {/* Official Voucher / Receipt Card */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-md">
        {/* Receipt Header Banner */}
        <div className="bg-brand-primary p-5 sm:p-6 text-white flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs text-white/75 font-semibold tracking-wider uppercase">
              Kode Transaksi Booking
            </span>
            <p className="font-mono text-base sm:text-lg font-bold tracking-tight text-white mt-0.5">
              #{booking.id}
            </p>
          </div>
          <span className="rounded-full bg-white/20 backdrop-blur-xs px-3.5 py-1 text-xs font-bold text-white shadow-2xs">
            {statusLabel}
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Customer & Date Details */}
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 text-sm border-b border-border-subtle/80 pb-6">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Nama Penyewa</dt>
              <dd className="font-semibold text-foreground mt-0.5">{booking.customerName}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-foreground-muted">No. WhatsApp</dt>
              <dd className="font-semibold text-foreground mt-0.5">{booking.whatsapp}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Mulai Ambil</dt>
              <dd className="font-semibold text-foreground mt-0.5">
                {formatTanggal(booking.startDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Pengembalian</dt>
              <dd className="font-semibold text-foreground mt-0.5">
                {formatTanggal(booking.endDate)}
              </dd>
            </div>
            <div className="sm:col-span-2 flex items-center gap-2 rounded-xl bg-surface-alt p-3 text-xs text-brand-primary font-bold">
              <span>🗓️ Total Masa Sewa:</span>
              <span className="text-sm font-extrabold">{rentalDays} Hari</span>
            </div>
            {booking.note && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Catatan Khusus</dt>
                <dd className="text-xs text-foreground mt-0.5 bg-surface-alt/40 p-2.5 rounded-lg border border-border-subtle/50">
                  {booking.note}
                </dd>
              </div>
            )}
          </dl>

          {/* Rented Items List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground-muted mb-3">
              Rincian Peralatan Disewa
            </h3>
            <ul className="divide-y divide-border-subtle/60">
              {booking.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.name}
                      categorySlug=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {formatRupiah(item.price)} × {item.quantity} unit × {rentalDays} hari
                    </p>
                  </div>
                  <p className="text-right text-sm font-bold text-foreground">
                    {formatRupiah(item.subtotal)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Total Price Card */}
          <div className="flex items-center justify-between rounded-2xl bg-brand-primary-tint/70 p-4 border border-brand-primary/20">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary block">
                Total Biaya Sewa
              </span>
              <span className="text-[11px] text-foreground-muted">
                Dibayarkan saat serah terima peralatan
              </span>
            </div>
            <span className="font-display text-2xl sm:text-3xl font-black text-brand-primary">
              {formatRupiah(booking.totalPrice)}
            </span>
          </div>

          {/* WhatsApp Primary Call To Action */}
          <div className="pt-2">
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-center text-sm sm:text-base font-bold text-white shadow-lg transition-all hover:bg-[#20bd5a] hover:scale-[1.01] active:scale-100"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.974.53 2.012.82 2.802.82h.001c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.775-5.766zm3.385 8.163c-.145.411-.738.77-1.025.819-.287.048-.654.072-2.097-.525-1.748-.724-2.883-2.493-2.97-2.61-.088-.117-.706-.94-.706-1.792 0-.853.442-1.272.6-.1.444.158.088.21.117.315.349.105.232.705 1.722.766 1.848.061.127.102.276.02.435-.082.16-.123.26-.245.403-.122.143-.257.32-.367.43-.122.122-.25.255-.107.5.143.245.635 1.048 1.365 1.698.939.837 1.73 1.096 1.975 1.218.245.122.388.102.531-.061.143-.163.612-.714.775-.959.163-.245.326-.204.55-.122.224.082 1.428.673 1.673.796.245.122.408.184.469.286.061.102.061.591-.084 1.002z" />
                </svg>
                <span>Konfirmasi via WhatsApp Sekarang</span>
              </a>
            ) : (
              <div className="rounded-xl border border-border-subtle bg-surface-alt p-4 text-center text-xs text-foreground-muted">
                Nomor WhatsApp admin belum dikonfigurasi (WHATSAPP_ADMIN_NUMBER di .env).
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Steps Guide */}
      <div className="mt-8 rounded-2xl border border-border-subtle bg-surface p-6 shadow-xs">
        <h3 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <span>📋</span>
          <span>Langkah Selanjutnya:</span>
        </h3>
        <ol className="space-y-2.5 text-xs sm:text-sm text-foreground-muted">
          <li className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white text-[10px] font-bold">
              1
            </span>
            <span>
              <strong>Kirim pesan WhatsApp:</strong> Klik tombol hijau di atas untuk mengirim ringkasan detail pesanan ke admin.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white text-[10px] font-bold">
              2
            </span>
            <span>
              <strong>Siapkan Identitas:</strong> Siapkan KTP atau SIM asli sebagai jaminan sewa saat pengambilan alat.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white text-[10px] font-bold">
              3
            </span>
            <span>
              <strong>Ambil Alat di Basecamp:</strong> Cek kondisi fisik & kelengkapan peralatan bersama tim kami sebelum berangkat!
            </span>
          </li>
        </ol>
      </div>

      {/* Back to Catalog */}
      <div className="mt-6 text-center">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-primary hover:underline"
        >
          ← Kembali ke Katalog Peralatan
        </Link>
      </div>
    </div>
  );
}
