/**
 * API Route: POST /api/categories — PHASE 10 (admin).
 *
 * Membuat kategori baru (field: name; slug dibuat otomatis dari name).
 * Hanya untuk admin login (401 kalau belum).
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { createCategory, parseNameInput } from "@/lib/admin";

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

  const input = parseNameInput(body);
  if (!input) {
    return NextResponse.json(
      { ok: false, error: "Nama kategori tidak valid." },
      { status: 400 }
    );
  }

  const result = await createCategory(input.name);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
