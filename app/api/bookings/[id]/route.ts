/**
 * API Route: PATCH /api/bookings/[id] — PHASE 11 (admin).
 *
 * Mengubah status booking: { status: "CONFIRMED" | ... }.
 * Transisi divalidasi di `lib/admin.ts` (alur PENDING → CONFIRMED →
 * ONGOING → COMPLETED, plus CANCELLED bila diperlukan).
 *
 * Endpoint tulis ini DILINDUNGI login admin (401 kalau belum) —
 * catatan di app/api/bookings/route.ts (Phase 7) tetap berlaku: tidak
 * ada GET list semua booking untuk publik; list hanya lewat halaman
 * panel admin yang sudah dilindungi.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateBookingStatus } from "@/lib/admin";
import { BOOKING_STATUSES, type BookingStatus } from "@/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak berwenang. Silakan login sebagai admin." },
      { status: 401 }
    );
  }

  const { id } = await params;

  let body: { status?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body request tidak valid (bukan JSON)." },
      { status: 400 }
    );
  }

  if (
    typeof body.status !== "string" ||
    !BOOKING_STATUSES.includes(body.status as BookingStatus)
  ) {
    return NextResponse.json(
      { ok: false, error: "Status booking tidak valid." },
      { status: 400 }
    );
  }

  const result = await updateBookingStatus(id, body.status as BookingStatus);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.notFound ? 404 : 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
