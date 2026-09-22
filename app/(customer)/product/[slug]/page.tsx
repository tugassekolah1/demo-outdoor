import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { formatRupiah } from "@/lib/utils";
import ProductImage from "@/components/customer/ProductImage";
import ProductCard from "@/components/customer/ProductCard";
import AddToCartForm from "@/components/customer/AddToCartForm";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.categoryId, product.id, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-foreground-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-primary transition-colors flex items-center gap-1">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Beranda
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-brand-primary transition-colors">
          Katalog
        </Link>
        <span>/</span>
        <Link
          href={`/catalog?category=${product.category.slug}`}
          className="hover:text-brand-primary transition-colors"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Showcase Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:gap-12 items-start">
        {/* Left: Product Visual Card */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-md">
            <ProductImage
              src={product.image}
              alt={product.name}
              categorySlug={product.category.slug}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/95 backdrop-blur-xs px-3 py-1 text-xs font-bold text-brand-primary shadow-xs border border-border-subtle">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Higienis & Siap Pakai
              </span>
            </div>
          </div>

          {/* Value Props Row */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl border border-border-subtle/80 bg-surface p-3 shadow-2xs">
              <span className="text-lg block">🧼</span>
              <span className="font-bold text-foreground block mt-1">Dicuci Bersih</span>
              <span className="text-[10px] text-foreground-muted">Tanpa bau apek</span>
            </div>
            <div className="rounded-xl border border-border-subtle/80 bg-surface p-3 shadow-2xs">
              <span className="text-lg block">🔍</span>
              <span className="font-bold text-foreground block mt-1">Cek Fungsi</span>
              <span className="text-[10px] text-foreground-muted">Resleting & frame OK</span>
            </div>
            <div className="rounded-xl border border-border-subtle/80 bg-surface p-3 shadow-2xs">
              <span className="text-lg block">💬</span>
              <span className="font-bold text-foreground block mt-1">Konfirmasi WA</span>
              <span className="text-[10px] text-foreground-muted">Admin responsif</span>
            </div>
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="flex flex-col space-y-6">
          <div>
            <span className="inline-flex items-center rounded-md bg-brand-primary-tint px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary">
              {product.category.name}
            </span>
            <h1 className="font-display mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Price Badge */}
            <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-alt/50 p-4">
              <span className="text-xs font-semibold text-foreground-muted block">
                Tarif Sewa Harian
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-brand-primary">
                  {formatRupiah(product.pricePerDay)}
                </span>
                <span className="text-sm font-medium text-foreground-muted">/ hari</span>
              </div>
              <p className="mt-1 text-[11px] text-foreground-muted">
                *Hitungan sewa dihitung per hari (inklusif tanggal ambil & kembali).
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              Deskripsi & Kondisi
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
              {product.description}
            </p>
          </div>

          {/* Add to Cart Form — info ketersediaan stok dipindah ke dalam
              form (tepat di bawah pemilih jumlah), seperti online shop
              pada umumnya. */}
          <div className="border-t border-border-subtle/80 pt-6">
            <AddToCartForm product={product} />
          </div>

          {/* Rental Terms Quick Note */}
          <div className="rounded-xl border border-border-subtle bg-surface p-4 text-xs text-foreground-muted space-y-1.5">
            <p className="font-bold text-foreground">Syarat & Ketentuan Sewa:</p>
            <ul className="list-disc pl-4 space-y-1 text-foreground-muted">
              <li>Jaminan berupa KTP / SIM asli saat pengambilan alat.</li>
              <li>Pengecekan fisik dan kelengkapan dilakukan bersama di basecamp.</li>
              <li>Kembalikan dalam kondisi wajar tanpa kerusakan struktural.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16 sm:mt-20 border-t border-border-subtle pt-12">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                Rekomendasi Terkait
              </span>
              <h2 className="font-display mt-1 text-xl sm:text-2xl font-bold text-foreground">
                Peralatan Sejenis
              </h2>
            </div>
            <Link
              href={`/catalog?category=${product.category.slug}`}
              className="text-sm font-semibold text-brand-primary hover:underline"
            >
              Lihat kategori ini →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
