/**
 * API Route: POST /api/products — PHASE 10 (admin).
 *
 * Membuat produk baru. Hanya untuk admin yang sudah login
 * (dicek via `getAdminSession()`); kalau belum, membalas 401.
 * List produk TIDAK lewat GET di sini — halaman katalog/admin
 * meng-query Prisma langsung sebagai Server Component (pola yang
 * sudah ada sejak Phase 4-6).
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { createProduct, parseProductInput } from "@/lib/admin";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak berwenang. Silakan login sebagai admin." },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body request tidak valid (bukan JSON)." },
      { status: 400 }
    );
  }

  const input = parseProductInput(body);
  if (!input) {
    return NextResponse.json(
      { ok: false, error: "Data produk tidak lengkap atau format salah." },
      { status: 400 }
    );
  }

  const result = await createProduct(input);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
