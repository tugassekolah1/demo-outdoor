/**
 * lib/auth.ts — PHASE 9: autentikasi admin.
 *
 * Sengaja dibuat sederhana dan TANPA library auth tambahan (tidak ada
 * NextAuth, tidak ada tabel session baru) — sesuai keputusan teknis di
 * PROJECT_CONTEXT.md.
 *
 * Desain:
 *
 * 1. CREDENTIAL
 *    - Utama: environment variable `ADMIN_EMAIL` & `ADMIN_PASSWORD`
 *      (mudah diubah untuk demo, tidak perlu menyentuh database).
 *    - Fallback: kalau env tidak diisi, dicek ke tabel `User` yang sudah
 *      ada di schema — password disimpan sebagai hash PBKDF2-SHA256
 *      (format `pbkdf2$<iterasi>$<salt>$<hash>`), bukan plain text.
 *
 * 2. SESSION
 *    - Cookie HttpOnly `tapak_admin_session` berisi token
 *      `base64url(payload).base64url(signature)`; payload = JSON
 *      berisi email + waktu kedaluwarsa (7 hari).
 *    - Signature = HMAC-SHA256 memakai Web Crypto (`crypto.subtle`),
 *      bawaan Node 18+ maupun Edge runtime — jadi tidak ada dependency
 *      baru dan file ini aman dipakai dari route handler maupun
 *      Server Component.
 *    - Secret diturunkan dari `AUTH_SECRET` (fallback:
 *      `ADMIN_PASSWORD`, lalu string demo — cukup untuk demo lokal,
 *      GANTI di production).
 *
 * 3. PROTEKSI ROUTE ADMIN (lapisan ganda)
 *    - Halaman panel: `app/admin/(panel)/layout.tsx` redirect ke
 *      `/admin/login` kalau session tidak valid. Halaman login sengaja
 *      berada DI LUAR route group `(panel)` supaya tetap terjangkau
 *      saat belum login.
 *    - Endpoint tulis admin (`/api/products`, `/api/categories`,
 *      `/api/bookings/[id]`): tiap handler memanggil
 *      `getAdminSession()` lebih dulu dan membalas 401 bila belum
 *      login — jadi API tetap aman walau dipanggil langsung tanpa
 *      lewat halaman.
 */

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/** Nama cookie session admin. */
export const SESSION_COOKIE = "tapak_admin_session";

/** Lama berlaku session: 7 hari (dalam detik). */
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** Opsi baku untuk set/clear cookie session (dipakai route login & logout). */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
  // Sengaja TIDAK menyet `secure: true` supaya cookie tetap jalan di
  // `localhost` (http). Di production (https) sebaiknya ditambahkan.
};

/** Iterasi PBKDF2 untuk hash password admin (tabel User). */
const PBKDF2_ITERATIONS = 100_000;

// ------------------------------------------------------------
// Helper dasar (Web Crypto — jalan di Node maupun Edge runtime).
// ------------------------------------------------------------

function getSessionSecret(): string {
  return (
    process.env.AUTH_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    // Fallback terakhir hanya untuk demo lokal. Production WAJIB
    // mengisi AUTH_SECRET.
    "tapak-outdoor-rental-demo-secret"
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Return type sengaja tidak dianotasi agar TypeScript menyimpulkan
// `Uint8Array<ArrayBuffer>` (kompatibel dengan BufferSource Web Crypto).
function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function encodeText(text: string): string {
  return toBase64Url(new TextEncoder().encode(text));
}

function decodeText(value: string): string {
  return new TextDecoder().decode(fromBase64Url(value));
}

/** Perbandingan string tahan timing-attack sederhana (demo-grade). */
function secureEquals(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) {
    diff |= ab[i] ^ bb[i];
  }
  return diff === 0;
}

async function hmacSign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return toBase64Url(new Uint8Array(signature));
}

// ------------------------------------------------------------
// Session token (sign & verify).
// ------------------------------------------------------------

export type AdminSession = { email: string };

/** Membuat token session untuk email admin tertentu. */
export async function signSessionToken(email: string): Promise<string> {
  const payload = encodeText(
    JSON.stringify({
      email,
      exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    })
  );
  const signature = await hmacSign(payload);
  return `${payload}.${signature}`;
}

/**
 * Memverifikasi token session. Mengembalikan `{ email }` kalau valid
 * (signature cocok & belum kedaluwarsa), atau `null` kalau tidak.
 */
export async function verifySessionToken(
  token: string | null | undefined
): Promise<AdminSession | null> {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  if (!payload || !signature) return null;

  const expected = await hmacSign(payload);
  if (!secureEquals(signature, expected)) return null;

  try {
    const data = JSON.parse(decodeText(payload)) as {
      email?: unknown;
      exp?: unknown;
    };
    if (typeof data.email !== "string" || data.email.length === 0) return null;
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

/** Ambil session admin dari cookie request berjalan (untuk halaman & API). */
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

// ------------------------------------------------------------
// Credential (env variables, fallback ke tabel User).
// ------------------------------------------------------------

export type CredentialCheck = { ok: true } | { ok: false; error: string };

/**
 * Cek email + password admin.
 *
 * Prioritas 1: `ADMIN_EMAIL` & `ADMIN_PASSWORD` dari .env.
 * Prioritas 2: tabel `User` (password hash PBKDF2).
 */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<CredentialCheck> {
  const normalizedEmail = email.trim().toLowerCase();
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD;

  if (envEmail && envPassword) {
    const ok =
      secureEquals(normalizedEmail, envEmail) &&
      secureEquals(password, envPassword);
    return ok ? { ok: true } : { ok: false, error: "Email atau password salah." };
  }

  // Fallback: akun di tabel User (sudah ada di schema sejak Phase 2).
  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (user) {
      const ok = await verifyPassword(password, user.password);
      return ok
        ? { ok: true }
        : { ok: false, error: "Email atau password salah." };
    }
  } catch (err) {
    console.error("Gagal mengecek kredensial admin:", err);
    return {
      ok: false,
      error: "Gagal mengecek kredensial. Coba lagi.",
    };
  }

  // Tidak ada env & tidak ada user yang cocok → kemungkinan besar
  // admin memang belum dikonfigurasi sama sekali.
  return {
    ok: false,
    error:
      "Belum ada akun admin. Isi ADMIN_EMAIL & ADMIN_PASSWORD di .env (atau buat akun di tabel User).",
  };
}

// ------------------------------------------------------------
// Hash password (PBKDF2 via Web Crypto) — dipakai untuk akun di
// tabel User, mis. saat ingin menanam admin lewat script seed.
// ------------------------------------------------------------

async function pbkdf2(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256
  );
  return new Uint8Array(bits);
}

/** Hash password menjadi format `pbkdf2$<iterasi>$<salt>$<hash>`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(hash)}`;
}

/** Verifikasi password terhadap hash bertanda `pbkdf2$...`. */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;

  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 1) return false;

  try {
    const salt = fromBase64Url(parts[2]);
    const expected = fromBase64Url(parts[3]);
    const actual = await pbkdf2(password, salt, iterations);
    if (actual.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
    return diff === 0;
  } catch {
    return false;
  }
}
