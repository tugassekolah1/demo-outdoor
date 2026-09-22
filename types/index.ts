/**
 * Tipe TypeScript bersama untuk seluruh project.
 *
 * PHASE 2: menambahkan BookingStatus. SQLite tidak mendukung enum
 * native di Prisma, jadi status booking disimpan sebagai `String` di
 * database, dan dibatasi nilainya lewat union type ini di level
 * aplikasi. Validasi runtime (memastikan hanya nilai ini yang boleh
 * disimpan) akan diimplementasikan di API route handler pada Phase 7
 * (pembuatan booking) dan Phase 11 (admin mengubah status booking).
 */

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";

export const BOOKING_STATUSES: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
];

/** Label berbahasa Indonesia untuk ditampilkan di UI (dipakai mulai Phase 7/11). */
export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Menunggu Konfirmasi",
  CONFIRMED: "Dikonfirmasi",
  ONGOING: "Sedang Berjalan",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

/**
 * Transisi status booking yang diizinkan — PHASE 11 (admin).
 *
 * Alur normal: PENDING → CONFIRMED → ONGOING → COMPLETED.
 * CANCELLED bisa dipilih dari PENDING/CONFIRMED/ONGOING ("jika
 * diperlukan"), dan bersifat TERMINAL (tidak bisa berubah lagi) —
 * supaya stok produk yang dikembalikan saat pembatalan tidak pernah
 * dikembalikan dua kali. COMPLETED juga terminal.
 *
 * Dipakai di dua tempat: validasi di `lib/admin.ts` (server, saat
 * admin mengubah status) dan untuk menentukan tombol mana yang
 * ditampilkan di detail booking (client).
 */
export const BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["ONGOING", "CANCELLED"],
  ONGOING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};
