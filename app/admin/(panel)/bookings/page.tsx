/**
 * Kelola Booking (Phase 11) — menggantikan placeholder Phase 1.
 *
 * Server Component: daftar semua booking (terbaru dulu) lewat
 * lib/admin.ts. Detail & ubah status ada di /admin/bookings/[id].
 */

import { getBookings } from "@/lib/admin";
import BookingTable from "@/components/admin/BookingTable";

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground sm:text-3xl">
        Kelola Booking
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        {bookings.length} booking terdaftar.
      </p>

      <div className="mt-6">
        {bookings.length === 0 ? (
          <div className="rounded-md border border-dashed border-border-subtle py-16 text-center">
            <p className="font-semibold text-foreground">Belum ada booking</p>
            <p className="mt-1 text-sm text-foreground-muted">
              Booking dari customer akan muncul di sini.
            </p>
          </div>
        ) : (
          <BookingTable bookings={bookings} />
        )}
      </div>
    </div>
  );
}
