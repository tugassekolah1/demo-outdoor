/**
 * Data access & logic layer untuk PANEL ADMIN — PHASE 10 & 11.
 *
 * Pola mengikuti `lib/catalog.ts` / `lib/booking.ts`: semua query
 * Prisma untuk admin terpusat di sini. Dipanggil dari:
 * - halaman Server Component panel admin (dashboard, list produk,
 *   kategori, booking, detail booking), dan
 * - route handler `/api/**` untuk operasi tulis (semua route handler
 *   ini memeriksa login admin lewat `getAdminSession()` dari
 *   `lib/auth.ts` SEBELUM memanggil fungsi di sini).
 *
 * Tipe ditulis manual (bukan `Prisma.XxxGetPayload<...>`) — alasan
 * teknis yang sama seperti di lib/catalog.ts, lihat Bagian 8
 * PROJECT_CONTEXT.md.
 */

import { prisma } from "@/lib/prisma";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABEL,
  BOOKING_STATUS_TRANSITIONS,
  type BookingStatus,
} from "@/types";

/** Hasil operasi tulis admin: sukses, atau gagal + pesan yang bisa ditampilkan. */
export type ActionResult = { ok: true } | { ok: false; error: string };

// ============================================================
// Dashboard — ringkasan angka
// ============================================================

export type AdminStats = {
  products: number;
  categories: number;
  bookings: number;
  pendingBookings: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const [products, categories, bookings, pendingBookings] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
  ]);
  return { products, categories, bookings, pendingBookings };
}

// ============================================================
// Booking — daftar, detail, ubah status (Phase 11)
// ============================================================

export type AdminBookingListItem = {
  id: string;
  customerName: string;
  whatsapp: string;
  startDate: Date;
  endDate: Date;
  status: string;
  totalPrice: number;
  createdAt: Date;
  _count: { items: number };
};

/** Daftar booking (terbaru dulu), opsional dibatasi `take` (dashboard). */
export async function getBookings(take?: number): Promise<AdminBookingListItem[]> {
  return prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
    ...(take ? { take } : {}),
  });
}

export type AdminBookingDetail = {
  id: string;
  customerName: string;
  whatsapp: string;
  startDate: Date;
  endDate: Date;
  note: string | null;
  status: string;
  totalPrice: number;
  createdAt: Date;
  items: {
    id: string;
    quantity: number;
    price: number;
    subtotal: number;
    product: { id: string; name: string; slug: string; image: string | null };
  }[];
};

export async function getBookingDetail(
  id: string
): Promise<AdminBookingDetail | null> {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, image: true },
          },
        },
      },
    },
  });
}

export type UpdateBookingStatusResult =
  | { ok: true }
  | { ok: false; error: string; notFound?: boolean };

/**
 * Mengubah status booking (Phase 11).
 *
 * - Status tujuan divalidasi terhadap `BOOKING_STATUSES`.
 * - Transisi harus diizinkan `BOOKING_STATUS_TRANSITIONS`
 *   (PENDING → CONFIRMED → ONGOING → COMPLETED, plus CANCELLED dari
 *   PENDING/CONFIRMED/ONGOING).
 * - Saat berubah ke CANCELLED, stok produk DIKEMBALIKAN (booking tidak
 *   jadi, barang tidak keluar gudang). CANCELLED bersifat terminal,
 *   jadi stok tidak mungkin dikembalikan dua kali.
 * - Semua dalam satu transaksi Prisma.
 */
export async function updateBookingStatus(
  id: string,
  nextStatus: BookingStatus
): Promise<UpdateBookingStatusResult> {
  if (!BOOKING_STATUSES.includes(nextStatus)) {
    return { ok: false, error: "Status booking tidak valid." };
  }

  try {
    // Catatan tipe: parameter `tx` sengaja TIDAK diberi anotasi
    // `typeof prisma` — dengan Prisma Client yang sudah ter-generate
    // penuh, tipe callback `$transaction` memakai klien tanpa method
    // transaksi (Omit<PrismaClient, "$transaction" | ...>), jadi biarkan
    // TypeScript menyimpulkannya sendiri dari overload yang cocok.
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!booking) {
        return { ok: false, error: "Booking tidak ditemukan.", notFound: true };
      }

      const current = booking.status as BookingStatus;
      const allowed = BOOKING_STATUS_TRANSITIONS[current] ?? [];
      if (!allowed.includes(nextStatus)) {
        return {
          ok: false,
          error: `Tidak bisa mengubah status dari "${
            BOOKING_STATUS_LABEL[current] ?? current
          }" ke "${BOOKING_STATUS_LABEL[nextStatus]}".`,
        };
      }

      // Kembalikan stok saat booking dibatalkan.
      if (nextStatus === "CANCELLED") {
        for (const item of booking.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      await tx.booking.update({ where: { id }, data: { status: nextStatus } });
      return { ok: true };
    });
  } catch (err) {
    console.error("Gagal mengubah status booking:", err);
    return { ok: false, error: "Gagal mengubah status booking. Coba lagi." };
  }
}

// ============================================================
// Produk — CRUD (Phase 10)
// ============================================================

export type ProductInput = {
  name: string;
  description: string;
  pricePerDay: number;
  stock: number;
  categoryId: string;
  image?: string;
};

/**
 * Membaca body request menjadi `ProductInput`.
 * Hanya cek BENTUK data; isi (nama, harga, stok, dll) divalidasi di
 * `validateProductInput`. Mengembalikan `null` kalau bentuk salah.
 */
export function parseProductInput(body: unknown): ProductInput | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  if (typeof b.name !== "string") return null;
  if (typeof b.description !== "string") return null;
  if (typeof b.pricePerDay !== "number") return null;
  if (typeof b.stock !== "number") return null;
  if (typeof b.categoryId !== "string") return null;
  if (b.image !== undefined && typeof b.image !== "string") return null;

  return {
    name: b.name,
    description: b.description,
    pricePerDay: b.pricePerDay,
    stock: b.stock,
    categoryId: b.categoryId,
    image: typeof b.image === "string" ? b.image : undefined,
  };
}

function validateProductInput(input: ProductInput): string | null {
  if (input.name.trim().length < 2) {
    return "Nama produk wajib diisi, minimal 2 karakter.";
  }
  if (input.description.trim().length < 5) {
    return "Deskripsi wajib diisi, minimal 5 karakter.";
  }
  if (!Number.isInteger(input.pricePerDay) || input.pricePerDay <= 0) {
    return "Harga per hari harus berupa angka lebih dari 0.";
  }
  if (!Number.isInteger(input.stock) || input.stock < 0) {
    return "Stok harus berupa angka 0 atau lebih.";
  }
  if (!input.categoryId) {
    return "Kategori harus dipilih.";
  }
  return null;
}

/** Slug sederhana: huruf kecil, angka, dipisah tanda minus. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueProductSlug(base: string): Promise<string> {
  const root = base || "produk";
  let slug = root;
  for (let n = 2; n <= 100; n++) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${root}-${n}`;
  }
  return `${root}-${Date.now()}`;
}

async function uniqueCategorySlug(base: string): Promise<string> {
  const root = base || "kategori";
  let slug = root;
  for (let n = 2; n <= 100; n++) {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${root}-${n}`;
  }
  return `${root}-${Date.now()}`;
}

export async function createProduct(raw: ProductInput): Promise<ActionResult> {
  const input: ProductInput = {
    ...raw,
    name: raw.name.trim(),
    description: raw.description.trim(),
    image: raw.image?.trim(),
  };

  const error = validateProductInput(input);
  if (error) return { ok: false, error };

  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
  });
  if (!category) return { ok: false, error: "Kategori tidak ditemukan." };

  try {
    // Slug dibuat dari nama, unik (kalau tabrakan ditambahi suffix).
    const slug = await uniqueProductSlug(slugify(input.name));
    await prisma.product.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        pricePerDay: input.pricePerDay,
        stock: input.stock,
        image: input.image || null,
        categoryId: input.categoryId,
      },
    });
    return { ok: true };
  } catch (err) {
    console.error("Gagal membuat produk:", err);
    return { ok: false, error: "Gagal menyimpan produk. Coba lagi." };
  }
}

export async function updateProduct(
  id: string,
  raw: ProductInput
): Promise<ActionResult> {
  const input: ProductInput = {
    ...raw,
    name: raw.name.trim(),
    description: raw.description.trim(),
    image: raw.image?.trim(),
  };

  const error = validateProductInput(input);
  if (error) return { ok: false, error };

  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
  });
  if (!category) return { ok: false, error: "Kategori tidak ditemukan." };

  try {
    // Slug TIDAK diubah saat edit — supaya link /product/<slug> yang
    // sudah dibagikan tidak pecah.
    await prisma.product.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        pricePerDay: input.pricePerDay,
        stock: input.stock,
        image: input.image || null,
        categoryId: input.categoryId,
      },
    });
    return { ok: true };
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "P2025") {
      return { ok: false, error: "Produk tidak ditemukan." };
    }
    console.error("Gagal mengubah produk:", err);
    return { ok: false, error: "Gagal menyimpan produk. Coba lagi." };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    await prisma.product.delete({ where: { id } });
    return { ok: true };
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "P2003") {
      return {
        ok: false,
        error:
          "Produk tidak bisa dihapus karena masih direferensikan data booking (histori booking harus tetap utuh).",
      };
    }
    if (code === "P2025") {
      return { ok: false, error: "Produk tidak ditemukan." };
    }
    console.error("Gagal menghapus produk:", err);
    return { ok: false, error: "Gagal menghapus produk. Coba lagi." };
  }
}

// ============================================================
// Kategori — CRUD (Phase 10)
// ============================================================

/** Membaca body request jadi `{ name }`, atau `null` kalau bentuk salah. */
export function parseNameInput(body: unknown): { name: string } | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  if (typeof b.name !== "string") return null;
  return { name: b.name };
}

export async function createCategory(rawName: string): Promise<ActionResult> {
  const name = rawName.trim();
  if (name.length < 2) {
    return { ok: false, error: "Nama kategori wajib diisi, minimal 2 karakter." };
  }

  try {
    const duplicate = await prisma.category.findUnique({ where: { name } });
    if (duplicate) return { ok: false, error: "Nama kategori sudah dipakai." };

    const slug = await uniqueCategorySlug(slugify(name));
    await prisma.category.create({ data: { name, slug } });
    return { ok: true };
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "P2002") {
      return { ok: false, error: "Nama kategori sudah dipakai." };
    }
    console.error("Gagal membuat kategori:", err);
    return { ok: false, error: "Gagal menyimpan kategori. Coba lagi." };
  }
}

export async function updateCategory(
  id: string,
  rawName: string
): Promise<ActionResult> {
  const name = rawName.trim();
  if (name.length < 2) {
    return { ok: false, error: "Nama kategori wajib diisi, minimal 2 karakter." };
  }

  try {
    const duplicate = await prisma.category.findUnique({ where: { name } });
    if (duplicate && duplicate.id !== id) {
      return { ok: false, error: "Nama kategori sudah dipakai." };
    }

    // Slug tidak diubah saat edit (sama alasan dengan produk).
    await prisma.category.update({ where: { id }, data: { name } });
    return { ok: true };
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "P2025") {
      return { ok: false, error: "Kategori tidak ditemukan." };
    }
    console.error("Gagal mengubah kategori:", err);
    return { ok: false, error: "Gagal menyimpan kategori. Coba lagi." };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await prisma.category.delete({ where: { id } });
    return { ok: true };
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "P2003") {
      return {
        ok: false,
        error: "Kategori masih berisi produk. Pindahkan atau hapus produknya dulu.",
      };
    }
    if (code === "P2025") {
      return { ok: false, error: "Kategori tidak ditemukan." };
    }
    console.error("Gagal menghapus kategori:", err);
    return { ok: false, error: "Gagal menghapus kategori. Coba lagi." };
  }
}
