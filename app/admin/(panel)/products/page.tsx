/**
 * Kelola Produk (Phase 10) — menggantikan placeholder Phase 1.
 *
 * Server Component: query produk + kategori lewat lib/catalog.ts
 * (pola yang sama dengan halaman katalog customer), lalu diteruskan ke
 * ProductsManager (client) untuk aksi tambah/ubah/hapus.
 */

import { getCategories, getProducts } from "@/lib/catalog";
import ProductsManager from "@/components/admin/ProductsManager";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground sm:text-3xl">
        Kelola Produk
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        {products.length} produk terdaftar.
      </p>

      <div className="mt-6">
        <ProductsManager products={products} categories={categories} />
      </div>
    </div>
  );
}
