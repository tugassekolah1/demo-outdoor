/**
 * Prisma Seed Script — TAPAK Outdoor Rental
 *
 * Mengisi database dengan data contoh: kategori dan produk rental
 * outdoor, supaya ada data nyata untuk ditampilkan saat demo/testing
 * di Phase berikutnya (Katalog, Detail Produk, dll).
 *
 * Cara menjalankan:
 *   npx prisma db seed
 * (atau otomatis terpanggil setelah `npx prisma migrate reset`)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Mulai seeding...");

  // ------------------------------------------------------------
  // 1. Kategori
  // ------------------------------------------------------------
  const categories = [
    { name: "Tenda", slug: "tenda" },
    { name: "Carrier", slug: "carrier" },
    { name: "Sleeping Bag", slug: "sleeping-bag" },
    { name: "Matras", slug: "matras" },
    { name: "Kompor Portable", slug: "kompor-portable" },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
    console.log(`Kategori siap: ${created.name}`);
  }

  // ------------------------------------------------------------
  // 2. Produk
  // ------------------------------------------------------------
  const products = [
    // Tenda
    {
      name: "Tenda Dome Konsina 4 Orang",
      slug: "tenda-dome-konsina-4-orang",
      description:
        "Tenda dome kapasitas 4 orang, cocok untuk pendakian keluarga atau kelompok kecil. Tahan air dan mudah dipasang.",
      pricePerDay: 35000,
      stock: 8,
      image: "/images/products/tenda-dome-4-orang.jpg",
      categorySlug: "tenda",
    },
    {
      name: "Tenda Ultralight 2 Orang",
      slug: "tenda-ultralight-2-orang",
      description:
        "Tenda ringan untuk 2 orang, ideal untuk pendaki solo atau berpasangan yang mengutamakan bobot ringan.",
      pricePerDay: 45000,
      stock: 5,
      image: "/images/products/tenda-ultralight-2-orang.jpg",
      categorySlug: "tenda",
    },
    // Carrier
    {
      name: "Carrier Eiger 60L",
      slug: "carrier-eiger-60l",
      description:
        "Tas carrier kapasitas 60 liter, dilengkapi rain cover dan banyak kompartemen untuk pendakian multi-hari.",
      pricePerDay: 25000,
      stock: 10,
      image: "/images/products/carrier-eiger-60l.jpg",
      categorySlug: "carrier",
    },
    {
      name: "Carrier Consina 80L",
      slug: "carrier-consina-80l",
      description:
        "Carrier besar 80 liter untuk perjalanan panjang atau membawa perlengkapan kelompok.",
      pricePerDay: 30000,
      stock: 6,
      image: "/images/products/carrier-consina-80l.jpg",
      categorySlug: "carrier",
    },
    // Sleeping Bag
    {
      name: "Sleeping Bag Eiger Standar",
      slug: "sleeping-bag-eiger-standar",
      description:
        "Sleeping bag dengan bahan polar, nyaman untuk suhu pegunungan tropis Indonesia.",
      pricePerDay: 15000,
      stock: 15,
      image: "/images/products/sleeping-bag-eiger.jpg",
      categorySlug: "sleeping-bag",
    },
    {
      name: "Sleeping Bag Dacron Tebal",
      slug: "sleeping-bag-dacron-tebal",
      description:
        "Sleeping bag berbahan dacron tebal, cocok untuk gunung dengan suhu lebih dingin.",
      pricePerDay: 18000,
      stock: 10,
      image: "/images/products/sleeping-bag-dacron.jpg",
      categorySlug: "sleeping-bag",
    },
    // Matras
    {
      name: "Matras Lipat Standar",
      slug: "matras-lipat-standar",
      description:
        "Matras lipat ringan sebagai alas tidur, mudah dibawa dan disimpan di carrier.",
      pricePerDay: 8000,
      stock: 20,
      image: "/images/products/matras-lipat.jpg",
      categorySlug: "matras",
    },
    {
      name: "Matras Angin (Inflatable)",
      slug: "matras-angin-inflatable",
      description:
        "Matras angin yang lebih empuk dan nyaman, mengempis untuk memudahkan packing.",
      pricePerDay: 20000,
      stock: 7,
      image: "/images/products/matras-angin.jpg",
      categorySlug: "matras",
    },
    // Kompor Portable
    {
      name: "Kompor Portable + Gas Kaleng",
      slug: "kompor-portable-gas-kaleng",
      description:
        "Kompor portable ringkas untuk memasak di lokasi camping, menggunakan gas kaleng.",
      pricePerDay: 12000,
      stock: 12,
      image: "/images/products/kompor-portable.jpg",
      categorySlug: "kompor-portable",
    },
    {
      name: "Kompor Trangia Set",
      slug: "kompor-trangia-set",
      description:
        "Kompor spiritus set lengkap dengan panci dan wajan kecil, cocok untuk mendaki jarak jauh.",
      pricePerDay: 22000,
      stock: 4,
      image: "/images/products/kompor-trangia-set.jpg",
      categorySlug: "kompor-portable",
    },
  ];

  for (const product of products) {
    const { categorySlug, ...productData } = product;
    const created = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        categoryId: categoryMap[categorySlug],
      },
    });
    console.log(`Produk siap: ${created.name}`);
  }

  console.log("Seeding selesai.");
}

main()
  .catch((e) => {
    console.error("Seeding gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
