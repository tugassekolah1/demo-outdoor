"use client";

/**
 * Keranjang Rental Modern — TAPAK Outdoor.
 * Dilengkapi progress bar alur sewa, item card interaktif, dan kalkulasi subtotal.
 */

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils";
import ProductImage from "@/components/customer/ProductImage";

export default function CartPage() {
  const { items, removeItem, setQuantity } = useCart();

  const subtotalPerHari = items.reduce(
    (sum, item) => sum + item.pricePerDay * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:py-28 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-primary-tint text-4xl shadow-xs">
          🎒
        </div>
        <h1 className="font-display mt-6 text-2xl sm:text-3xl font-bold text-foreground">
          Keranjang Sewa Masih Kosong
        </h1>
        <p className="mt-2 text-sm text-foreground-muted max-w-md mx-auto leading-relaxed">
          Kamu belum memilih peralatan apapun. Yuk jelajahi katalog untuk menemukan tenda, carrier, atau sleeping bag untuk pendakianmu!
        </p>
        <Link
          href="/catalog"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-primary px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-primary-dark hover:shadow-lg hover:-translate-y-0.5"
        >
          <span>Jelajahi Katalog Peralatan</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* 3-Step Progress Header */}
      <div className="mb-8 border-b border-border-subtle/80 pb-6">
        <div className="flex items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 text-brand-primary font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-white text-xs shadow-xs">
              1
            </span>
            <span>Keranjang</span>
          </div>
          <span className="text-border-subtle font-bold">——</span>
          <div className="flex items-center gap-2 text-foreground-muted">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-alt border border-border-subtle text-xs">
              2
            </span>
            <span>Form Booking</span>
          </div>
          <span className="text-border-subtle font-bold">——</span>
          <div className="flex items-center gap-2 text-foreground-muted">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-alt border border-border-subtle text-xs">
              3
            </span>
            <span>Konfirmasi WA</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Col: Cart Items */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Peralatan Dipilih
            </h1>
            <span className="text-xs font-semibold text-foreground-muted bg-surface-alt px-3 py-1 rounded-full border border-border-subtle">
              {items.length} jenis alat
            </span>
          </div>

          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex gap-4 rounded-2xl border border-border-subtle bg-surface p-4 shadow-2xs transition-all hover:border-brand-primary/30"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt"
                >
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    categorySlug={item.categorySlug}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-semibold text-sm sm:text-base text-foreground hover:text-brand-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-brand-primary font-bold mt-0.5">
                        {formatRupiah(item.pricePerDay)}{" "}
                        <span className="text-foreground-muted font-normal">/hari</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="p-1 text-foreground-muted hover:text-brand-accent transition-colors"
                      title="Hapus dari keranjang"
                      aria-label={`Hapus ${item.name}`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border-subtle/50 pt-3">
                    {/* Stepper */}
                    <div className="flex items-center rounded-full border border-border-subtle bg-surface-alt/60">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-foreground-muted hover:bg-surface hover:text-brand-primary disabled:opacity-40"
                        aria-label={`Kurangi ${item.name}`}
                      >
                        −
                      </button>
                      <span className="min-w-7 px-1 text-center text-xs font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(
                            item.productId,
                            Math.min(item.stock, item.quantity + 1)
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-foreground-muted hover:bg-surface hover:text-brand-primary disabled:opacity-40"
                        aria-label={`Tambah ${item.name}`}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>

                    <p className="text-right text-sm font-bold text-foreground">
                      {formatRupiah(item.pricePerDay * item.quantity)}
                      <span className="block text-[10px] font-normal text-foreground-muted">
                        subtotal /hari
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Col: Summary Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm space-y-5">
            <h2 className="font-display text-lg font-bold text-foreground">
              Ringkasan Biaya Sewa
            </h2>

            <div className="space-y-3 text-sm border-y border-border-subtle py-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground-muted">Subtotal per hari</span>
                <span className="font-bold text-foreground">
                  {formatRupiah(subtotalPerHari)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-foreground-muted">
                <span>Durasi Hari Sewa</span>
                <span className="italic">Ditentukan di form booking</span>
              </div>
            </div>

            <div className="rounded-xl border border-brand-primary/20 bg-brand-primary-tint/50 p-3.5 text-xs text-brand-primary leading-relaxed">
              💡 <strong>Info Penting:</strong> Total biaya akhir akan dihitung otomatis saat kamu mengisi tanggal mulai & selesai pada halaman berikutnya.
            </div>

            <div className="space-y-2.5">
              <Link
                href="/booking"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-accent-dark hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Lanjut ke Form Booking</span>
                <span>→</span>
              </Link>

              <Link
                href="/catalog"
                className="w-full inline-flex items-center justify-center rounded-full border border-border-subtle bg-surface px-6 py-3 text-xs font-semibold text-foreground transition-all hover:border-brand-primary hover:bg-surface-alt"
              >
                + Tambah Alat Lainnya
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
