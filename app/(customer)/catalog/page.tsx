import Link from "next/link";
import { getCategories, getProducts } from "@/lib/catalog";
import ProductCard from "@/components/customer/ProductCard";
import CatalogFilters from "@/components/customer/CatalogFilters";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const category = params.category ?? "semua";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ q, category }),
  ]);

  const activeCategoryName =
    category !== "semua"
      ? categories.find((c) => c.slug === category)?.name
      : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-foreground-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-primary transition-colors flex items-center gap-1">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Beranda
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">Katalog Peralatan</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle/80 pb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Katalog Peralatan
          </h1>
          <p className="mt-1.5 text-sm text-foreground-muted">
            Menampilkan <strong className="text-foreground">{products.length}</strong> unit alat siap pakai
            {activeCategoryName ? ` di kategori ${activeCategoryName}` : ""}
            {q ? ` untuk kata kunci "${q}"` : ""}.
          </p>
        </div>

        {/* Quick Help Pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-surface-alt px-3.5 py-1.5 text-xs text-foreground-muted border border-border-subtle">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Semua unit dicek sebelum diserahkan</span>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6">
        <CatalogFilters key={q} categories={categories} />
      </div>

      {/* Product Grid or Empty State */}
      {products.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border-subtle bg-surface p-12 text-center shadow-2xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary-tint text-2xl text-brand-primary">
            🔍
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Produk tidak ditemukan
          </h3>
          <p className="mt-1 text-sm text-foreground-muted max-w-sm mx-auto">
            Tidak ada produk yang cocok dengan pencarian &ldquo;{q}&rdquo;. Coba gunakan kata kunci lain atau reset filter.
          </p>
          <Link
            href="/catalog"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-primary-dark"
          >
            Reset Semua Filter
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
