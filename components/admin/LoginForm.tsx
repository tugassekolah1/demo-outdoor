"use client";

/**
 * Form login admin (Phase 9).
 *
 * Client Component karena butuh state input + fetch ke
 * POST /api/auth/login; kalau sukses, redirect ke /admin/dashboard
 * (router.refresh() dipanggil supaya Server Component layout admin
 * membaca cookie session yang baru).
 */

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-border-subtle bg-surface-alt/50 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted transition-all focus:border-brand-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Login gagal. Coba lagi.");
        setSubmitting(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server. Periksa koneksi dan coba lagi.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="admin-email" className="block text-xs font-bold uppercase tracking-wider text-foreground">
          Email Admin
        </label>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@tapak.local"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="block text-xs font-bold uppercase tracking-wider text-foreground"
        >
          Kata Sandi
        </label>
        <input
          id="admin-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      {error && (
        <div className="rounded-xl border border-brand-accent/40 bg-brand-accent/10 p-3 text-xs font-semibold text-brand-accent-dark">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-center text-sm font-bold text-white shadow-md transition-all hover:bg-brand-primary-dark hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Memeriksa Akun...</span>
          </>
        ) : (
          <span>Masuk ke Dashboard</span>
        )}
      </button>
    </form>
  );
}
