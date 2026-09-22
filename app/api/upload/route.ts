/**
 * API Route: POST /api/upload — upload gambar produk (admin).
 *
 * Tanpa dependency tambahan: memakai `request.formData()` (Web API
 * bawaan route handler Next.js) + `fs/promises` bawaan Node untuk
 * menyimpan file ke `public/images/products/` — folder yang sama
 * dengan path gambar di data seed (lihat prisma/seed.ts) dan yang
 * dicoba dimuat `components/customer/ProductImage.tsx`, jadi field
 * `Product.image` cukup diisi URL publik hasil upload ini
 * (contoh: `/images/products/tenda-abc123.jpg`).
 *
 * Hanya admin yang sudah login (401 kalau belum).
 *
 * CATATAN DEPLOY: penyimpanan file langsung ke folder `public`
 * berjalan normal untuk demo lokal (`next dev` / `next start`).
 * Kalau nanti di-deploy ke serverless (mis. Vercel), file yang
 * ditulis saat runtime tidak bertahan — perlu penyimpanan eksternal
 * (itu di luar scope demo ini).
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/admin";

// `fs` hanya ada di runtime Node — route handler Next.js default-nya
// memang Node.js, dideklarasikan eksplisit supaya jelas ini sengaja.
export const runtime = "nodejs";

/** Batas ukuran file: 2 MB (demo — cukup untuk foto produk). */
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

/** Tipe MIME yang diterima → ekstensi file yang dipakai. */
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "products");
const PUBLIC_PREFIX = "/images/products";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak berwenang. Silakan login sebagai admin." },
      { status: 401 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Request harus berupa form upload (multipart/form-data)." },
      { status: 400 }
    );
  }

  const file = form.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "File gambar tidak ditemukan (field 'image')." },
      { status: 400 }
    );
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { ok: false, error: "Format gambar harus JPG, PNG, WebP, atau GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Ukuran gambar maksimal 2 MB." },
      { status: 400 }
    );
  }

  // Nama file dibuat dari nama asli (di-slugify) + suffix unik —
  // tidak ada potongan nama file user yang dipakai mentah-mentah
  // (mencegah path traversal), dan tidak bentrok antar upload.
  const base =
    slugify(file.name.replace(/\.[^.]+$/, "")) || "produk";
  const unique = `${Date.now().toString(36)}-${crypto
    .randomUUID()
    .slice(0, 6)}`;
  const filename = `${base}-${unique}.${extension}`;

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, filename), bytes);
  } catch (err) {
    console.error("Gagal menyimpan file gambar:", err);
    return NextResponse.json(
      { ok: false, error: "Gagal menyimpan file gambar di server. Coba lagi." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { ok: true, url: `${PUBLIC_PREFIX}/${filename}` },
    { status: 201 }
  );
}
