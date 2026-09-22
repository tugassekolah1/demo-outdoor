import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client singleton.
 *
 * Kenapa perlu ini? Di mode development, Next.js melakukan hot-reload
 * setiap kali file berubah. Tanpa pola singleton ini, setiap reload akan
 * membuat instance PrismaClient baru dan lama-lama membuat terlalu banyak
 * koneksi ke database. Pola ini menyimpan instance di variabel global
 * supaya dipakai ulang selama development.
 */
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma = globalThis.prismaGlobal ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
