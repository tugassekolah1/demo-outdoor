/**
 * Layout route group `(panel)` — PHASE 9: PROTEKSI ROUTE ADMIN.
 *
 * Semua halaman panel admin (dashboard, produk, kategori, booking)
 * berada di bawah group ini. Tiap request halaman dicek session-nya:
 * kalau tidak ada / tidak valid → redirect ke `/admin/login`.
 *
 * Route group hanya memengaruhi struktur folder, BUKAN URL — jadi
 * halaman tetap di `/admin/dashboard`, `/admin/products`, dst.
 */

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </>
  );
}
