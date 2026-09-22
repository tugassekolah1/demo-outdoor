/**
 * Homepage Modern — TAPAK Outdoor Rental.
 * Server Component: mengambil kategori & produk unggulan dari database.
 */

import Link from "next/link";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import ProductCard from "@/components/customer/ProductCard";
import CategoryIcon from "@/components/customer/CategoryIcon";
import { formatRupiah } from "@/lib/utils";

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
  ]);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="contour-bg relative border-b border-border-subtle bg-gradient-to-b from-brand-primary/5 via-surface-alt/40 to-background pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Col: Hero Copy */}
            <div className="hero-fade lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary-tint/80 px-3.5 py-1 text-xs font-semibold text-brand-primary shadow-2xs">
                <span className="flex h-2 w-2 rounded-full bg-brand-accent animate-pulse" />
                Rental Peralatan Gunung & Camping Terpercaya
              </div>

              <h1 className="font-display mt-5 text-4xl leading-[1.08] text-brand-primary-dark sm:text-6xl font-black">
                Naik gunung tanpa
                <br />
                <span className="text-brand-accent">beban beli</span> alatnya.
              </h1>

              <p className="mt-5 max-w-xl text-base text-foreground-muted sm:text-lg leading-relaxed">
                Sewa tenda, carrier, sleeping bag, dan perlengkapan mendaki
                pilihan dari TAPAK. Semua unit terawat, bersih, wangi, dan siap
                pakai untuk menemani petualanganmu sampai ke puncak.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-primary-dark hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Jelajahi Katalog</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href="#cara-sewa"
                  className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-brand-primary hover:bg-surface-alt"
                >
                  Cara Sewa
                </Link>
              </div>

              {/* Trust Metric Counters */}
              <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border-subtle/80 pt-6">
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-brand-primary">
                    100%
                  </p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    Unit Bersih & Dicek
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-brand-primary">
                    1.200+
                  </p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    Pendaki Terbantu
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-brand-accent">
                    ★ 4.9
                  </p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    Rating Kepuasan
                  </p>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Hero Card Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-2xl border border-border-subtle bg-surface p-6 shadow-xl">
                {/* Decorative glow */}
                <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-brand-accent/15 blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
                    Paket Rekomendasi
                  </span>
                  <span className="text-xs font-medium text-brand-accent">
                    🔥 Paling Diminati
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand-primary-tint text-brand-primary">
                    <CategoryIcon categorySlug="tenda" className="h-10 w-10 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base">
                      Paket Muncak Hemat (4 Orang)
                    </h3>
                    <p className="text-xs text-foreground-muted">
                      1x Tenda Dome 4P + 4x Matras + 1x Kompor Set
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 border-y border-border-subtle/80 py-3 text-xs text-foreground-muted">
                  <div className="flex items-center justify-between">
                    <span>Kondisi Fisik</span>
                    <span className="font-semibold text-emerald-700">✓ Sudah Dicuci & Wangi</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estimasi Biaya Sewa</span>
                    <span className="font-bold text-foreground text-sm">
                      {formatRupiah(65000)} / hari
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Link
                    href="/catalog"
                    className="flex-1 rounded-xl bg-brand-accent px-4 py-2.5 text-center text-xs font-bold text-white shadow-xs transition-colors hover:bg-brand-accent-dark"
                  >
                    Sewa Paket di Katalog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KATEGORI PERALATAN */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
              Jelajahi Kategori
            </span>
            <h2 className="font-display mt-1 text-2xl font-bold text-foreground sm:text-3xl">
              Pilihan Peralatan Outdoor
            </h2>
          </div>
          <p className="text-sm text-foreground-muted sm:max-w-xs">
            Pilih kategori untuk menemukan tenda, carrier, atau perlengkapan masak sesuai kebutuhan pendakianmu.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.slug}`}
              className="group relative flex flex-col items-center justify-center rounded-2xl border border-border-subtle bg-surface p-5 text-center shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-alt transition-colors group-hover:bg-brand-primary-tint">
                <CategoryIcon
                  categorySlug={cat.slug}
                  className="h-10 w-10 text-brand-primary/70 transition-transform duration-300 group-hover:scale-110 group-hover:text-brand-primary"
                />
              </div>
              <span className="mt-3 text-sm font-bold text-foreground group-hover:text-brand-primary transition-colors">
                {cat.name}
              </span>
              <span className="mt-0.5 text-xs text-foreground-muted">
                {cat._count.products} pilihan
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. PRODUK UNGGULAN / PALING TERSEDIA */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                Siap Dipakai
              </span>
              <h2 className="font-display mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                Paling Siap Disewa
              </h2>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
            >
              <span>Lihat semua produk</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. KEUNGGULAN TAPAK (WHY US) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-border-subtle bg-surface p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
              Kenapa Memilih TAPAK?
            </span>
            <h2 className="font-display mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Standar Kualitas & Kenyamanan Sewa
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              Kami memastikan setiap petualanganmu aman dan nyaman dengan unit yang selalu prima.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border-subtle/70 bg-surface-alt/40 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-700/10 text-emerald-800 text-lg">
                🧼
              </div>
              <h3 className="mt-3 font-bold text-foreground text-sm">
                Bersih & Higienis
              </h3>
              <p className="mt-1 text-xs text-foreground-muted leading-relaxed">
                Tenda dan sleeping bag dicuci serta dijemur bersih setelah setiap pemakaian. Bebas bau apek.
              </p>
            </div>

            <div className="rounded-2xl border border-border-subtle/70 bg-surface-alt/40 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-700/10 text-amber-800 text-lg">
                🏷️
              </div>
              <h3 className="mt-3 font-bold text-foreground text-sm">
                Harga Transparan
              </h3>
              <p className="mt-1 text-xs text-foreground-muted leading-relaxed">
                Perhitungan tarif harian jelas sejak awal. Tanpa biaya tersembunyi saat pengambilan alat.
              </p>
            </div>

            <div className="rounded-2xl border border-border-subtle/70 bg-surface-alt/40 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary text-lg">
                ⚡
              </div>
              <h3 className="mt-3 font-bold text-foreground text-sm">
                Booking Cepat & Mudah
              </h3>
              <p className="mt-1 text-xs text-foreground-muted leading-relaxed">
                Cukup pilih alat, tentukan tanggal, lalu konfirmasi langsung dengan admin lewat WhatsApp.
              </p>
            </div>

            <div className="rounded-2xl border border-border-subtle/70 bg-surface-alt/40 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-700/10 text-indigo-800 text-lg">
                🛡️
              </div>
              <h3 className="mt-3 font-bold text-foreground text-sm">
                Pengecekan Fisik Bersama
              </h3>
              <p className="mt-1 text-xs text-foreground-muted leading-relaxed">
                Semua resleting, pasak, dan frame dicek bersama sebelum serah terima untuk memastikan fungsi optimal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CARA SEWA (WORKFLOW STEPS) */}
      <section id="cara-sewa" className="border-t border-border-subtle bg-brand-primary-dark py-16 sm:py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
              Alur Mudah
            </span>
            <h2 className="font-display mt-2 text-2xl font-bold sm:text-4xl text-white">
              Cara Sewa di TAPAK Outdoor
            </h2>
            <p className="mt-2 text-sm text-white/70">
              3 langkah praktis mulai dari memilih peralatan hingga siap berangkat ke gunung.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent text-white font-display text-xl font-bold shadow-md">
                1
              </div>
              <h3 className="mt-4 font-bold text-lg text-white">
                Pilih Peralatan
              </h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Buka katalog, periksa ketersediaan stok, lalu masukkan peralatan yang kamu butuhkan ke dalam keranjang.
              </p>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent text-white font-display text-xl font-bold shadow-md">
                2
              </div>
              <h3 className="mt-4 font-bold text-lg text-white">
                Isi Detail & Tanggal
              </h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Tentukan tanggal mulai dan selesai sewa. Sistem akan otomatis menghitung total harga secara transparan.
              </p>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent text-white font-display text-xl font-bold shadow-md">
                3
              </div>
              <h3 className="mt-4 font-bold text-lg text-white">
                Konfirmasi WhatsApp
              </h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Klik tombol WhatsApp untuk mengirim detail booking. Tim TAPAK akan mengonfirmasi jadwal serah terima.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-accent-dark hover:scale-105"
            >
              Mulai Sewa Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONI PENDAKI */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
            Cerita Petualang
          </span>
          <h2 className="font-display mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            Kata Mereka yang Sudah Muncak
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-xs">
            <div className="text-amber-500 text-sm">★★★★★</div>
            <p className="mt-3 text-sm text-foreground-muted leading-relaxed">
              &ldquo;Tendanya benar-benar bersih dan frame-nya kokoh. Hujan di Pos 3 Prau tetap aman tanpa bocor sama sekali.&rdquo;
            </p>
            <div className="mt-4 pt-4 border-t border-border-subtle flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center text-xs">
                R
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Rian Pratama</p>
                <p className="text-[10px] text-foreground-muted">Muncak ke Gn. Prau</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-xs">
            <div className="text-amber-500 text-sm">★★★★★</div>
            <p className="mt-3 text-sm text-foreground-muted leading-relaxed">
              &ldquo;Carrier Eiger 60L-nya wangi dan busa pundaknya masih tebal. Bawa beban 15kg di Merbabu tetap nyaman.&rdquo;
            </p>
            <div className="mt-4 pt-4 border-t border-border-subtle flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center text-xs">
                D
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Dimas Satria</p>
                <p className="text-[10px] text-foreground-muted">Muncak ke Gn. Merbabu</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-xs">
            <div className="text-amber-500 text-sm">★★★★★</div>
            <p className="mt-3 text-sm text-foreground-muted leading-relaxed">
              &ldquo;Alur booking lewat WA cepat banget direspons. Pas ambil barang dicek bareng jadi yakin barangnya lengkap.&rdquo;
            </p>
            <div className="mt-4 pt-4 border-t border-border-subtle flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center text-xs">
                A
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Anisa Rahma</p>
                <p className="text-[10px] text-foreground-muted">Pendakian Gn. Gede</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
