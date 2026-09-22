# PROJECT_CONTEXT.md — TAPAK Outdoor Rental (Demo)

> File ini adalah "ingatan" project. Baca file ini dulu setiap kali
> melanjutkan pekerjaan, terutama jika chat sebelumnya terputus atau
> kena limit.

---

## 1. Tujuan Project

Membuat **demo website full-stack** untuk bisnis rental peralatan outdoor,
untuk ditunjukkan ke calon klien lokal (Indonesia) sebagai portofolio
kemampuan freelance web development. Bukan project produksi nyata — fokus
ke demo yang meyakinkan dan mudah dipahami.

Fitur utama: katalog produk rental, keranjang, form booking dengan
kalkulasi harga otomatis, konfirmasi via WhatsApp, dan panel admin untuk
kelola produk/kategori/booking.

---

## 2. Tech Stack

| Bagian | Teknologi | Alasan |
|---|---|---|
| Framework | Next.js 16 (App Router) | Frontend + backend jadi satu, gampang deploy |
| Bahasa | TypeScript | Type safety, lebih mudah di-maintain |
| Styling | Tailwind CSS v4 | Cepat untuk styling, konsisten |
| ORM | Prisma | Schema jelas, gampang dibaca pemula |
| Database (dev) | SQLite | Tidak perlu server DB terpisah, cocok untuk demo lokal |
| Backend API | Next.js Route Handlers (`app/api/**`) | Tidak perlu server terpisah |
| State keranjang | React Context (bukan Redux/Zustand) | Skalanya kecil, cukup Context untuk demo |
| Auth admin | Belum diimplementasikan (rencana: session/cookie manual, bukan NextAuth) | Akan dijelaskan detail di Phase 9 |

**Prinsip:** tidak menambah library baru tanpa alasan jelas. Setiap
tambahan dependency baru akan dicatat di bagian "Keputusan Teknis" di
bawah.

---

## 3. Status Phase

| Phase | Nama | Status |
|---|---|---|
| 1 | Project setup & struktur folder | ✅ Selesai |
| 2 | Prisma + database schema | ✅ Selesai |
| 3 | Seed data | 🟡 Sebagian (lihat catatan Bagian 8) |
| 4 | Homepage | ✅ Selesai |
| 5 | Catalog + search + filter | ✅ Selesai |
| 6 | Product detail + cart | ✅ Selesai |
| 7 | Booking system + kalkulasi harga | ✅ Selesai |
| 8 | WhatsApp booking | 🟡 Sebagian — lihat catatan Bagian 4d (ringkasan booking sudah ada, konfirmasi WA otomatis belum) |
| 9 | Admin authentication | ⬜ Belum dimulai |
| 10 | Admin dashboard + CRUD produk/kategori | ⬜ Belum dimulai |
| 11 | Admin booking management | ⬜ Belum dimulai |
| 12 | Validation, error handling, responsive, final testing | ⬜ Belum dimulai |

---

## 4. Fitur yang Sudah Selesai (Phase 1)

- [x] Project Next.js dibuat (TypeScript, Tailwind v4, App Router)
- [x] Prisma + `@prisma/client` terinstall (versi 5.22.0, dipin)
- [x] Struktur folder lengkap untuk customer, admin, api, components, lib
- [x] Root layout + palet warna brand (hijau `#2f5233` / oranye `#e07a3f`)
- [x] Navbar & Footer customer (statis, link belum aktif secara fungsional)
- [x] Layout admin dasar (belum ada proteksi login)
- [x] Homepage placeholder (menampilkan status project, bukan konten asli)
- [x] Halaman placeholder "Coming Soon" untuk semua route yang belum dikerjakan
- [x] `lib/prisma.ts` — Prisma Client singleton (pola anti multiple-instance saat hot reload)
- [x] `lib/utils.ts` — helper `formatRupiah()`
- [x] `.env` / `.env.example` — `DATABASE_URL` untuk SQLite
- [x] Schema Prisma **placeholder** (model `Placeholder` saja — bukan schema asli)
- [x] `npm run build` berhasil (13 route ter-generate, tanpa error)

**Belum selesai / sengaja ditunda ke phase berikutnya:**
- Schema database asli (User, Category, Product, Booking, BookingItem) → Phase 2
- Semua fitur katalog, cart, booking, admin CRUD, auth → phase masing-masing sesuai rencana

---

## 4b. Fitur yang Sudah Selesai (Phase 2)

- [x] `prisma/schema.prisma` diisi dengan schema asli: model `User`,
      `Category`, `Product`, `Booking`, `BookingItem`
- [x] Semua field wajib sesuai spesifikasi ada di masing-masing model
      (lihat Bagian 6 untuk detail)
- [x] Relasi antar-model: `Category 1—N Product`, `Product 1—N
      BookingItem`, `Booking 1—N BookingItem` (cascade delete)
- [x] Index ditambahkan di foreign key (`categoryId`, `bookingId`,
      `productId`) dan `Booking.status` untuk query yang lebih cepat
- [x] Migration SQL dibuat manual: `prisma/migrations/20260922065742_init_schema/migration.sql`
      (lihat catatan cara pembuatan di Bagian 8)
- [x] Migration SQL **diverifikasi valid** — dieksekusi langsung ke
      SQLite asli via Python, berhasil membentuk 5 tabel dengan foreign
      key yang benar
- [x] `prisma/dev.db` sudah dibuat dan migration sudah diterapkan ke
      dalamnya (termasuk tabel `_prisma_migrations` agar Prisma CLI
      mengenali migration ini sebagai sudah diterapkan)
- [x] `prisma/seed.ts` dibuat — seed 5 kategori + 10 produk contoh
      (tenda, carrier, sleeping bag, matras, kompor portable)
- [x] Data seed **sudah dimasukkan ke `prisma/dev.db`** secara manual
      (lihat Bagian 8) sebagai bukti data & relasi valid — database
      sudah siap pakai untuk Phase berikutnya
- [x] `package.json` — ditambah `prisma.seed` config dan script
      `db:seed`
- [x] `types/index.ts` — ditambah `BookingStatus` union type +
      `BOOKING_STATUSES` + `BOOKING_STATUS_LABEL` (pengganti enum,
      karena SQLite tidak mendukung enum native)
- [x] `npm run build` diverifikasi ulang **tetap berhasil** setelah
      perubahan Phase 2 (13 route Phase 1 tidak rusak)

**Belum benar-benar selesai (ditandai jujur, jangan dianggap 100% done):**
- `npx prisma db seed` (skrip TypeScript resminya) **belum pernah
  berhasil dijalankan** karena `@prisma/client` belum ter-generate di
  sandbox ini (lihat Bagian 8). Skrip sudah lolos pengecekan TypeScript
  dan strukturnya benar, tapi baru terverifikasi jalan lewat jalur
  manual (Python + SQL langsung), bukan lewat `tsx prisma/seed.ts`
  yang sesungguhnya. **Wajib dicoba ulang di komputer lokal.**

---

## 4c. Fitur yang Sudah Selesai (Phase 4/5/6 — Frontend Customer)

Dikerjakan bersamaan dalam satu sesi (homepage, katalog, detail produk,
dan cart saling bergantung — search di Navbar mengarah ke katalog,
detail produk mengisi cart, dll — jadi lebih konsisten dibangun sekaligus
daripada dipisah tiga sesi terpotong).

**Data layer:**
- [x] `lib/catalog.ts` — satu-satunya tempat query Prisma untuk katalog
      (`getCategories`, `getProducts` dengan filter `q`/`category`,
      `getProductBySlug`, `getRelatedProducts`, `getFeaturedProducts`).
      Semua halaman customer memanggil fungsi-fungsi ini, tidak ada
      `prisma.xxx.findMany` langsung tersebar di file page.
- [x] Tipe `ProductWithCategory` / `CategoryWithCount` ditulis manual
      (bukan `Prisma.ProductGetPayload<...>`) — **alasan teknis**: di
      sandbox pengerjaan ini, `Prisma` namespace hasil generate tidak
      tersedia (lihat catatan Prisma Client di Bagian 8), jadi
      `Prisma.XxxGetPayload` akan error TypeScript. Tipe manual ini
      mengikuti field asli `schema.prisma` persis dan tetap valid
      setelah `prisma generate` sungguhan dijalankan di lokal. **Boleh
      diganti ke `Prisma.XxxGetPayload<...>` di lokal nanti kalau mau
      type inference otomatis, tapi tidak wajib.**
- [x] Tidak ada API routes baru dibuat (`app/api/products`,
      `app/api/categories` masih `.gitkeep` kosong) — halaman customer
      adalah Server Component yang query Prisma langsung di server,
      sesuai pola App Router. API routes baru diperkirakan dibutuhkan
      mulai Phase 7 (booking) untuk menerima POST dari client.

**Homepage (`app/(customer)/page.tsx`):**
- [x] Hero dengan headline, CTA ke katalog & ke section "Cara Sewa"
- [x] Grid kategori (ikon custom per kategori, link ke katalog
      terfilter kategori tsb, jumlah produk per kategori)
- [x] Section "Paling Tersedia" — 4 produk dengan stok terbanyak
      (proxy sederhana untuk "populer", karena belum ada data
      booking/penjualan asli untuk dasar ranking sungguhan)
- [x] Section "Cara Sewa" 3 langkah (Pilih → Isi Detail → Konfirmasi WA)

**Katalog (`app/(customer)/catalog/page.tsx` + `CatalogFilters.tsx`):**
- [x] Search by nama produk (`?q=`) + filter kategori (`?category=`),
      keduanya lewat URL search params — hasil filter bisa
      di-share/bookmark, tombol back/forward browser tetap wajar
- [x] Search-as-you-type dengan debounce 350ms di client, tapi query
      inti tetap jalan di server lewat searchParams (progressive
      enhancement — filter tetap berfungsi walau JS gagal load)
- [x] Empty state kalau hasil filter kosong

**Detail Produk (`app/(customer)/product/[slug]/page.tsx` +
`AddToCartForm.tsx`):**
- [x] Breadcrumb, gambar produk (lihat catatan foto produk di bawah),
      deskripsi, harga per hari, sisa stok
- [x] Pemilih quantity dibatasi oleh stok (memperhitungkan quantity
      yang sudah ada di cart untuk produk yang sama)
- [x] Tombol tambah ke keranjang, dengan state "sudah ditambahkan"
- [x] `notFound()` kalau slug tidak ada di database
- [x] Section produk terkait (kategori sama, exclude diri sendiri)

**Keranjang (`app/(customer)/cart/page.tsx` + `context/CartContext.tsx`):**
- [x] `CartContext.tsx` diimplementasikan penuh (sebelumnya kerangka
      kosong dari Phase 1) — `addItem`, `removeItem`, `setQuantity`,
      `clearCart`, dibatasi oleh stok produk
- [x] Persistensi lewat `localStorage` (key `tapak-cart`) — isi
      keranjang tidak hilang saat reload/pindah halaman
- [x] `CartProvider` dipasang di `app/layout.tsx` (root layout, bukan
      customer layout) supaya nanti bisa dipakai juga oleh halaman
      booking (Phase 7) yang berada di luar group `(customer)` kalau
      diperlukan
- [x] Halaman cart: lihat item, ubah quantity, hapus item, subtotal
      per hari. **SENGAJA TIDAK** menghitung total akhir atau
      menjalankan proses booking apa pun — itu scope Phase 7. Tombol
      "Lanjut ke Booking" hanya `<Link href="/booking">` ke halaman
      placeholder yang sudah ada, tidak ada logic booking baru
      ditambahkan di Phase ini (sesuai instruksi eksplisit).

**Navbar (`components/customer/Navbar.tsx`):**
- [x] Diaktifkan penuh dari versi statis Phase 1 — link Beranda/Katalog
      dengan state aktif, search bar (submit → `/catalog?q=...`),
      badge jumlah item cart, menu hamburger untuk mobile

**Desain visual:**
- [x] `app/globals.css` diperluas dari palet dasar Phase 1 (hijau
      `#2f5233` / oranye `#e07a3f` dipertahankan) — ditambah warna
      krem hangat untuk background (`#f6f2ea`, bukan putih polos),
      token `surface`/`border-subtle`/`foreground-muted`, motif
      dekoratif garis kontur peta (`.contour-bg`, tema topografi
      pendakian), dan font display tegas untuk headline
      (font sistem, **bukan Google Fonts** — konsisten dengan
      keputusan teknis #2 di Bagian 7 yang menghindari fetch ke
      `fonts.googleapis.com`)
- [x] Ikon garis (line-art) custom per kategori di
      `components/customer/CategoryIcon.tsx` — SVG inline, tidak
      butuh file aset gambar

**Catatan foto produk:** field `Product.image` di data seed berisi
path seperti `/images/products/tenda-dome-4-orang.jpg`, tapi **file
foto aslinya belum ada** di `/public/images/products/` (memang belum
pernah dibuat di phase manapun). `components/customer/ProductImage.tsx`
menangani ini: mencoba load `src`, dan kalau gagal (404) otomatis
jatuh ke ilustrasi bertema kontur + ikon kategori. Begitu foto asli
ditambahkan ke path yang sama di folder itu, foto akan otomatis
terpakai tanpa perlu ubah kode apa pun.

**Cara verifikasi yang dilakukan tanpa Prisma CLI (lihat Bagian 8 untuk
kenapa Prisma CLI tidak bisa jalan di sandbox ini):**
1. `npx tsc --noEmit` → **0 error** dari semua kode Phase 4/5/6.
2. `npx eslint app components context lib` → **0 error**, 2 warning
   (satu disengaja dan dijelaskan di komentar `ProductImage.tsx`, satu
   lagi warning lama di `lib/prisma.ts` dari Phase 1, bukan dari kode
   Phase ini).
3. `npm run build` → tahap "Compiled successfully" dan "Running
   TypeScript" **lolos penuh** (jadi seluruh kode React/TypeScript
   Phase 4/5/6 valid). Build baru gagal setelahnya di tahap
   "Collecting page data", persis di titik yang sama dengan Phase 1/2:
   `new PrismaClient()` gagal karena engine belum ter-generate. **Ini
   bukan bug baru** — build akan lanjut sukses begitu `npx prisma
   generate` berhasil dijalankan di lokal (lihat langkah di Bagian 9).
4. Semua fungsi query di `lib/catalog.ts` (search by nama, filter
   kategori, hitung jumlah produk per kategori, ambil produk by slug,
   cari produk terkait) diverifikasi manual dengan menjalankan query
   SQL yang setara langsung ke `prisma/dev.db` lewat `sqlite3` Python,
   dan hasilnya dicocokkan dengan hasil yang diharapkan — semua benar.

---

## 4d. Fitur yang Sudah Selesai (Phase 7 — Booking Customer)

**Scope sesi ini: HANYA booking customer** (form → simpan ke DB →
tampilkan ringkasan). Tidak ada perubahan di admin atau fitur lain —
sesuai instruksi eksplisit.

**Data layer (`lib/booking.ts`):**
- [x] `calculateRentalDays(startDate, endDate)` — jumlah hari sewa,
      inklusif tanggal mulai & selesai (booking 1 hari = mulai sama
      dengan selesai tetap dihitung 1 hari, bukan 0). Diekspor supaya
      dipakai bersama di server (API route) dan client (form,
      preview total sebelum submit) — satu-satunya tempat logic ini
      ditulis, tidak diduplikasi.
- [x] `createBooking(input)` — validasi server-side penuh (nama min.
      3 karakter, nomor WhatsApp, tanggal mulai ≤ selesai, tanggal
      mulai tidak boleh masa lalu, minimal 1 item), lalu jalan dalam
      **satu transaksi Prisma** (`prisma.$transaction`):
      1. Ambil ulang `pricePerDay` & `stock` produk **langsung dari
         database** (harga dari client SAMA SEKALI tidak dipercaya —
         mencegah manipulasi harga dari sisi client).
      2. Validasi stok cukup untuk tiap item.
      3. Hitung `subtotal` per item = `pricePerDay × quantity ×
         rentalDays`, dan `totalPrice` = jumlah semua subtotal.
      4. Buat `Booking` + `BookingItem` (harga di-snapshot ke
         `BookingItem.price`, sesuai keputusan teknis #7 di Bagian 7).
      5. Kurangi `Product.stock` sesuai quantity yang dibooking.
      Kalau ada langkah yang gagal (produk tidak ada, stok kurang),
      seluruh transaksi dibatalkan (tidak ada booking/pengurangan
      stok setengah jadi).
- [x] `getBookingById(id)` — satu booking + items + data produk
      terkait, dipakai halaman ringkasan.
- [x] Status booking baru selalu `"PENDING"` (memakai
      `BookingStatus`/`BOOKING_STATUS_LABEL` dari `types/index.ts`,
      Phase 2).

**API Route (`app/api/bookings/route.ts`):**
- [x] `POST /api/bookings` — menerima JSON dari form, validasi bentuk
      data dasar, lempar ke `createBooking()`, balas `{ ok, bookingId }`
      (201) atau `{ ok: false, error }` (400) dengan pesan yang bisa
      langsung ditampilkan ke customer.
- [x] `app/api/bookings/.gitkeep` dihapus, digantikan `route.ts`
      sungguhan.
- [x] TIDAK ada `GET` (list semua booking) — itu scope admin Phase 11,
      sengaja tidak dibuat.

**Form Booking (`app/(customer)/booking/page.tsx`):**
- [x] Client Component penuh — Menggantikan placeholder Phase 1.
- [x] Produk yang dibooking diambil dari `CartContext` (bukan form
      pemilihan produk baru) — konsisten dengan alur "tambah ke
      keranjang di katalog/detail produk (Phase 6) → lanjut ke
      booking" yang sudah ada. Customer tetap bisa ubah quantity /
      hapus item langsung di halaman ini lewat `useCart()`, tanpa
      perlu bolak-balik ke `/cart`.
- [x] Field: nama, WhatsApp, tanggal mulai, tanggal selesai, catatan
      (opsional). Validasi dasar di client (`required`, `min` tanggal
      = hari ini) sebagai UX cepat — validasi yang benar-benar
      menentukan tetap di server (`lib/booking.ts`).
- [x] Preview jumlah hari sewa & total harga dihitung real-time di
      client (pakai `calculateRentalDays` yang sama dengan server)
      begitu kedua tanggal diisi — supaya customer lihat total
      sebelum submit, tapi total yang benar-benar tersimpan tetap
      dihitung ulang di server saat submit (server tidak percaya
      angka dari client).
- [x] Redirect ke `/booking/success?id=<bookingId>` setelah sukses,
      `clearCart()` dipanggil setelah redirect berhasil dipicu.
- [x] Empty state kalau keranjang kosong (arahkan ke `/catalog`),
      sama seperti pola di halaman cart (Phase 6).
- [x] Pesan error dari server (stok kurang, produk tidak ada,
      validasi gagal) ditampilkan apa adanya ke customer.

**Ringkasan Booking (`app/(customer)/booking/success/page.tsx`):**
- [x] Server Component — mengambil booking via `getBookingById(id)`
      dari `?id=` di URL (bukan dari state client), supaya halaman
      tetap bisa dibuka ulang/direfresh/disimpan sebagai bukti
      walaupun cart sudah dikosongkan setelah submit.
- [x] `notFound()` kalau `id` tidak ada di query atau booking tidak
      ditemukan di database.
- [x] Menampilkan: ID booking, status (label Bahasa Indonesia dari
      `BOOKING_STATUS_LABEL`), nama, WhatsApp, tanggal mulai/selesai,
      durasi sewa, catatan (kalau ada), daftar produk dengan
      breakdown harga/hari × quantity × jumlah hari, dan total akhir.

**Cara verifikasi yang dilakukan (lihat Bagian 8 untuk kenapa Prisma
CLI/engine tidak bisa jalan penuh di sandbox ini):**
1. `npm install` **berhasil** di sesi ini (berbeda dari phase
   sebelumnya yang belum pernah mencoba) — `postinstall: prisma
   generate` tetap **gagal** di tahap download engine binary dari
   `binaries.prisma.sh` (403 Forbidden), **persis** limitasi yang
   sudah didokumentasikan di Bagian 8. Tapi proses `prisma generate`
   sempat menulis ulang `.prisma/client` type stub sebelum gagal —
   tidak mengubah status: `PrismaClient` tetap belum ter-generate
   penuh dengan tipe schema asli di sandbox ini.
2. `npx tsc --noEmit` → **0 error** dari semua kode Phase 7 baru
   (`lib/booking.ts`, `app/api/bookings/route.ts`,
   `app/(customer)/booking/page.tsx`,
   `app/(customer)/booking/success/page.tsx`). Satu error yang
   tersisa (`LayoutProps` di `app/layout.tsx`) **sudah ada sebelum
   sesi ini** dan tidak berhubungan — muncul karena tipe global
   Next.js 16 (`.next/types`) belum ter-generate di sandbox ini
   (hanya muncul setelah `next build`/`next dev` sungguhan jalan di
   lokal).
3. `npx eslint lib/booking.ts app/api/bookings/route.ts
   "app/(customer)/booking/page.tsx"
   "app/(customer)/booking/success/page.tsx"` → **0 error, 0
   warning**.
4. `npx next build` → **"Compiled successfully"** dan tahap
   **TypeScript lolos penuh** (mengkonfirmasi seluruh kode Phase 7
   valid). Build gagal setelahnya persis di tahap yang sama dengan
   Phase 1/2/4-6: `new PrismaClient()` gagal karena engine belum
   ter-generate — **bukan bug baru**, akan lanjut sukses begitu `npx
   prisma generate` berhasil dijalankan di lokal (ada akses internet
   normal ke `binaries.prisma.sh`).
5. **Logic kalkulasi harga & transaksi disimulasikan manual** langsung
   ke `prisma/dev.db` sungguhan lewat Python (`sqlite3`), meniru
   persis apa yang dilakukan `createBooking()`: ambil 2 produk asli
   dari database (harga Rp35.000 & Rp45.000/hari), booking 3 hari
   (2026-10-01 s/d 2026-10-03), quantity 2 & 1 → total dihitung
   **Rp345.000** (`35000×2×3 + 45000×1×3`), cocok dengan hasil manual.
   Booking + BookingItem tersimpan dengan benar, stok produk
   berkurang sesuai quantity. **Data uji coba ini sudah dihapus
   lagi** dan stok dikembalikan ke angka semula — `prisma/dev.db`
   yang dikirim tetap bersih (0 booking), tidak ada data dummy
   tersisa dari verifikasi ini.

**Belum benar-benar dijalankan (sama seperti phase-phase
sebelumnya):** alur booking penuh (isi form → submit → redirect ke
ringkasan) **belum pernah benar-benar dieksekusi lewat browser +
Prisma Client asli** di sandbox ini, karena alasan yang sama di poin
1 & 4 di atas. Logic-nya sudah diverifikasi benar secara manual
(poin 5), dan seluruh kode lolos compile TypeScript + build Next.js
sampai tahap terakhir yang mungkin tanpa Prisma Client asli. **Wajib
dicoba end-to-end di komputer lokal** (langkah ada di Bagian 9).

---

## 5. File & Folder Penting

```
tapak-outdoor-rental/
├── PROJECT_CONTEXT.md          ← file ini
├── README.md                   ← instruksi setup & catatan Prisma
├── .env / .env.example         ← DATABASE_URL="file:./dev.db"
├── prisma/
│   ├── schema.prisma            ← schema ASLI (User, Category, Product, Booking, BookingItem)
│   ├── seed.ts                  ← seed data: 5 kategori + 10 produk
│   ├── dev.db                   ← database SQLite, migration + seed sudah diterapkan
│   └── migrations/
│       ├── migration_lock.toml
│       └── 20260922065742_init_schema/
│           └── migration.sql    ← dibuat manual (lihat Bagian 8)
├── app/
│   ├── layout.tsx               ← root layout, sekarang bungkus <CartProvider>
│   ├── globals.css              ← palet brand + token krem/kontur (Phase 4-6)
│   ├── (customer)/
│   │   ├── layout.tsx           ← bungkus Navbar + Footer
│   │   ├── page.tsx             ← homepage ASLI (Phase 4)
│   │   ├── catalog/page.tsx     ← katalog + search + filter ASLI (Phase 5)
│   │   ├── product/[slug]/page.tsx ← detail produk ASLI (Phase 6)
│   │   ├── cart/page.tsx        ← keranjang ASLI (Phase 6)
│   │   └── booking/
│   │       ├── page.tsx         ← ASLI (Phase 7): form booking customer
│   │       └── success/page.tsx ← ASLI (Phase 7): ringkasan booking
│   ├── admin/
│   │   ├── layout.tsx           ← layout admin, BELUM ada proteksi auth
│   │   ├── login/page.tsx       ← placeholder → Phase 9
│   │   ├── dashboard/page.tsx   ← placeholder → Phase 10
│   │   ├── products/page.tsx    ← placeholder → Phase 10
│   │   ├── categories/page.tsx  ← placeholder → Phase 10
│   │   └── bookings/page.tsx    ← placeholder → Phase 11
│   └── api/
│       ├── products/.gitkeep    ← masih kosong (Phase 5 pakai Server Component langsung, bukan API route)
│       ├── categories/.gitkeep  ← kosong, diisi Phase 10
│       ├── bookings/route.ts    ← BARU (Phase 7): POST buat booking baru (customer saja)
│       └── auth/.gitkeep        ← kosong, diisi Phase 9
├── components/
│   ├── customer/Navbar.tsx      ← AKTIF PENUH (Phase 4-6): search, badge cart, menu mobile
│   ├── customer/Footer.tsx      ← statis (belum diubah)
│   ├── customer/CategoryIcon.tsx    ← BARU (Phase 4-6): ikon SVG per kategori
│   ├── customer/ProductImage.tsx    ← BARU (Phase 4-6): gambar + fallback ilustrasi
│   ├── customer/ProductCard.tsx     ← BARU (Phase 4-6): kartu produk (katalog & homepage)
│   ├── customer/CatalogFilters.tsx  ← BARU (Phase 5): search box + tombol kategori
│   ├── customer/AddToCartForm.tsx   ← BARU (Phase 6): pemilih quantity + tombol cart
│   └── ui/ComingSoon.tsx        ← masih dipakai halaman admin yang belum dikerjakan
├── context/
│   └── CartContext.tsx          ← DIISI PENUH (Phase 6, sebelumnya kerangka kosong)
├── lib/
│   ├── prisma.ts                ← Prisma Client singleton (belum diubah)
│   ├── catalog.ts               ← BARU (Phase 4-6): semua query Prisma untuk katalog
│   ├── booking.ts               ← BARU (Phase 7): validasi, kalkulasi harga, transaksi booking
│   ├── utils.ts                 ← formatRupiah()
│   └── auth.ts                  ← KERANGKA SAJA, kosong. Logic asli Phase 9
└── types/
    └── index.ts                 ← BookingStatus union type + label (Phase 2)
```

---

## 6. Database / Schema

**Status: SUDAH DIBUAT (Phase 2).**

### Model & Field

**User** (akun admin)
- `id`, `name`, `email` (unik), `password` (hash, bukan plain text),
  `role` (default `"admin"`), `createdAt`, `updatedAt`

**Category**
- `id`, `name` (unik), `slug` (unik), `createdAt`, `updatedAt`
- Relasi: `products` (1—N ke Product)

**Product**
- `id`, `name`, `slug` (unik), `description`, `pricePerDay` (Int,
  Rupiah), `stock`, `image` (opsional), `categoryId`, `createdAt`,
  `updatedAt`
- Relasi: `category` (N—1 ke Category), `bookingItems` (1—N ke
  BookingItem)
- Index: `categoryId`

**Booking**
- `id`, `customerName`, `whatsapp`, `startDate`, `endDate`, `note`
  (opsional), `status` (default `"PENDING"`), `totalPrice`,
  `createdAt`, `updatedAt`
- Relasi: `items` (1—N ke BookingItem)
- Index: `status`

**BookingItem**
- `id`, `bookingId`, `productId`, `quantity`, `price` (snapshot
  `pricePerDay` saat booking dibuat), `subtotal`, `createdAt`
- Relasi: `booking` (N—1, `onDelete: Cascade`), `product` (N—1)
- Index: `bookingId`, `productId`

### Status Booking (pengganti enum)

SQLite tidak mendukung `enum` native di Prisma, jadi `Booking.status`
disimpan sebagai `String`. Nilai yang valid dijaga lewat TypeScript di
`types/index.ts`:

```
PENDING | CONFIRMED | ONGOING | COMPLETED | CANCELLED
```

Validasi runtime (menolak nilai selain 5 ini) akan ditambahkan di API
route handler pada **Phase 7** (saat booking dibuat) dan **Phase 11**
(saat admin mengubah status).

### Migration

- File: `prisma/migrations/20260922065742_init_schema/migration.sql`
- Berisi: `CREATE TABLE` untuk 5 tabel + semua `CREATE INDEX` (unique
  & non-unique) sesuai schema
- **Cara dibuat:** ditulis manual mengikuti format resmi Prisma
  migration (bukan hasil `prisma migrate dev`, karena command itu
  tidak bisa jalan di sandbox ini — lihat Bagian 8). SQL sudah
  **diverifikasi valid** dengan mengeksekusinya langsung ke SQLite
  asli (Python `sqlite3`), berhasil membentuk 5 tabel dengan foreign
  key yang benar (dicek dengan `PRAGMA foreign_key_list`).
- `prisma/dev.db` sudah berisi hasil migration ini, plus tabel
  `_prisma_migrations` yang menandai migration `20260922065742_init_schema`
  sudah "applied" — supaya Prisma CLI di lokal tidak bingung/minta
  re-run saat kamu jalankan `prisma migrate dev` nanti.

### Seed Data

- File: `prisma/seed.ts`
- Isi: 5 kategori (Tenda, Carrier, Sleeping Bag, Matras, Kompor
  Portable) dan 10 produk (2 per kategori), dengan harga & stok yang
  masuk akal untuk demo
- Pakai `upsert` (bukan `create`) supaya aman dijalankan berulang kali
  tanpa duplikat data
- Terdaftar di `package.json` (`prisma.seed` config) → bisa dijalankan
  dengan `npx prisma db seed` atau `npm run db:seed`
- **Data ini sudah ada di `prisma/dev.db`** (dimasukkan manual, lihat
  Bagian 8) — jadi database sudah siap dipakai untuk Phase 4/5 dst

---

## 7. Keputusan Teknis Penting

1. **Prisma versi dipin ke `5.22.0`** (bukan `latest`) — versi terbaru
   memicu bug pada npm arborist di sandbox ini (`Cannot read properties
   of null (reading 'edgesOut')`) saat resolusi peer dependency
   `vitest`. Versi 5.22.0 terbukti stabil untuk di-install. Boleh
   dicoba upgrade nanti di komputer lokal jika perlu, tapi tidak wajib
   untuk demo.
2. **`next/font/google` (Geist) DIHAPUS dari root layout.** Awalnya
   dipakai otomatis oleh `create-next-app`, tapi memicu fetch ke
   `fonts.googleapis.com` yang gagal di sandbox. Diganti font sistem
   biasa (`font-sans` default browser). Ini juga mengurangi 1
   dependency eksternal — tidak masalah untuk demo, dan tetap terlihat
   rapi.
3. **CartContext dan lib/auth.ts sengaja dibuat sebagai file kerangka
   kosong** di Phase 1, TIDAK diimpor di manapun — supaya tidak ada
   kode setengah jadi yang aktif dan berpotensi bikin bingung sebelum
   phase-nya tiba.
4. **`postinstall: prisma generate` ditambahkan ke `package.json`** —
   supaya Prisma Client otomatis ter-generate saat `npm install`
   dijalankan di komputer dengan akses internet normal.
5. **Dark mode (prefers-color-scheme) dihapus** dari `globals.css` —
   untuk demo ke klien, tampilan sebaiknya konsisten (selalu light
   mode), bukan berubah mengikuti setting device.
6. **Status booking pakai `String` + TypeScript union type, bukan
   Prisma `enum`** — SQLite tidak mendukung enum native di Prisma.
   Pola ini (String di DB + union type di app layer) adalah pendekatan
   umum untuk Prisma + SQLite dan tetap memberi type-safety di sisi
   TypeScript.
7. **`price` di-snapshot ke `BookingItem`, bukan selalu mengambil dari
   `Product.pricePerDay` terkini** — supaya total harga di histori
   booking tidak berubah kalau admin mengubah harga produk setelah
   booking dibuat. Ini keputusan penting untuk integritas data
   transaksi.
8. **`BookingItem.booking` pakai `onDelete: Cascade`, tapi
   `BookingItem.product` TIDAK** (default `Restrict`) — kalau booking
   dihapus, item-nya ikut terhapus (masuk akal, tidak ada gunanya item
   tanpa booking induk). Tapi produk tidak boleh dihapus kalau masih
   direferensikan oleh BookingItem manapun — mencegah histori booking
   jadi rusak/kehilangan data produk.
9. **Migration SQL Phase 2 ditulis manual**, bukan hasil `prisma
   migrate dev` — karena Prisma CLI (termasuk `validate`, `format`,
   `migrate`) semuanya butuh mengunduh engine binary dari
   `binaries.prisma.sh` yang tidak bisa diakses di sandbox ini (sama
   seperti kendala `prisma generate` di Phase 1). SQL sudah
   diverifikasi valid dengan menjalankannya langsung ke SQLite asli.
   **Tidak berdampak ke kamu** — struktur migration folder-nya
   mengikuti format resmi Prisma, jadi `prisma migrate dev` di lokal
   akan tetap mengenalinya dengan benar.

---

## 8. Masalah / Error yang Belum Selesai

⚠️ **PENTING — baca ini sebelum lanjut:**

- **Semua perintah Prisma CLI (`generate`, `validate`, `format`,
  `migrate dev`, `db seed`) BELUM PERNAH BERHASIL dijalankan di
  sandbox Claude**, dari Phase 1 sampai Phase 2. Sandbox ini tidak
  punya akses ke domain `binaries.prisma.sh` (tempat Prisma
  mengunduh engine binary), dan domain ini tidak bisa ditambahkan ke
  allowlist jaringan sandbox.
  - **Ini BUKAN bug di kode project.** Ini murni keterbatasan
    jaringan sandbox tempat project dikerjakan.

- **Cara saya memverifikasi Phase 2 tanpa Prisma CLI:**
  1. Schema (`schema.prisma`) direview manual baris per baris untuk
     sintaks dan relasi (tidak ada `prisma validate` yang bisa
     dijalankan).
  2. Migration SQL ditulis manual mengikuti format SQL yang akan
     dihasilkan Prisma untuk schema seperti ini, lalu **dieksekusi
     langsung ke SQLite asli** memakai modul `sqlite3` bawaan Python
     (bukan Prisma) — berhasil membentuk 5 tabel dengan foreign key
     yang benar, diverifikasi dengan `PRAGMA foreign_key_list`.
  3. Data seed (5 kategori + 10 produk) dimasukkan ke `prisma/dev.db`
     dengan cara yang sama (Python + SQL langsung), dan berhasil
     — dicek ulang jumlah baris & relasi kategori-produk sesuai.
  4. `prisma/seed.ts` (skrip TypeScript resminya) **dicoba dijalankan**
     lewat `npx tsx prisma/seed.ts` dan gagal — tapi errornya
     mengonfirmasi bahwa `@prisma/client` belum ter-generate (bukan
     error di skrip/tipe data). Artinya skrip sudah lolos compile
     TypeScript, hanya belum bisa dieksekusi penuh di sandbox ini.
  5. `npm run build` dijalankan ulang setelah semua perubahan Phase 2
     — **berhasil**, 13 route Phase 1 tidak rusak.

- **Dampak buat kamu:** database (`prisma/dev.db`) yang saya kirim
  **sudah berisi migration + seed data**, jadi kamu bisa langsung
  `npm run dev` di lokal tanpa harus re-migrate/re-seed. Tapi tetap
  **sangat disarankan** jalankan langkah berikut di lokal sekali,
  untuk memastikan semuanya benar-benar tervalidasi Prisma CLI
  sesungguhnya (bukan cuma verifikasi manual saya):
  ```bash
  npm install
  npx prisma generate
  npx prisma validate
  npx prisma migrate dev
  ```
  Kalau `prisma migrate dev` mendeteksi migration `20260922065742_init_schema`
  sudah "applied" (karena tabel `_prisma_migrations` sudah saya isi),
  itu normal — artinya database kamu sudah sinkron dengan migration
  history. Kalau muncul pesan "drift detected" atau semacamnya,
  beri tahu saya persis pesannya di sesi berikutnya.

---

## 9. Langkah Berikutnya

**WAJIB dilakukan di lokal sebelum menunjukkan demo ke klien** — frontend
customer (Phase 4-7, termasuk booking) sudah ditulis lengkap dan lolos
`tsc`/`eslint`/Turbopack compile di sandbox, tapi **belum pernah
benar-benar dijalankan** dengan Prisma Client asli (lihat Bagian 8:
sandbox ini tidak bisa mengunduh engine binary Prisma dari
`binaries.prisma.sh`). Jalankan:
```bash
npm install
npx prisma generate
npx prisma validate
npm run dev
```
Lalu cek manual di browser:
- `/` — homepage, kategori & produk unggulan muncul
- `/catalog` — semua 10 produk muncul, coba search "tenda" dan filter
  kategori "Carrier", coba kombinasi search+kategori sekaligus
- `/product/tenda-dome-konsina-4-orang` (atau slug produk lain) — detail
  produk, coba ubah quantity dan tambah ke keranjang
- `/cart` — item yang ditambahkan muncul, coba ubah quantity/hapus,
  reload halaman untuk pastikan keranjang tidak hilang (localStorage)
- `/booking` — **BARU Phase 7**, ini yang paling penting dicek: isi
  nama, WhatsApp, tanggal mulai/selesai, catatan, pastikan total
  harga di preview berubah sesuai jumlah hari, submit, lalu pastikan
  redirect ke `/booking/success?id=...` dan datanya cocok dengan yang
  diisi. Cek juga: submit dengan keranjang kosong (harus diarahkan ke
  katalog), submit dengan quantity melebihi stok (harus ditolak
  dengan pesan error dari server), dan buka ulang link
  `/booking/success?id=...` yang sama (harus tetap bisa dibuka walau
  keranjang sudah kosong).
- Cek tampilan di lebar layar HP (~375px) dan desktop

Kalau ada error runtime yang **tidak** disebabkan Prisma Client belum
di-generate, beri tahu pesan errornya persis di sesi berikutnya.

**Opsi lanjutan setelah itu:**
- Lanjut ke **Phase 8 lanjutan — konfirmasi WhatsApp otomatis**
  (misal tombol "Kirim ke WhatsApp Admin" di halaman ringkasan yang
  membuka `wa.me` dengan pesan pre-filled berisi detail booking) —
  saat ini ringkasan sudah ada tapi belum ada integrasi WA aktif,
  atau
- Lanjut ke **Phase 9 — Admin authentication**, lalu **Phase 10/11**
  (dashboard admin, CRUD produk/kategori, kelola booking — termasuk
  ubah status booking dari `PENDING` ke status lain), atau
- Tambahkan foto produk asli ke `/public/images/products/` (lihat
  nama file yang diharapkan di `prisma/seed.ts`) — `ProductImage.tsx`
  akan otomatis memakainya tanpa perlu ubah kode, atau
- Kerjakan **Phase 3** (data Booking/BookingItem dummy) kalau ingin
  ada contoh data untuk testing tampilan admin nanti di Phase 11 —
  **catatan:** sekarang sudah ada jalur asli untuk membuat booking
  (Phase 7), jadi Phase 3 ini jadi kurang penting kecuali butuh data
  contoh dalam jumlah banyak sekaligus untuk testing.
