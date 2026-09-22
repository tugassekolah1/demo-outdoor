"use client";

/**
 * Form tambah-ke-keranjang di halaman detail produk.
 * Pemilih quantity stepper modern, info stok real-time di bawah
 * stepper (pola online shop), tombol "Sewa Sekarang" untuk langsung
 * ke form booking tanpa lewat halaman keranjang, dan tombol direct
 * consultation WhatsApp.
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils";
import type { ProductWithCategory } from "@/lib/catalog";

export default function AddToCartForm({
  product,
}: {
  product: ProductWithCategory;
}) {
  const { addItem, items } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const habis = product.stock <= 0;
  const alreadyInCart =
    items.find((i) => i.productId === product.id)?.quantity ?? 0;
  const remainingStock = Math.max(product.stock - alreadyInCart, 0);

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        categorySlug: product.category.slug,
        pricePerDay: product.pricePerDay,
        stock: product.stock,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  }

  /**
   * "Sewa Sekarang" — opsi langsung ala online shop: produk & jumlah
   * yang dipilih dimasukkan ke keranjang (karena form booking membaca
   * CartContext), lalu user LANGSUNG dibawa ke /booking — tanpa
   * mampir ke halaman keranjang dulu.
   */
  function handleRentNow() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        categorySlug: product.category.slug,
        pricePerDay: product.pricePerDay,
        stock: product.stock,
      },
      quantity
    );
    router.push("/booking");
  }

  if (habis) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-alt/60 p-4 text-sm text-foreground-muted">
        <p className="font-semibold text-foreground">Unit Sedang Kosong</p>
        <p className="mt-1 text-xs">
          Produk ini sedang disewa seluruhnya. Cek rekomendasi produk serupa di bawah atau hubungi admin untuk jadwal ketersediaan berikutnya.
        </p>
      </div>
    );
  }

  if (remainingStock <= 0) {
    return (
      <div className="rounded-xl border border-brand-primary/20 bg-brand-primary-tint/60 p-4.5">
        <p className="text-sm font-semibold text-brand-primary">
          Semua unit ({product.stock}) sudah ada di keranjangmu
        </p>
        <p className="mt-1 text-xs text-foreground-muted">
          Kamu sudah memilih jumlah maksimal untuk produk ini.
        </p>
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-primary-dark"
        >
          <span>Buka Keranjang Rental</span>
          <span>→</span>
        </button>
      </div>
    );
  }

  const subtotalEstimate = product.pricePerDay * quantity;

  return (
    <div className="flex flex-col gap-5">
      {/* Quantity Stepper & Subtotal */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border-subtle/80 bg-surface-alt/30 p-3.5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Jumlah Sewa
          </span>
          <div className="flex items-center rounded-full border border-border-subtle bg-surface shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity((v) => Math.max(1, v - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-foreground-muted transition-colors hover:bg-surface-alt hover:text-brand-primary disabled:opacity-40"
              aria-label="Kurangi jumlah"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="min-w-8 px-2 text-center text-sm font-bold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((v) => Math.min(remainingStock, v + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-foreground-muted transition-colors hover:bg-surface-alt hover:text-brand-primary disabled:opacity-40"
              aria-label="Tambah jumlah"
              disabled={quantity >= remainingStock}
            >
              +
            </button>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-foreground-muted block">
            Subtotal {quantity} unit:
          </span>
          <span className="text-sm font-bold text-brand-primary">
            {formatRupiah(subtotalEstimate)} <span className="text-xs font-normal text-foreground-muted">/hari</span>
          </span>
        </div>
      </div>

      {/* Info stok — diletakkan DI BAWAH pemilih jumlah (bukan di atas
          form), mengikuti pola halaman online shop. */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-medium text-foreground-muted">
          Ketersediaan saat ini:
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 font-bold text-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          Tersedia {product.stock} unit
        </span>
        {alreadyInCart > 0 && (
          <span className="text-foreground-muted">
            — {alreadyInCart} sudah di keranjang, sisa maks.{" "}
            {remainingStock} untukmu
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all ${
            justAdded
              ? "bg-emerald-600 scale-[0.99]"
              : "bg-brand-accent hover:bg-brand-accent-dark hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          }`}
        >
          {justAdded ? (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Berhasil Ditambahkan!</span>
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Tambah ke Keranjang</span>
            </>
          )}
        </button>

        {/* Opsi langsung: tanpa lewat halaman keranjang */}
        <button
          type="button"
          onClick={handleRentNow}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-primary-dark hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Sewa Sekarang</span>
          <span aria-hidden="true">→</span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border-subtle bg-surface px-5 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-brand-primary hover:bg-surface-alt"
        >
          <span>Buka Keranjang</span>
        </button>
      </div>
    </div>
  );
}
