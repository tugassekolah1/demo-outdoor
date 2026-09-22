/**
 * API Route: POST /api/bookings — PHASE 7.
 *
 * Menerima booking baru dari form customer (`/booking`). Dibutuhkan
 * sebagai API route (bukan Server Component langsung seperti katalog)
 * karena data keranjang ada di `localStorage` browser — hanya client
 * yang tahu isinya, jadi harus dikirim lewat POST body.
 *
 * SCOPE: hanya endpoint booking customer. Tidak ada GET list semua
 * booking (itu untuk admin, Phase 11 — sengaja tidak dibuat di sini).
 */

import { NextRequest, NextResponse } from "next/server";
import { createBooking, type CreateBookingInput } from "@/lib/booking";

export async function POST(request: NextRequest) {
  let body: Partial<CreateBookingInput>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body request tidak valid (bukan JSON)." },
      { status: 400 }
    );
  }

  // Pengecekan bentuk data dasar sebelum diteruskan ke lib/booking.ts
  // (yang melakukan validasi isi lebih detail). Ini hanya menjaga agar
  // tipe data sesuai sebelum diproses lebih lanjut.
  if (
    typeof body.customerName !== "string" ||
    typeof body.whatsapp !== "string" ||
    typeof body.startDate !== "string" ||
    typeof body.endDate !== "string" ||
    !Array.isArray(body.items)
  ) {
    return NextResponse.json(
      { ok: false, error: "Data booking tidak lengkap." },
      { status: 400 }
    );
  }

  const input: CreateBookingInput = {
    customerName: body.customerName,
    whatsapp: body.whatsapp,
    startDate: body.startDate,
    endDate: body.endDate,
    note: typeof body.note === "string" ? body.note : undefined,
    items: (body.items as unknown[])
      .filter((i) => typeof i === "object" && i !== null)
      .map((i) => {
        const obj = i as { productId?: unknown; quantity?: unknown };
        return {
          productId: String(obj.productId ?? ""),
          quantity: Number(obj.quantity ?? 0),
        };
      }),
  };

  const result = await createBooking(input);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, bookingId: result.booking.id }, { status: 201 });
}
