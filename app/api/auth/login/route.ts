/**
 * API Route: POST /api/auth/login — PHASE 9.
 *
 * Menerima { email, password } dari form login admin, memverifikasi
 * credential (env variables, fallback tabel User — lihat lib/auth.ts),
 * lalu menyetel cookie session HttpOnly.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  signSessionToken,
  verifyAdminCredentials,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  let body: { email?: unknown; password?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body request tidak valid (bukan JSON)." },
      { status: 400 }
    );
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "Email dan password harus diisi." },
      { status: 400 }
    );
  }

  const check = await verifyAdminCredentials(email, password);
  if (!check.ok) {
    // 401 untuk credential salah, 500 untuk masalah konfigurasi/DB —
    // pesannya tetap ditampilkan apa adanya ke form login.
    const status = check.error.startsWith("Gagal") ? 500 : 401;
    return NextResponse.json({ ok: false, error: check.error }, { status });
  }

  const token = await signSessionToken(email.trim().toLowerCase());
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return response;
}
