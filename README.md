# TAPAK Outdoor Rental — Demo Website

Demo website full-stack untuk bisnis rental peralatan outdoor. Dibuat sebagai
project demo untuk ditunjukkan ke calon klien.

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Prisma ORM** + **SQLite** (database development)

## Cara Menjalankan di Lokal

1. Install dependencies:

   ```bash
   npm install
   ```

2. Salin file environment:

   ```bash
   cp .env.example .env
   ```

3. Generate Prisma Client (lihat catatan penting di bawah):

   ```bash
   npx prisma generate
   ```

4. Jalankan development server:

   ```bash
   npm run dev
   ```

5. Buka [http://localhost:3000](http://localhost:3000)

> **Catatan tentang `prisma generate`:** perintah ini mengunduh "engine"
> Prisma dari `binaries.prisma.sh`. Di lingkungan sandbox Claude (tempat
> project ini pertama kali dibuat), domain tersebut tidak bisa diakses
> karena pembatasan jaringan sandbox — jadi `prisma generate` **belum
> pernah berhasil dijalankan di sana**, dan `@prisma/client` belum
> ter-generate di dalam sandbox. Ini bukan masalah pada kode project.
> Di komputer/laptop kamu sendiri (dengan akses internet normal),
> perintah ini seharusnya berjalan normal. Jika nanti kamu menjalankan
> `npm install` dan mendapati error terkait Prisma Client saat
> `npm run dev` atau `npm run build`, jalankan `npx prisma generate`
> secara manual terlebih dahulu.

## Struktur Folder

Lihat `PROJECT_CONTEXT.md` untuk detail lengkap struktur, keputusan
teknis, dan progres setiap phase pengerjaan.
# demo-outdoor
