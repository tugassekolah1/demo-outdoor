/**
 * API Route: POST /api/auth/logout — PHASE 9.
 *
 * Menghapus cookie session admin lalu mengarahkan kembali ke halaman
 * login. Dipanggil lewat form HTML biasa (method="post") di AdminNav,
 * jadi responsnya redirect (303), bukan JSON.
 */

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/admin/login", request.url),
    303
  );
  // Set cookie kosong dengan maxAge 0 → ikut terhapus di browser.
  response.cookies.set(SESSION_COOKIE, "", {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return response;
}
