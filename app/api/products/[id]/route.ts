/**
 * API Route: PATCH/DELETE /api/products/[id] — PHASE 10 (admin).
 *
 * Mengubah / menghapus satu produk. Hanya untuk admin login (401
 * kalau belum). Parameter `id` adalah Prisma cuid.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteProduct, parseProductInput, updateProduct } from "@/lib/admin";

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

  const input = parseProductInput(body);
  if (!input) {
    return NextResponse.json(
      { ok: false, error: "Data produk tidak lengkap atau format salah." },
      { status: 400 }
    );
  }

  const result = await updateProduct(id, input);
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

  const result = await deleteProduct(id);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
