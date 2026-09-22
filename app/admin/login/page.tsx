import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-md">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3 20 L10 7 L15 15 L18 10 L22 20 Z" />
          </svg>
        </div>
        <h1 className="font-display mt-4 text-2xl sm:text-3xl font-bold text-foreground">
          Masuk Admin TAPAK
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-foreground-muted">
          Kelola stok peralatan outdoor, kategori, dan konfirmasi booking.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-border-subtle bg-surface p-6 sm:p-8 shadow-sm">
        <LoginForm />

        <div className="mt-6 border-t border-border-subtle/80 pt-4 text-center">
          <p className="text-[11px] text-foreground-muted">
            Kredensial demo bawaan:
          </p>
          <div className="mt-1.5 inline-flex items-center gap-2 rounded-lg bg-surface-alt px-3 py-1.5 font-mono text-xs text-brand-primary border border-border-subtle">
            <span>admin@tapak.local</span>
            <span className="text-border-subtle">|</span>
            <span>admin123</span>
          </div>
        </div>
      </div>
    </main>
  );
}
