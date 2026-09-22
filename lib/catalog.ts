/**
 * Data access layer untuk katalog (Product & Category).
 *
 * Semua halaman customer (Server Components) mengambil data lewat
 * fungsi-fungsi di sini, bukan memanggil `prisma` langsung di tiap
 * page — supaya query katalog konsisten di satu tempat dan gampang
 * dipakai ulang (homepage butuh produk unggulan, catalog butuh
 * produk+filter, product detail butuh 1 produk+rekomendasi terkait).
 *
 * PHASE 4/5/6: dibuat bersamaan dengan frontend customer.
 * Belum ada sistem booking, jadi tidak ada query availability/stok
 * per-tanggal di sini — hanya `stock` statis dari Product.
 */

import { prisma } from "@/lib/prisma";

/**
 * Tipe di bawah ditulis manual (bukan lewat `Prisma.ProductGetPayload<...>`)
 * karena development project ini berjalan di sandbox tanpa akses ke
 * `binaries.prisma.sh`, sehingga `npx prisma generate` tidak bisa
 * menghasilkan type map penuh untuk schema — lihat Bagian 8
 * PROJECT_CONTEXT.md. Bentuknya tetap mengikuti field asli di
 * `schema.prisma` persis, jadi begitu `npx prisma generate` dijalankan
 * di lokal (dengan akses internet normal), tipe ini tetap kompatibel.
 */
export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductWithCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricePerDay: number;
  stock: number;
  image: string | null;
  categoryId: string;
  category: CategorySummary;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryWithCount = CategorySummary & {
  _count: { products: number };
};

/** Semua kategori, diurutkan alfabetis, plus jumlah produk per kategori. */
export async function getCategories(): Promise<CategoryWithCount[]> {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export type ProductFilter = {
  /** Kata kunci pencarian nama produk (case-insensitive, contains). */
  q?: string;
  /** Slug kategori untuk filter. */
  category?: string;
};

/** Daftar produk, opsional difilter berdasarkan kata kunci & kategori. */
export async function getProducts(
  filter: ProductFilter = {}
): Promise<ProductWithCategory[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};

  if (filter.q && filter.q.trim().length > 0) {
    where.name = { contains: filter.q.trim() };
  }

  if (filter.category && filter.category !== "semua") {
    where.category = { slug: filter.category };
  }

  return prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });
}

/** Satu produk berdasarkan slug, atau `null` jika tidak ditemukan. */
export async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

/**
 * Produk terkait: kategori sama, kecuali produk itu sendiri.
 * Dipakai di halaman detail produk sebagai rekomendasi.
 */
export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  take = 4
): Promise<ProductWithCategory[]> {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: excludeProductId },
    },
    include: { category: true },
    orderBy: { createdAt: "asc" },
    take,
  });
}

/**
 * Produk unggulan untuk homepage — untuk demo ini diambil dari produk
 * dengan stok terbanyak (proxy sederhana untuk "paling tersedia/populer",
 * karena belum ada data booking/penjualan nyata).
 */
export async function getFeaturedProducts(take = 4): Promise<ProductWithCategory[]> {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { stock: "desc" },
    take,
  });
}
