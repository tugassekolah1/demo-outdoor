/**
 * lib/whatsapp.ts — PHASE 8 (lanjutan): konfirmasi booking via WhatsApp.
 *
 * Membangun link `wa.me` dengan pesan pre-filled berisi detail booking,
 * supaya customer tinggal menekan tombol "Kirim ke WhatsApp Admin" di
 * halaman ringkasan booking.
 *
 * PENTING: nomor WhatsApp admin TIDAK di-hardcode — diambil dari
 * environment variable `WHATSAPP_ADMIN_NUMBER` (lihat .env.example).
 */

import { calculateRentalDays } from "@/lib/booking";
import { formatRupiah, formatTanggal } from "@/lib/utils";

/**
 * Bentuk data booking yang dibutuhkan untuk membangun pesan.
 * Structurally kompatibel dengan `BookingWithItems` dari lib/booking.ts
 * (halaman ringkasan booking) maupun `AdminBookingDetail` dari
 * lib/admin.ts (detail booking admin) — jadi bisa dipakai ulang di
 * kedua tempat kalau dibutuhkan nanti.
 */
export type BookingForMessage = {
  id: string;
  customerName: string;
  whatsapp: string;
  startDate: Date;
  endDate: Date;
  note?: string | null;
  totalPrice: number;
  items: {
    quantity: number;
    product: { name: string };
  }[];
};

/**
 * Nomor WhatsApp admin dari environment variable, dinormalkan ke
 * format internasional tanpa simbol (hanya angka).
 *
 * - `"0812 3456-7890"` → `"6281234567890"` (awalan 0 dikonversi)
 * - `"6281234567890"`  → dipertahankan
 * - kosong/tidak valid → `null` (tombol WA tidak ditampilkan)
 */
export function getAdminWhatsAppNumber(): string | null {
  const raw = process.env.WHATSAPP_ADMIN_NUMBER?.trim();
  if (!raw) return null;

  let digits = raw.replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) {
    digits = `62${digits.slice(1)}`;
  }
  if (digits.length < 9) return null;
  return digits;
}

/** Isi pesan WhatsApp untuk satu booking (detail lengkap, bahasa Indonesia). */
export function buildBookingWhatsAppMessage(booking: BookingForMessage): string {
  const rentalDays = calculateRentalDays(booking.startDate, booking.endDate);

  const lines: string[] = [
    "Halo Admin TAPAK Outdoor Rental, saya ingin konfirmasi booking:",
    "",
    `ID Booking: ${booking.id}`,
    `Nama customer: ${booking.customerName}`,
    `Nomor WhatsApp: ${booking.whatsapp}`,
    "",
    "Produk & jumlah:",
    ...booking.items.map((item) => `• ${item.product.name} — ${item.quantity} unit`),
    "",
    `Tanggal mulai: ${formatTanggal(booking.startDate)}`,
    `Tanggal selesai: ${formatTanggal(booking.endDate)}`,
    `Durasi sewa: ${rentalDays} hari`,
    `Total harga: ${formatRupiah(booking.totalPrice)}`,
  ];

  if (booking.note) {
    lines.push(`Catatan: ${booking.note}`);
  }

  lines.push("", "Mohon konfirmasinya. Terima kasih.");
  return lines.join("\n");
}

/**
 * Link `https://wa.me/<nomor>?text=<pesan>` untuk booking ini, atau
 * `null` kalau `WHATSAPP_ADMIN_NUMBER` belum di-set di environment
 * (tombol kemudian ditampilkan dalam keadaan nonaktif oleh UI).
 */
export function getWhatsAppBookingLink(booking: BookingForMessage): string | null {
  const number = getAdminWhatsAppNumber();
  if (!number) return null;
  const text = encodeURIComponent(buildBookingWhatsAppMessage(booking));
  return `https://wa.me/${number}?text=${text}`;
}
