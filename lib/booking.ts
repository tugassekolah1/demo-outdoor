/**
 * Data access & logic layer untuk Booking Customer — PHASE 7.
 *
 * Scope: HANYA booking dari sisi customer (buat booking baru, ambil
 * detail 1 booking untuk halaman ringkasan). TIDAK ada fungsi admin
 * (list semua booking, ubah status, dsb) — itu Phase 11, sengaja
 * tidak dibuat di sini sesuai instruksi.
 *
 * Pola mengikuti `lib/catalog.ts`: satu-satunya tempat query Prisma
 * untuk booking, dipanggil dari API route handler (bukan dari page
 * langsung), karena pembuatan booking adalah operasi tulis yang perlu
 * lewat POST request dari client (cart ada di localStorage, hanya
 * diketahui browser).
 */

import { prisma } from "@/lib/prisma";

// ------------------------------------------------------------
// Tipe input dari client (form booking).
// ------------------------------------------------------------

export type BookingItemInput = {
  productId: string;
  quantity: number;
};

export type CreateBookingInput = {
  customerName: string;
  whatsapp: string;
  startDate: string; // ISO date string dari <input type="date">, contoh "2026-10-01"
  endDate: string;
  note?: string;
  items: BookingItemInput[];
};

// Tipe hasil booking lengkap (dengan items + product), dipakai di
// halaman ringkasan (booking/success). Ditulis manual mengikuti
// alasan yang sama seperti `ProductWithCategory` di lib/catalog.ts —
// lihat catatan Bagian 8 PROJECT_CONTEXT.md soal Prisma Client di
// sandbox ini.
export type BookingWithItems = {
  id: string;
  customerName: string;
  whatsapp: string;
  startDate: Date;
  endDate: Date;
  note: string | null;
  status: string;
  totalPrice: number;
  createdAt: Date;
  items: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    subtotal: number;
    product: {
      id: string;
      name: string;
      slug: string;
      image: string | null;
    };
  }[];
};

export type CreateBookingResult =
  | { ok: true; booking: BookingWithItems }
  | { ok: false; error: string };

/** Jumlah hari sewa (inklusif tanggal mulai & selesai). Minimal 1 hari. */
export function calculateRentalDays(startDate: Date, endDate: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  // Normalisasi ke tengah malam supaya perbedaan jam tidak mengganggu
  // perhitungan jumlah hari (form hanya mengirim tanggal, bukan jam).
  const start = new Date(
    Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate())
  );
  const end = new Date(
    Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate())
  );
  const diffDays = Math.round((end.getTime() - start.getTime()) / msPerDay);
  // Inklusif: sewa 1 hari (mulai = selesai) tetap dihitung 1 hari,
  // bukan 0 — sesuai kalkulasi harga rental pada umumnya.
  return Math.max(diffDays + 1, 1);
}

/**
 * Validasi input booking dari client. Mengembalikan pesan error
 * (string) kalau ada masalah, atau `null` kalau valid. Validasi ini
 * SENGAJA dilakukan di server (bukan cuma client) karena data dari
 * client (termasuk harga per item) tidak pernah dipercaya langsung —
 * harga selalu diambil ulang dari database di `createBooking`.
 */
function validateInput(input: CreateBookingInput): string | null {
  if (!input.customerName || input.customerName.trim().length < 3) {
    return "Nama harus diisi, minimal 3 karakter.";
  }

  const waDigits = input.whatsapp.replace(/[^0-9]/g, "");
  if (waDigits.length < 9 || waDigits.length > 15) {
    return "Nomor WhatsApp tidak valid.";
  }

  const start = new Date(input.startDate);
  const end = new Date(input.endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Tanggal mulai dan tanggal selesai harus diisi.";
  }
  if (end.getTime() < start.getTime()) {
    return "Tanggal selesai tidak boleh sebelum tanggal mulai.";
  }

  // Tanggal mulai tidak boleh di masa lalu (dibandingkan hari ini,
  // tengah malam waktu server) — mencegah booking untuk tanggal yang
  // sudah lewat.
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  const startUTC = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
  );
  if (startUTC.getTime() < todayUTC.getTime()) {
    return "Tanggal mulai tidak boleh sebelum hari ini.";
  }

  if (!input.items || input.items.length === 0) {
    return "Keranjang kosong — pilih minimal 1 produk sebelum booking.";
  }

  for (const item of input.items) {
    if (!item.productId || !Number.isInteger(item.quantity) || item.quantity < 1) {
      return "Jumlah produk tidak valid.";
    }
  }

  return null;
}

/**
 * Membuat booking baru. Melakukan validasi ulang di server (nama,
 * WhatsApp, tanggal, item), mengambil ulang harga & stok produk
 * TERKINI dari database (tidak percaya harga dari client), menghitung
 * total = Σ (pricePerDay × quantity × jumlah hari sewa), lalu
 * menyimpan Booking + BookingItem dalam satu transaksi Prisma supaya
 * konsisten (kalau ada error di tengah, tidak ada data setengah jadi
 * yang tersimpan).
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  const validationError = validateInput(input);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);
  const rentalDays = calculateRentalDays(startDate, endDate);

  // Gabungkan quantity kalau ada productId yang sama dikirim lebih
  // dari sekali (seharusnya tidak terjadi dari UI, tapi tetap dijaga
  // di server).
  const mergedItemsMap = new Map<string, number>();
  for (const item of input.items) {
    mergedItemsMap.set(
      item.productId,
      (mergedItemsMap.get(item.productId) ?? 0) + item.quantity
    );
  }
  const mergedItems = Array.from(mergedItemsMap.entries()).map(
    ([productId, quantity]) => ({ productId, quantity })
  );

  type TxProduct = {
    id: string;
    name: string;
    pricePerDay: number;
    stock: number;
  };

  try {
    // Catatan tipe (perbaikan minor setelah `prisma generate` penuh
    // tersedia): anotasi `tx: typeof prisma` dihapus — tipe callback
    // `$transaction` disimpulkan langsung dari overload yang cocok.
    // Runtime TIDAK berubah sama sekali.
    const booking = await prisma.$transaction(async (tx) => {
      const productIds = mergedItems.map((i) => i.productId);
      const products: TxProduct[] = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      // Validasi produk ada & stok cukup — pakai harga & stok TERKINI
      // dari database, bukan dari input client.
      for (const item of mergedItems) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new BookingValidationError(
            `Salah satu produk di keranjang tidak lagi tersedia.`
          );
        }
        if (product.stock < item.quantity) {
          throw new BookingValidationError(
            `Stok "${product.name}" tidak cukup (tersisa ${product.stock}, diminta ${item.quantity}).`
          );
        }
      }

      const bookingItemsData = mergedItems.map((item) => {
        const product = productMap.get(item.productId)!;
        const subtotal = product.pricePerDay * item.quantity * rentalDays;
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.pricePerDay,
          subtotal,
        };
      });

      const totalPrice = bookingItemsData.reduce(
        (sum, i) => sum + i.subtotal,
        0
      );

      const created = await tx.booking.create({
        data: {
          customerName: input.customerName.trim(),
          whatsapp: input.whatsapp.trim(),
          startDate,
          endDate,
          note: input.note?.trim() || null,
          status: "PENDING",
          totalPrice,
          items: {
            create: bookingItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, slug: true, image: true },
              },
            },
          },
        },
      });

      // Kurangi stok produk sesuai jumlah yang dibooking — dalam
      // transaksi yang sama supaya atomik dengan pembuatan booking.
      for (const item of mergedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return { ok: true, booking };
  } catch (err) {
    if (err instanceof BookingValidationError) {
      return { ok: false, error: err.message };
    }
    console.error("Gagal membuat booking:", err);
    return {
      ok: false,
      error: "Terjadi kesalahan saat menyimpan booking. Coba lagi.",
    };
  }
}

class BookingValidationError extends Error {}

/** Satu booking lengkap (dengan items+product) berdasarkan id, untuk halaman ringkasan. */
export async function getBookingById(
  id: string
): Promise<BookingWithItems | null> {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, image: true },
          },
        },
      },
    },
  });
}
