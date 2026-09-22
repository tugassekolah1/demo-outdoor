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
| Auth admin | Session cookie manual (HMAC-SHA256 via Web Crypto), tanpa NextAuth | Credential dari env `ADMIN_EMAIL`/`ADMIN_PASSWORD` (fallback tabel `User`) — diimplementasikan Phase 9 di `lib/auth.ts` |

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
| 8 | WhatsApp booking | ✅ Selesai |
| 9 | Admin authentication | ✅ Selesai |
| 10 | Admin dashboard + CRUD produk/kategori | ✅ Selesai |
| 11 | Admin booking management | ✅ Selesai |
| 12 | Validation, error handling, responsive, final testing | 🟡 Sebagian — validasi/error handling admin, build, lint & uji HTTP lulus; cek visual browser manual masih perlu (lihat catatan Bagian 4e) |

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

## 4e. Fitur yang Sudah Selesai (Phase 8–11 — WhatsApp, Auth & Panel Admin)

Dikerjakan dalam satu sesi lanjutan (Phase 8, 9, 10, 11) plus beberapa
permintaan UI tambahan dari pemilik project. **Schema Prisma TIDAK
berubah** (tidak ada model/field yang dihapus), **tidak ada dependency
baru**, dan fitur customer lama tidak diutak-atik kecuali perubahan
kecil yang diminta eksplisit (lihat bagian "Perubahan UI customer").

### Phase 8 — Konfirmasi WhatsApp
- [x] `lib/whatsapp.ts` (baru):
  - `getAdminWhatsAppNumber()` — nomor admin dari **env
    `WHATSAPP_ADMIN_NUMBER`** (TIDAK pernah hardcode); normalisasi: buang
    simbol, awalan `0` → `62`.
  - `buildBookingWhatsAppMessage()` — pesan berisi: nama customer, nomor
    WhatsApp, produk + jumlah unit, tanggal mulai, tanggal selesai,
    durasi, **total harga**, catatan, dan ID booking.
  - `getWhatsAppBookingLink()` — link `https://wa.me/<nomor>?text=...`.
- [x] Tombol **"Kirim ke WhatsApp Admin"** di halaman
  `booking/success` (buka tab baru). Jika env belum diisi → tombol tampil
  nonaktif + petunjuk pengaturan env (halaman tetap aman, tanpa error).
- [x] `formatTanggal()` dipindah ke `lib/utils.ts` (dipakai bersama
  ringkasan booking, pesan WA, dan halaman admin; ditambah
  `timeZone: "UTC"` supaya tanggal tidak bergeser di server non-WIB).

### Phase 9 — Admin Authentication
- [x] `lib/auth.ts` diimplementasi penuh, tetap tanpa library auth:
  - **Credential**: utama dari env `ADMIN_EMAIL` & `ADMIN_PASSWORD`
    (perbandingan constant-time); fallback ke tabel `User` bila env
    kosong (password hash **PBKDF2-SHA256** via Web Crypto, format
    `pbkdf2$<iterasi>$<salt>$<hash>`; helper `hashPassword` tersedia
    untuk menanam akun admin nanti lewat script).
  - **Session**: cookie HttpOnly `tapak_admin_session` (berlaku 7 hari)
    berisi `base64url(payload).signature`, ditandatangani HMAC-SHA256
    dengan secret `AUTH_SECRET` (fallback `ADMIN_PASSWORD`) memakai Web
    Crypto bawaan — aman dipakai di Node maupun Edge, tanpa tabel
    session, tanpa dependency.
  - **Proteksi 2 lapis**: (1) `app/admin/(panel)/layout.tsx` redirect
    halaman panel ke `/admin/login` bila session tidak valid; (2) setiap
    route handler tulis admin memanggil `getAdminSession()` dan membalas
    **401**. Halaman login berada **di luar** route group `(panel)`
    sehingga tetap terjangkau, sementara URL panel tidak berubah.
- [x] `POST /api/auth/login` (set cookie) & `POST /api/auth/logout`
  (hapus cookie + redirect 303, dipanggil form HTML di `AdminNav`).
- [x] Halaman login asli `/admin/login` + `components/admin/LoginForm`.
- Env demo di `.env` (dibuat karena sebelumnya belum ada):
  `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`,
  `WHATSAPP_ADMIN_NUMBER` (semua juga didokumentasikan di
  `.env.example`).

### Phase 10 — Admin Dashboard + CRUD Produk/Kategori
- [x] Dashboard (`/admin/dashboard`): kartu ringkasan **jumlah produk,
  jumlah kategori, jumlah booking, booking pending** + tabel **booking
  terbaru** (5 terakhir) — query di `lib/admin.ts`
  (`getAdminStats`, `getBookings`).
- [x] `lib/admin.ts` — data layer admin: stats, daftar/detail booking,
  CRUD produk & kategori (validasi server-side, pesan error Bahasa
  Indonesia, pemetaan kode Prisma P2003/P2025/P2002).
- [x] CRUD Produk (`/admin/products` + `ProductsManager`): daftar
  (thumbnail, kategori, harga, stok), tambah, edit, hapus — field: nama,
  deskripsi, harga/hari, stok, kategori, gambar.
  - Slug dibuat otomatis dari nama saat **create** (unik; suffix `-2`,
    `-3`, ...) dan **tidak pernah diubah saat edit** supaya link
    `/product/<slug>` yang sudah dibagikan tidak pecah.
  - Hapus produk yang direferensikan `BookingItem` **ditolak** (histori
    booking harus tetap utuh).
- [x] **Upload gambar produk** (permintaan tambahan: admin tidak perlu
  mengetik path file):
  - `POST /api/upload` (admin-only): `multipart/form-data` via
    `request.formData()` bawaan Next + `fs/promises` Node (**tanpa
    dependency baru**), validasi tipe (JPG/PNG/WebP/GIF) & ukuran
    (maks 2 MB), nama file di-slugify + suffix unik (anti path
    traversal), disimpan ke `public/images/products/` — folder yang sama
    yang sudah diharapkan `ProductImage.tsx` & data seed.
  - Form produk: input path manual **diganti** input file + preview
    (object URL lokal — tidak ada file sampah batal upload); upload
    dijalankan saat tombol Simpan ditekan, hasil URL dipakai sebagai
    `Product.image`. Tersedia tombol "Batalkan file ini" & "Hapus gambar".
- [x] CRUD Kategori (`/admin/categories` + `CategoriesManager`): daftar
  (dengan jumlah produk), tambah, edit nama, hapus. Slug otomatis dari
  nama saat create; slug tidak diubah saat edit. Hapus kategori berisi
  produk **ditolak**.

### Phase 11 — Booking Management
- [x] `types/index.ts` + `BOOKING_STATUS_TRANSITIONS`:
  `PENDING → CONFIRMED → ONGOING → COMPLETED`; `CANCELLED` bisa dari
  PENDING/CONFIRMED/ONGOING; `COMPLETED` & `CANCELLED` bersifat **final**
  (label Bahasa Indonesia ikut ditambahkan di sini).
- [x] `PATCH /api/bookings/[id]` (admin-only) → `updateBookingStatus`
  di `lib/admin.ts`: validasi status + cek transisi dalam **satu
  transaksi Prisma**; **stok produk otomatis dikembalikan saat booking
  di-CANCELLED** (dan karena CANCELLED final, stok tidak mungkin
  dikembalikan dua kali).
- [x] Halaman `/admin/bookings` (tabel `BookingTable` + badge
  `StatusBadge`) dan `/admin/bookings/[id]` (data pelanggan, item, total,
  catatan) + `BookingStatusChanger` (tombol hanya menawarkan transisi
  yang diizinkan; tombol Batalkan pakai konfirmasi).

### Perubahan UI customer (diminta eksplisit oleh pemilik project)
- [x] Tombol **"Sewa Sekarang"** di `AddToCartForm`: produk & jumlah
  langsung dimasukkan ke cart (form booking membaca `CartContext`) lalu
  user dibawa **langsung ke `/booking` — tanpa mampir halaman keranjang**.
  Tombol "Tambah ke Keranjang" & "Buka Keranjang" tetap tersedia.
- [x] Info stok **"Tersedia N unit" dipindahkan ke BAWAH pemilih jumlah**
  (sebelumnya menempel di atas form, di bawah deskripsi) — mengikuti pola
  online shop. Ditambah catatan "X sudah di keranjang" bila ada.

### Hasil verifikasi (di lingkungan ini; Prisma Client sudah ter-generate)
1. `npx prisma validate` → schema valid.
2. `npx prisma generate` → **berhasil** (engine terunduh — kendala lama di
   Bagian 8 sudah teratasi; `@prisma/client` kini bertipe penuh).
3. `npx prisma db seed` → **berhasil dijalankan PERTAMA KALINYA** (dulu
   belum pernah bisa) — dipakai untuk memulihkan produk yang sempat
   terhapus saat pengujian paralel; `upsert` dengan `update:{}` sehingga
   data yang sudah ada tidak ditimpa.
4. `npx tsc --noEmit` → **0 error** (penyesuaian tipe kecil pasca-generate:
   anotasi `tx: typeof prisma` di `lib/booking.ts` & `lib/admin.ts` dihapus
   agar overload `$transaction` cocok — runtime tidak berubah; anotasi
   `Uint8Array<ArrayBuffer>` di `lib/auth.ts`).
5. `npx eslint app components lib context types` → **0 error** (2 warning
   lama: `<img>` di ProductImage & unused directive di lib/prisma.ts —
   bukan dari sesi ini).
6. `npx next build` → **sukses penuh** ("Compiled successfully", lolos
   TypeScript, 21 route ter-generate — route admin jadi **Dynamic** karena
   dicek cookie; halaman customer tetap static kecuali pakai searchParams).
7. **Uji end-to-end lewat HTTP ke dev server (± 33 skenario) — semuanya
   lolos**, antara lain: login salah → 401, login benar → 200 + cookie;
   `/admin/dashboard` tanpa cookie → redirect 307 ke login, dengan cookie →
   200; API admin tanpa cookie → 401; CRUD kategori (buat, rename, hapus,
   tolak hapus berisi produk); CRUD produk (buat, PATCH, hapus, tolak hapus
   berbooking); upload gambar (201 + file terunduh 200, tolak tipe salah →
   400, tolak tanpa login → 401); booking customer (stok berkurang sesuai
   jumlah, total benar: 2 unit × 3 hari × Rp25.000 = Rp150.000); link WA
   memakai nomor dari env & pesan berisi semua field yang diminta; transisi
   status (lompat/final/status ngawur ditolak 400); **cancel → stok
   kembali** (17 → 20); logout → 303 + cookie terhapus; tombol
   "Sewa Sekarang" & posisi info stok terverifikasi dari HTML hasil SSR.

### Belum diverifikasi / catatan jujur
- **Tampilan visual belum dilihat langsung** — tool browser desktop tidak
  terhubung di sesi ini; verifikasi dilakukan lewat respons HTTP + HTML
  hasil SSR. Cek sekali dengan mata di browser (terutama layout admin di
  HP & desktop) sebelum demo klien.
- Upload gambar menyimpan file ke `public/` saat runtime — normal untuk
  `next dev`/`next start` lokal, tapi **tidak akan bertahan di serverless**
  (mis. Vercel); di luar scope demo lokal.
- **Catatan pengerjaan paralel:** sesi lain sempat me-restyle tampilan
  beberapa halaman customer & admin (± 17:06–17:18) dan menambah baris
  `# demo-outdoor` di README — perubahan itu tidak saya sentuh. Selama
  pengujian, 8 produk seed sempat terhapus (kemungkinan lewat uji klik CRUD
  di sesi itu) → dikembalikan lewat `npx prisma db seed`.
- **Isi database berubah dinamis** — sesi paralel (satu lagi) masih
  aktif menguji CRUD saat pengecekan terakhir: sisa 6 produk (5 produk
  seed sempat terhapus lagi), ada produk uji `carrier-eiger-60l-2`
  (bukti suffix slug anti-bentrok bekerja), dan 2 booking uji milik
  user. Untuk **mengembalikan ke state bersih** (10 produk + 5
  kategori, data yang ada tidak ditimpa), jalankan:
  `npx prisma db seed`. Booking uji milik saya sendiri sudah
  dibersihkan semua dan stok dikembalikan.

---

## 5. File & Folder Penting

```
tapak-outdoor-rental/
├── PROJECT_CONTEXT.md          ← file ini
├── README.md                   ← instruksi setup & catatan Prisma
├── .env / .env.example         ← DATABASE_URL + ADMIN_EMAIL/ADMIN_PASSWORD/
│                                  AUTH_SECRET/WHATSAPP_ADMIN_NUMBER (.env dibuat sesi ini)
├── prisma/
│   ├── schema.prisma            ← schema ASLI (User, Category, Product, Booking, BookingItem) — TIDAK berubah sejak Phase 2
│   ├── seed.ts                  ← seed data: 5 kategori + 10 produk (PERTAMA KALI bisa dijalankan, lihat Bagian 4e)
│   ├── dev.db                   ← database SQLite, migration + seed sudah diterapkan (isi terkini: 10 produk, 5 kategori, 1 booking demo)
│   └── migrations/
│       ├── migration_lock.toml
│       └── 20260922065742_init_schema/
│           └── migration.sql    ← dibuat manual (lihat Bagian 8)
├── app/
│   ├── layout.tsx               ← root layout, bungkus <CartProvider>
│   ├── globals.css              ← palet brand + token krem/kontur (di-restyle sesi paralel)
│   ├── (customer)/
│   │   ├── layout.tsx           ← bungkus Navbar + Footer
│   │   ├── page.tsx             ← homepage ASLI (Phase 4)
│   │   ├── catalog/page.tsx     ← katalog + search + filter ASLI (Phase 5)
│   │   ├── product/[slug]/page.tsx ← detail produk (Phase 6; sesi ini info stok dipindah ke bawah stepper)
│   │   ├── cart/page.tsx        ← keranjang ASLI (Phase 6)
│   │   └── booking/
│   │       ├── page.tsx         ← ASLI (Phase 7): form booking customer
│   │       └── success/page.tsx ← ASLI (Phase 7) + TOMBOL WA (Phase 8)
│   ├── admin/
│   │   ├── layout.tsx           ← shell/header untuk semua /admin
│   │   ├── login/page.tsx       ← ASLI (Phase 9): login admin
│   │   └── (panel)/             ← route group TERLINDUNGI login (URL tidak berubah)
│   │       ├── layout.tsx       ← cek session → redirect /admin/login + AdminNav (logout)
│   │       ├── dashboard/page.tsx    ← ASLI (Phase 10): kartu ringkasan + booking terbaru
│   │       ├── products/page.tsx     ← ASLI (Phase 10): CRUD produk + upload gambar
│   │       ├── categories/page.tsx   ← ASLI (Phase 10): CRUD kategori
│   │       └── bookings/
│   │           ├── page.tsx          ← ASLI (Phase 11): tabel semua booking
│   │           └── [id]/page.tsx     ← ASLI (Phase 11): detail + ubah status
│   └── api/
│       ├── auth/login/route.ts   ← BARU (Phase 9): POST login → set cookie session
│       ├── auth/logout/route.ts  ← BARU (Phase 9): POST logout → hapus cookie
│       ├── products/route.ts     ← BARU (Phase 10): GET list + POST (admin)
│       ├── products/[id]/route.ts← BARU (Phase 10): PATCH + DELETE (admin)
│       ├── categories/route.ts   ← BARU (Phase 10): GET list + POST (admin)
│       ├── categories/[id]/route.ts ← BARU (Phase 10): PATCH + DELETE (admin)
│       ├── bookings/route.ts     ← Phase 7: POST buat booking (customer saja, tak diubah)
│       ├── bookings/[id]/route.ts← BARU (Phase 11): PATCH status (admin)
│       └── upload/route.ts       ← BARU: upload gambar produk ke public/images/products/ (admin)
├── components/
│   ├── customer/Navbar.tsx      ← search, badge cart, menu mobile
│   ├── customer/Footer.tsx      ← statis
│   ├── customer/CategoryIcon.tsx    ← ikon SVG per kategori
│   ├── customer/ProductImage.tsx    ← gambar + fallback ilustrasi
│   ├── customer/ProductCard.tsx     ← kartu produk (katalog & homepage)
│   ├── customer/CatalogFilters.tsx  ← search box + tombol kategori
│   ├── customer/AddToCartForm.tsx   ← stepper + TOMBOL "Sewa Sekarang" + info stok di bawah (sesi ini)
│   ├── admin/AdminNav.tsx           ← BARU (Phase 9): nav panel + tombol logout
│   ├── admin/LoginForm.tsx          ← BARU (Phase 9): form login
│   ├── admin/StatusBadge.tsx        ← BARU (Phase 11): badge warna status booking
│   ├── admin/BookingTable.tsx       ← BARU (Phase 11): tabel booking (dashboard + list)
│   ├── admin/BookingStatusChanger.tsx ← BARU (Phase 11): tombol transisi status
│   ├── admin/ProductsManager.tsx    ← BARU (Phase 10): CRUD produk + upload gambar
│   ├── admin/CategoriesManager.tsx  ← BARU (Phase 10): CRUD kategori
│   └── ui/ComingSoon.tsx        ← sisa placeholder, tidak lagi dipakai route manapun
├── context/
│   └── CartContext.tsx          ← DIISI PENUH (Phase 6)
├── lib/
│   ├── prisma.ts                ← Prisma Client singleton
│   ├── catalog.ts               ← query Prisma untuk katalog (Phase 4-6)
│   ├── booking.ts               ← validasi, kalkulasi harga, transaksi booking (Phase 7; tipe tx diperbaiki)
│   ├── utils.ts                 ← formatRupiah() + formatTanggal() (ditambah sesi ini)
│   ├── auth.ts                  ← DIISI PENUH (Phase 9): session HMAC + verifikasi credential
│   ├── admin.ts                 ← BARU (Phase 10-11): stats, CRUD, ubah status booking
│   └── whatsapp.ts              ← BARU (Phase 8): nomor admin dari env + isi pesan + link wa.me
└── types/
    └── index.ts                 ← BookingStatus + label + BOOKING_STATUS_TRANSITIONS (Phase 2 & 11)
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

**Validasi runtime sudah aktif**: `POST /api/bookings` (Phase 7) menolak
nilai selain 5 ini, dan `PATCH /api/bookings/[id]` (Phase 11) selain
menolak nilai ngawur juga mengecek **peta transisi** di
`BOOKING_STATUS_TRANSITIONS` (`types/index.ts`):

```
PENDING   → CONFIRMED | CANCELLED
CONFIRMED → ONGOING | CANCELLED
ONGOING   → COMPLETED | CANCELLED
COMPLETED → (final)
CANCELLED → (final)
```

`updateBookingStatus` (`lib/admin.ts`) menjalankan cek + update di satu
transaksi Prisma, dan **mengembalikan stok produk saat booking
di-CANCELLED** (CANCELLED bersifat final → stok mustahil balik dua kali).

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
   *(Catatan: kendala ini **sudah teratasi** pada sesi Phase 8–11 —
   `prisma generate`, `validate`, maupun `db seed` kini berjalan normal;
   lihat update di Bagian 8.)*
10. **Auth admin tanpa library eksternal** — credential dari env
    (`ADMIN_EMAIL`/`ADMIN_PASSWORD`), session = cookie HttpOnly
    `tapak_admin_session` berisi payload yang ditandatangani
    HMAC-SHA256 (secret: `AUTH_SECRET`) via Web Crypto bawaan Node/Edge.
    Alasan: tidak menambah dependency, tidak perlu tabel session, dan
    tetap aman (HttpOnly + signature + expiry 7 hari). `lib/auth.ts`
    yang tadinya kerangka kosong diisi dengan pola ini, dan masih
    menyediakan fallback verifikasi ke tabel `User` (hash PBKDF2) kalau
    env credential tidak diisi.
11. **Proteksi route admin pakai route group `(panel)` + guard di tiap
    API handler** — `app/admin/(panel)/layout.tsx` me-redirect ke
    `/admin/login` kalau session tidak valid (URL panel tetap
    `/admin/...` karena group tidak ikut di path), dan setiap route
    handler tulis admin memanggil `getAdminSession()` → 401. Dua lapis
    ini lebih tangguh daripada mengandalkan redirect layout saja.
12. **Slug produk/kategori dibuat saat create dan TIDAK diubah saat
    edit** — supaya link `/product/<slug>` yang sudah dibagikan tidak
    pecah saat admin memperbaiki nama/deskripsi. Bentrok saat create
    ditangani dengan suffix unik (`-2`, `-3`, ...).
13. **Upload gambar menyimpan file ke `public/images/products/` lewat
    `fs/promises` (route `/api/upload`)** — tanpa dependency baru;
    nama file di-slugify + suffix unik (anti path traversal), tipe
    dibatasi ke JPG/PNG/WebP/GIF & maks 2 MB. Ini cocok untuk demo
    lokal/`next start`, tapi **tidak cocok untuk serverless** (file
    hilang saat container restart) — trade-off yang disadari dan
    diterima untuk scope demo ini.
14. **Cancel booking = restok + status final dalam satu transaksi**
    (`updateBookingStatus` di `lib/admin.ts`) — stok dikembalikan hanya
    saat transisi ke `CANCELLED`, dan karena `CANCELLED`/`COMPLETED`
    bersifat final (dicek `BOOKING_STATUS_TRANSITIONS`), stok tidak
    mungkin dipulihkan dua kali walau request diulang.
15. **Tombol "Sewa Sekarang" tetap menulis ke `CartContext`** sebelum
    langsung menuju `/booking` — form booking dibangun dari cart, jadi
    alur "tanpa keranjang" diwujudkan sebagai langkah tunggal (tambah +
    pindah halaman), bukan membangun state booking terpisah. Dari sudut
    pandang pengguna: satu klik dari halaman produk langsung ke form
    booking, tanpa mampir halaman keranjang.

---

## 8. Masalah / Error yang Belum Selesai

> **UPDATE (sesi Phase 8–11): SEMUA kendala di bawah ini SUDAH
> TERATASI.** Setelah `npm install` sukses dijalankan (registry mirror),
> `@prisma/client` ter-generate otomatis lewat `postinstall`, lalu
> `npx prisma generate`, `npx prisma validate`, dan bahkan
> `npx prisma db seed` **semuanya berjalan normal** (engine binary
> ikut terunduh). `npx tsc --noEmit` → 0 error, `npx eslint` → 0 error,
> `npx next build` → sukses penuh 21 route, plus ± 33 skenario uji
> end-to-end via HTTP lulus semua (rincian di **Bagian 4e**).
> Isi di bawah dipertahankan sebagai **arsip riwayat masalah** sesi
> awal.

⚠️ **PENTING — baca ini sebelum lanjut:** *(arsip, lihat update di atas)*

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

**Status: seluruh fitur inti (Phase 1–11) sudah selesai ditulis dan
sudah diverifikasi otomatis** — `tsc` 0 error, `eslint` 0 error,
`prisma validate/generate/db seed` jalan, `next build` sukses penuh, dan
± 33 skenario uji end-to-end via HTTP lulus semua (rincian di Bagian
4e). Sisa langkah tinggal verifikasi visual + persiapan demo.

### Wajib — cek manual di browser (belum bisa dilakukan dari sesi AI)
```bash
npm install     # kalau belum (sudah dilakukan; postinstall generate Prisma Client otomatis)
npm run dev     # buka http://localhost:3000
```
Lalu cek manual di browser:
- `/` — homepage, kategori & produk unggulan muncul
- `/catalog` — 10 produk seed muncul; coba search "tenda", filter
  kategori "Carrier", dan kombinasi keduanya sekaligus
- `/product/tenda-dome-konsina-4-orang` (atau slug produk lain) —
  pastikan stepper quantity dibatasi sisa stok, info **"Tersedia N
  unit" berada DI BAWAH pemilih jumlah** (layout ala online shop), dan
  ada 3 tombol: **Tambah ke Keranjang**, **Sewa Sekarang** (langsung
  lompat ke `/booking` tanpa mampir halaman keranjang), Buka Keranjang
- `/cart` — item yang ditambahkan muncul, coba ubah quantity/hapus,
  reload halaman untuk pastikan keranjang tidak hilang (localStorage)
- `/booking` — isi nama, WhatsApp, tanggal mulai/selesai, catatan,
  pastikan total harga di preview berubah sesuai jumlah hari, submit,
  lalu pastikan redirect ke `/booking/success?id=...` dan datanya cocok.
  Cek juga: keranjang kosong (harus diarahkan ke katalog), quantity
  melebihi stok (harus ditolak dengan pesan error server), dan buka
  ulang link `/booking/success?id=...` walau keranjang sudah kosong.
  Dari halaman ringkasan ini, tes **tombol "Kirim ke WhatsApp Admin"**:
  pastikan `WHATSAPP_ADMIN_NUMBER` terisi di `.env`, lalu cek pesan
  `wa.me` berisi nama, nomor WA, produk+jumlah, tanggal, durasi, total
- **Login admin**: `http://localhost:3000/admin/login` —
  `admin@tapak.local` / `admin12345` (sesuaikan via env
  `ADMIN_EMAIL` / `ADMIN_PASSWORD`):
  - `/admin/dashboard` — 4 kartu ringkasan (produk, kategori, booking,
    pending) + tabel booking terbaru
  - `/admin/products` — tambah produk: coba **upload gambar** (file
    masuk ke `public/images/products/`, preview tampil, simpan → muncul
    di katalog), edit harga/stok, hapus (produk yang pernah dibooking
    harus ditolak dengan pesan jelas)
  - `/admin/categories` — tambah/edit/hapus kategori (yang masih
    berisi produk harus ditolak)
  - `/admin/bookings` — buka detail booking, ubah status PENDING →
    CONFIRMED → ONGOING → COMPLETED, dan tes tombol Batalkan (cek stok
    produk kembali setelah cancel)
  - **Logout** di nav admin, lalu akses ulang `/admin/dashboard`
    (harus redirect ke login)
- Cek tampilan di lebar layar HP (~375px) dan desktop — **bagian ini
  belum terverifikasi otomatis** (tool browser tidak terhubung di sesi
  AI; lihat catatan jujur Bagian 4e)

Kalau ada error runtime, beri tahu pesan errornya persis di sesi
berikutnya.

**Opsional / ide lanjutan:**
- Ganti kredensial demo, dan isi foto produk asli — bisa lewat
  **upload gambar bawaan panel admin** (lebih praktis), atau taruh file
  manual di `public/images/products/` sesuai nama di `prisma/seed.ts`
- Tambahkan data booking dummy jumlah banyak lewat **Phase 3**
  (opsional — jalur booking asli sudah ada sejak Phase 7, dan kini
  sudah ada 1 booking demo di database)
- Bila kelak deploy ke serverless (mis. Vercel): ganti penyimpanan
  upload gambar ke object storage (lihat keputusan #13) — di luar scope
  demo lokal ini.
