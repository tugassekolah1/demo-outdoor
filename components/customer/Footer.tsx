import Link from "next/link";

/**
 * Footer profesional untuk customer.
 * Berisi identitas brand, jam operasional, link navigasi, dan kategori.
 */
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border-subtle bg-brand-primary-dark text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent text-white shadow-xs">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 20 L10 7 L15 15 L18 10 L22 20 Z" />
                </svg>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                TAPAK<span className="text-brand-accent">.</span>
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Rental peralatan mendaki & camping terpercaya. Siap temani
              petualanganmu dengan alat terawat, higienis, dan harga ramah kantong.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/90">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Unit Bersih & Siap Muncak
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-accent">
              Navigasi
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="transition-colors hover:text-white">
                  Katalog Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition-colors hover:text-white">
                  Keranjang Sewa
                </Link>
              </li>
              <li>
                <Link href="/#cara-sewa" className="transition-colors hover:text-white">
                  Panduan Cara Sewa
                </Link>
              </li>
            </ul>
          </div>

          {/* Kategori Populer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-accent">
              Kategori Alat
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/catalog?category=tenda" className="transition-colors hover:text-white">
                  Tenda Dome & Ultralight
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=carrier" className="transition-colors hover:text-white">
                  Carrier 60L - 80L
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=sleeping-bag" className="transition-colors hover:text-white">
                  Sleeping Bag Polar
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=matras" className="transition-colors hover:text-white">
                  Matras Lipat & Angin
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=kompor-portable" className="transition-colors hover:text-white">
                  Kompor & Cooking Set
                </Link>
              </li>
            </ul>
          </div>

          {/* Jam Operasional & Layanan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-accent">
              Basecamp & Layanan
            </h4>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p>
                <strong className="text-white">Jam Operasional:</strong>
                <br />
                Senin – Minggu: 08.00 – 21.00 WIB
              </p>
              <p>
                <strong className="text-white">Pengambilan Alat:</strong>
                <br />
                Ambil di Basecamp atau koordinasi pengiriman instan.
              </p>
              <p className="text-xs text-white/50 pt-1">
                Booking dikonfirmasi langsung oleh admin melalui WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} TAPAK Outdoor Rental. Solusi cerdas sewa alat gunung.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-white/80 transition-colors">
              Area Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
