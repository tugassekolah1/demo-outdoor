import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import ProductImage from "./ProductImage";
import type { ProductWithCategory } from "@/lib/catalog";

export default function ProductCard({ product }: { product: ProductWithCategory }) {
  const habis = product.stock <= 0;
  const isLowStock = !habis && product.stock <= 3;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-lg"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-alt">
        <ProductImage
          src={product.image}
          alt={product.name}
          categorySlug={product.category.slug}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center rounded-md bg-surface/90 px-2 py-0.5 text-[11px] font-semibold text-brand-primary backdrop-blur-xs shadow-xs border border-border-subtle/50">
            {product.category.name}
          </span>

          {habis ? (
            <span className="inline-flex items-center rounded-md bg-stone-900/90 px-2 py-0.5 text-[11px] font-medium text-white shadow-xs">
              Habis
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/95 px-2 py-0.5 text-[11px] font-semibold text-white shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Sisa {product.stock}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/90 px-2 py-0.5 text-[11px] font-medium text-white shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Tersedia {product.stock}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-sm sm:text-base leading-snug text-foreground transition-colors group-hover:text-brand-primary line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-auto pt-4 flex items-end justify-between border-t border-border-subtle/60">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-foreground-muted font-medium block">
              Sewa Mulai
            </span>
            <p className="text-base font-bold text-brand-primary">
              {formatRupiah(product.pricePerDay)}
              <span className="text-xs font-normal text-foreground-muted"> /hari</span>
            </p>
          </div>

          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white group-hover:scale-110">
            <svg
              className="h-4 w-4 transform transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
