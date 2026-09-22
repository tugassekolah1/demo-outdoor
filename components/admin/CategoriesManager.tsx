"use client";

/**
 * Kelola Kategori (Phase 10): daftar + form tambah/ubah + hapus.
 * Pola yang sama dengan ProductsManager — fetch ke /api/categories
 * lalu router.refresh(). Slug dibuat otomatis dari nama di server,
 * jadi form-nya hanya berisi nama.
 */

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { CategoryWithCount } from "@/lib/catalog";

type Props = {
  categories: CategoryWithCount[];
};

const inputClass =
  "mt-1 w-full rounded-sm border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-brand-primary";

export default function CategoriesManager({ categories }: Props) {
  const router = useRouter();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditingId(null);
    setName("");
    setError(null);
    setFormOpen(true);
  }

  function openEdit(category: CategoryWithCount) {
    setEditingId(category.id);
    setName(category.name);
    setError(null);
    setFormOpen(true);
  }

  function cancelForm() {
    setFormOpen(false);
    setEditingId(null);
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch(
        editingId ? `/api/categories/${editingId}` : "/api/categories",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Gagal menyimpan kategori. Coba lagi.");
        setSaving(false);
        return;
      }

      setSaving(false);
      cancelForm();
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server. Periksa koneksi dan coba lagi.");
      setSaving(false);
    }
  }

  async function handleDelete(category: CategoryWithCount) {
    const confirmed = window.confirm(
      `Hapus kategori "${category.name}"?`
    );
    if (!confirmed) return;

    setError(null);
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Gagal menghapus kategori. Coba lagi.");
        return;
      }
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server. Periksa koneksi dan coba lagi.");
    }
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-sm border border-brand-accent/40 bg-brand-accent/5 px-3 py-2 text-sm text-brand-accent-dark">
          {error}
        </p>
      )}

      {!formOpen && (
        <button
          type="button"
          onClick={openCreate}
          className="rounded-sm bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark"
        >
          + Tambah Kategori
        </button>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-md border border-border-subtle bg-surface p-5"
        >
          <h2 className="font-medium text-foreground">
            {editingId ? "Ubah Kategori" : "Tambah Kategori"}
          </h2>

          <div className="mt-4 max-w-md">
            <label htmlFor="category-name" className="text-sm font-medium text-foreground">
              Nama Kategori
            </label>
            <input
              id="category-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tenda"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-foreground-muted">
              Slug dibuat otomatis dari nama (contoh: &quot;Kompor Portable&quot; →
              kompor-portable).
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-sm bg-brand-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-sm border border-border-subtle px-5 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-primary"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-md border border-border-subtle bg-surface">
        {categories.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="font-medium text-foreground">Belum ada kategori</p>
            <p className="mt-1 text-sm text-foreground-muted">
              Tambahkan kategori pertama lewat tombol di atas.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-xs uppercase tracking-wide text-foreground-muted">
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Jumlah Produk</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-border-subtle last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {category.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground-muted">
                    {category.slug}
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    {category._count.products} produk
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(category)}
                        className="text-sm font-medium text-brand-primary hover:underline"
                      >
                        Ubah
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
