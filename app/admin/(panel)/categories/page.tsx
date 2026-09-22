/**
 * Kelola Kategori (Phase 10) — menggantikan placeholder Phase 1.
 *
 * Server Component: query kategori (dengan jumlah produk per kategori)
 * lewat lib/catalog.ts, lalu diteruskan ke CategoriesManager (client)
 * untuk aksi tambah/ubah/hapus.
 */

import { getCategories } from "@/lib/catalog";
import CategoriesManager from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground sm:text-3xl">
        Kelola Kategori
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        {categories.length} kategori terdaftar.
      </p>

      <div className="mt-6">
        <CategoriesManager categories={categories} />
      </div>
    </div>
  );
}
