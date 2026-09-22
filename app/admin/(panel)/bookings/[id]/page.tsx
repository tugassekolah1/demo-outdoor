/**
 * Detail Booking (Phase 11).
 *
 * Server Component: mengambil satu booking lewat lib/admin.ts
 * berdasarkan `id` di URL. Menampilkan data pelanggan, item produk,
 * total, dan kartu status untuk mengubah booking
 * (Pending → Confirmed → Ongoing → Completed, plus Cancelled —
 * lihat BOOKING_STATUS_TRANSITIONS di types/index.ts).
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingDetail } from "@/lib/admin";
import { calculateRentalDays } from "@/lib/booking";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import StatusBadge from "@/components/admin/StatusBadge";
import BookingStatusChanger from "@/components/admin/BookingStatusChanger";
import ProductImage from "@/components/customer/ProductImage";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingDetail(id);

  if (!booking) {
    notFound();
  }

  const rentalDays = calculateRentalDays(booking.startDate, booking.endDate);

  return (
    <div>
      <Link
        href="/admin/bookings"
        className="text-sm font-medium text-brand-primary hover:underline"
      >
        ← Kembali ke daftar booking
      </Link>

      <div className="mt-3">
        <h1 className="font-display text-2xl text-foreground sm:text-3xl">
          Detail Booking
        </h1>
        <p className="mt-1 font-mono text-xs text-foreground-muted">
          {booking.id}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Kolom kiri: data pelanggan + item produk */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="rounded-md border border-border-subtle bg-surface p-5">
            <h2 className="font-medium text-foreground">Data Pelanggan</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-foreground-muted">Nama</dt>
                <dd className="font-medium text-foreground">
                  {booking.customerName}
                </dd>
              </div>
              <div>
                <dt className="text-foreground-muted">WhatsApp</dt>
                <dd className="font-medium text-foreground">
                  {booking.whatsapp}
                </dd>
              </div>
              <div>
                <dt className="text-foreground-muted">Tanggal Mulai</dt>
                <dd className="font-medium text-foreground">
                  {formatTanggal(booking.startDate)}
                </dd>
              </div>
              <div>
                <dt className="text-foreground-muted">Tanggal Selesai</dt>
                <dd className="font-medium text-foreground">
                  {formatTanggal(booking.endDate)}
                </dd>
              </div>
              <div>
                <dt className="text-foreground-muted">Durasi Sewa</dt>
                <dd className="font-medium text-foreground">
                  {rentalDays} hari
                </dd>
              </div>
              <div>
                <dt className="text-foreground-muted">Dibuat</dt>
                <dd className="font-medium text-foreground">
                  {formatTanggal(booking.createdAt)}
                </dd>
              </div>
              {booking.note && (
                <div className="col-span-2">
                  <dt className="text-foreground-muted">Catatan</dt>
                  <dd className="font-medium text-foreground">
                    {booking.note}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-md border border-border-subtle bg-surface p-5">
            <h2 className="font-medium text-foreground">Produk Disewa</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {booking.items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.name}
                      categorySlug=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {item.product.name}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      {formatRupiah(item.price)} / hari × {item.quantity} ×{" "}
                      {rentalDays} hari
                    </span>
                  </div>
                  <span className="shrink-0 self-center text-right text-sm font-semibold text-foreground">
                    {formatRupiah(item.subtotal)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-4 text-base">
              <span className="font-semibold text-foreground">Total Harga</span>
              <span className="font-bold text-brand-primary">
                {formatRupiah(booking.totalPrice)}
              </span>
            </div>
          </section>
        </div>

        {/* Kolom kanan: status booking */}
        <div className="flex flex-col gap-6">
          <section className="rounded-md border border-border-subtle bg-surface p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-medium text-foreground">Status Booking</h2>
              <StatusBadge status={booking.status} />
            </div>
            <div className="mt-4">
              <BookingStatusChanger
                bookingId={booking.id}
                status={booking.status}
              />
            </div>
            <p className="mt-4 text-xs text-foreground-muted">
              Alur normal: Menunggu Konfirmasi → Dikonfirmasi → Sedang
              Berjalan → Selesai. Pembatalan mengembalikan stok produk
              otomatis.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
