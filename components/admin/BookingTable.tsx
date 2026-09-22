/**
 * Tabel daftar booking (Phase 11) — dipakai di dashboard (booking
 * terbaru) dan halaman /admin/bookings supaya tampilannya konsisten.
 * Server-compatible (tanpa "use client").
 */

import Link from "next/link";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import type { AdminBookingListItem } from "@/lib/admin";
import StatusBadge from "./StatusBadge";

export default function BookingTable({
  bookings,
}: {
  bookings: AdminBookingListItem[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-subtle bg-surface shadow-2xs">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-alt/50 text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
            <th className="px-4 py-3">ID Booking</th>
            <th className="px-4 py-3">Pelanggan</th>
            <th className="px-4 py-3">Periode Sewa</th>
            <th className="px-4 py-3">Total Biaya</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle/70">
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="hover:bg-surface-alt/40 transition-colors"
            >
              <td className="px-4 py-3.5">
                <span className="block font-mono text-xs font-bold text-foreground">
                  #{booking.id.slice(0, 10)}…
                </span>
                <span className="text-[11px] text-foreground-muted">
                  {booking._count.items} item alat
                </span>
              </td>
              <td className="px-4 py-3.5">
                <span className="block font-semibold text-foreground">
                  {booking.customerName}
                </span>
                <span className="text-xs text-foreground-muted">
                  {booking.whatsapp}
                </span>
              </td>
              <td className="px-4 py-3.5 text-xs text-foreground-muted">
                <span className="font-medium text-foreground">
                  {formatTanggal(booking.startDate)}
                </span>{" "}
                →{" "}
                <span className="font-medium text-foreground">
                  {formatTanggal(booking.endDate)}
                </span>
              </td>
              <td className="px-4 py-3.5 font-bold text-brand-primary">
                {formatRupiah(booking.totalPrice)}
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={booking.status} />
              </td>
              <td className="px-4 py-3.5 text-right">
                <Link
                  href={`/admin/bookings/${booking.id}`}
                  className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-surface px-3 py-1 text-xs font-semibold text-brand-primary hover:border-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-2xs"
                >
                  <span>Detail</span>
                  <span>→</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
