/**
 * Badge status booking (Phase 11) — dipakai dashboard, daftar booking,
 * dan detail booking supaya warnanya konsisten di semua halaman admin.
 * Server-compatible (tanpa "use client"), berisi presentasi saja.
 */

import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABEL,
  type BookingStatus,
} from "@/types";

const STATUS_STYLE: Record<BookingStatus, { bg: string; text: string; dot: string; border: string }> = {
  PENDING: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    dot: "bg-amber-500",
    border: "border-amber-200",
  },
  CONFIRMED: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  ONGOING: {
    bg: "bg-sky-50",
    text: "text-sky-800",
    dot: "bg-sky-500",
    border: "border-sky-200",
  },
  COMPLETED: {
    bg: "bg-brand-primary-tint",
    text: "text-brand-primary",
    dot: "bg-brand-primary",
    border: "border-brand-primary/20",
  },
  CANCELLED: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    border: "border-rose-200",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const known = (BOOKING_STATUSES as string[]).includes(status);
  const label = known
    ? BOOKING_STATUS_LABEL[status as BookingStatus]
    : status;
  const conf = known
    ? STATUS_STYLE[status as BookingStatus]
    : {
        bg: "bg-stone-50",
        text: "text-stone-700",
        dot: "bg-stone-400",
        border: "border-stone-200",
      };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${conf.bg} ${conf.text} ${conf.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${conf.dot}`} />
      {label}
    </span>
  );
}
