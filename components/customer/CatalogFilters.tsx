"use client";

/**
 * Filter katalog modern: search box terintegrasi ikon + tombol kategori.
 * Sumber kebenaran tetap di URL search params (?q=...&category=...).
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { CategoryWithCount } from "@/lib/catalog";
import CategoryIcon from "./CategoryIcon";

export default function CatalogFilters({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQ = searchParams.get("q") ?? "";
  const currentCategory = searchParams.get("category") ?? "semua";

  const [q, setQ] = useState(currentQ);

  function pushParams(next: { q?: string; category?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextQ = next.q !== undefined ? next.q : currentQ;
    const nextCategory = next.category !== undefined ? next.category : currentCategory;

    if (nextQ) params.set("q", nextQ);
    else params.delete("q");

    if (nextCategory && nextCategory !== "semua") params.set("category", nextCategory);
    else params.delete("category");

    startTransition(() => {
      router.push(`/catalog${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  useEffect(() => {
    if (q === currentQ) return;
    const timeout = setTimeout(() => pushParams({ q }), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="flex flex-col gap-5">
      {/* Search Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-foreground-muted">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          id="catalog-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama produk, mis. tenda dome, carrier 60L, kompor..."
          className="w-full rounded-2xl border border-border-subtle bg-surface pl-11 pr-10 py-3 text-sm text-foreground placeholder:text-foreground-muted shadow-2xs transition-all focus:border-brand-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              pushParams({ q: "" });
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-foreground-muted hover:text-foreground"
            aria-label="Hapus pencarian"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-alt text-xs font-bold">
              ✕
            </span>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter kategori">
        <button
          type="button"
          onClick={() => pushParams({ category: "semua" })}
          aria-pressed={currentCategory === "semua"}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all shadow-2xs ${
            currentCategory === "semua"
              ? "bg-brand-primary text-white shadow-xs"
              : "border border-border-subtle bg-surface text-foreground-muted hover:border-brand-primary hover:text-brand-primary hover:bg-surface-alt"
          }`}
        >
          <span>Semua Peralatan</span>
        </button>

        {categories.map((cat) => {
          const active = currentCategory === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => pushParams({ category: cat.slug })}
              aria-pressed={active}
              className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all shadow-2xs ${
                active
                  ? "bg-brand-primary text-white shadow-xs font-bold"
                  : "border border-border-subtle bg-surface text-foreground-muted hover:border-brand-primary hover:text-brand-primary hover:bg-surface-alt"
              }`}
            >
              <CategoryIcon
                categorySlug={cat.slug}
                className={`h-4 w-4 ${active ? "text-white" : "text-brand-primary/70"}`}
              />
              <span>{cat.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  active ? "bg-white/25 text-white" : "bg-surface-alt text-foreground-muted"
                }`}
              >
                {cat._count.products}
              </span>
            </button>
          );
        })}
      </div>

      {/* Status live region for accessibility */}
      <div aria-live="polite" className="sr-only">
        {isPending ? "Memperbarui hasil..." : ""}
      </div>
    </div>
  );
}
