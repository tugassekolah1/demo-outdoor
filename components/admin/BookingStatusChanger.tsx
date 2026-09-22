"use client";

/**
 * Pengubah status booking (Phase 11).
 *
 * Tombol yang ditampilkan diambil dari `BOOKING_STATUS_TRANSITIONS`
 * (types/index.ts) — jadi UI selalu sinkron dengan aturan transisi
 * yang divalidasi di server (lib/admin.ts). Status final (COMPLETED /
 * CANCELLED) tidak menampilkan tombol apa pun.
 *
 * Perubahan dikirim ke PATCH /api/bookings/[id]; setelah sukses,
 * `router.refresh()` memperbarui halaman detail (Server Component).
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABEL,
  BOOKING_STATUS_TRANSITIONS,
  type BookingStatus,
} from "@/types";

type Props = {
  bookingId: string;
  status: string;
};

export default function BookingStatusChanger({ bookingId, status }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const current = ((BOOKING_STATUSES as string[]).includes(status)
    ? status
    : "PENDING") as BookingStatus;
  const options = BOOKING_STATUS_TRANSITIONS[current];

  async function changeStatus(next: BookingStatus) {
    if (
      next === "CANCELLED" &&
      !window.confirm(
        "Batalkan booking ini? Stok produk akan otomatis dikembalikan."
      )
    ) {
      return;
    }

    setError(null);
    setBusy(next);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Gagal mengubah status. Coba lagi.");
        setBusy(null);
        return;
      }

      setBusy(null);
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server. Periksa koneksi dan coba lagi.");
      setBusy(null);
    }
  }

  if (options.length === 0) {
    return (
      <p className="text-sm text-foreground-muted">
        Status ini sudah final — tidak bisa diubah lagi.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-foreground-muted">Ubah status ke:</p>
      <div className="flex flex-wrap gap-2">
        {options.map((next) => {
          const isCancel = next === "CANCELLED";
          return (
            <button
              key={next}
              type="button"
              disabled={busy !== null}
              onClick={() => changeStatus(next)}
              className={`rounded-sm px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                isCancel
                  ? "border border-red-300 text-red-600 hover:bg-red-50"
                  : "bg-brand-primary text-white hover:bg-brand-primary-dark"
              }`}
            >
              {busy === next
                ? "Menyimpan..."
                : `${isCancel ? "Batalkan → " : "→ "}${BOOKING_STATUS_LABEL[next]}`}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="rounded-sm border border-brand-accent/40 bg-brand-accent/5 px-3 py-2 text-sm text-brand-accent-dark">
          {error}
        </p>
      )}
    </div>
  );
}
