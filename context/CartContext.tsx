"use client";

/**
 * CartContext — keranjang rental sisi client.
 *
 * PHASE 6 (menyusul rencana di PROJECT_CONTEXT.md): implementasi asli,
 * menggantikan kerangka kosong dari Phase 1.
 *
 * Catatan desain:
 * - Ini keranjang RENTAL, bukan keranjang belanja biasa — setiap item
 *   punya quantity, tapi harga totalnya baru bisa dihitung penuh saat
 *   customer menentukan rentang tanggal sewa di halaman booking
 *   (Phase 7, belum dikerjakan di sini). Karena itu context ini hanya
 *   menyimpan item + quantity + harga per-hari (snapshot dari produk
 *   saat ditambahkan), TANPA menghitung total di sini.
 * - State disimpan di localStorage supaya isi keranjang tidak hilang
 *   saat customer reload halaman atau pindah antar halaman (masih
 *   sesuai batasan "React Context, bukan Redux/Zustand" dari
 *   PROJECT_CONTEXT.md — localStorage hanya persistensi, bukan state
 *   management tambahan).
 * - `productId` dipakai sebagai key unik per item (bukan gabungan
 *   product+variant, karena produk di schema ini tidak punya varian).
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  categorySlug: string;
  pricePerDay: number;
  /** Stok saat ini di database — dipakai untuk membatasi quantity di UI. */
  stock: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  /** Menambah produk ke keranjang. Jika sudah ada, quantity ditambahkan (dibatasi oleh stok). */
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  /** Jumlah baris item unik (bukan total quantity) — dipakai di badge Navbar. */
  itemCount: number;
  /** Total quantity semua item — alternatif untuk badge jika diinginkan. */
  totalQuantity: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "tapak-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Sengaja mulai dengan array kosong di kedua sisi (server & client
  // pertama kali render) supaya tidak terjadi hydration mismatch.
  // Isi keranjang yang tersimpan baru dimuat di useEffect pertama
  // (hanya berjalan di browser), lalu di-render ulang sekali — ini
  // pola standar untuk membaca localStorage di Next.js App Router,
  // bukan sesuatu yang bisa dihindari dengan lazy initializer (yang
  // justru akan menyebabkan mismatch server/client).
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        // eslint-disable-next-line react-hooks/set-state-in-effect -- memuat keranjang tersimpan dari localStorage (external system) saat mount, satu kali; tidak bisa dipindah ke render karena akan mismatch dengan SSR
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // localStorage tidak tersedia atau data korup — abaikan, mulai kosong.
    }
    setHydrated(true);
  }, []);

  // Simpan setiap kali items berubah (setelah hydrate awal selesai,
  // supaya tidak menimpa data tersimpan dengan array kosong saat mount).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Kuota localStorage penuh atau tidak tersedia — abaikan, keranjang
      // tetap berfungsi untuk sesi berjalan meski tidak persisten.
    }
  }, [items, hydrated]);

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, item.stock);
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: nextQty } : i
        );
      }
      const initialQty = Math.min(quantity, Math.max(item.stock, 0));
      if (initialQty <= 0) return prev;
      return [...prev, { ...item, quantity: initialQty }];
    });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function setQuantity(productId: string, quantity: number) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
            : i
        )
        // Kalau quantity di-set ke 0 atau kurang, hapus item dari keranjang.
        .filter((i) => (i.productId === productId ? quantity > 0 : true))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.length;
  const totalQuantity = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setQuantity,
        clearCart,
        itemCount,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}
