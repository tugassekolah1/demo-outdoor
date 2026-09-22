/**
 * Kumpulan fungsi utilitas kecil yang dipakai di berbagai halaman.
 * Ditambah sedikit demi sedikit sesuai kebutuhan phase berikutnya.
 */

/**
 * Format angka menjadi format Rupiah, contoh: 50000 -> "Rp 50.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format Date menjadi tanggal panjang berbahasa Indonesia,
 * contoh: 1 Oktober 2026.
 *
 * `timeZone: "UTC"` dipakai karena tanggal booking disimpan sebagai
 * tengah malam UTC (dari `<input type="date">`) — tanpa ini, server
 * dengan offset negatif bisa menampilkan tanggal yang geser satu hari.
 *
 * Ditambahkan di Phase 8 (dipakai ringkasan booking & pesan WhatsApp)
 * — implementasinya identik dengan helper lokal yang sebelumnya ada di
 * halaman ringkasan booking, dipindah ke sini supaya tidak diduplikasi.
 */
export function formatTanggal(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
