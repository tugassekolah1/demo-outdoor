/**
 * API Route: PATCH/DELETE /api/categories/[id] — PHASE 10 (admin).
 *
 * Mengubah nama / menghapus satu kategori. Hanya untuk admin login
 * (401 kalau belum).
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteCategory, parseNameInput, updateCategory } from "@/lib/admin";

async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak berwenang. Silakan login sebagai admin." },
      { status: 401 }
    );
  }
  return null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

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

  const result = await updateCategory(id, input.name);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  const result = await deleteCategory(id);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
