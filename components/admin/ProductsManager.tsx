"use client";

/**
 * Kelola Produk (Phase 10): daftar + form tambah/ubah + hapus.
 *
 * Client Component karena semua aksi butuh fetch ke API admin
 * (/api/products, /api/products/[id], /api/upload) lalu
 * `router.refresh()` supaya data terbaru tampil tanpa reload penuh.
 * Query datanya sendiri tetap di server (halaman products adalah
 * Server Component) — komponen ini menerima hasil query lewat props.
 *
 * GAMBAR: upload file (bukan ketik path) — file dikirim ke
 * POST /api/upload saat tombol Simpan ditekan, lalu URL hasil upload
 * (`/images/products/...`) dipakai sebagai nilai `Product.image`.
 * Sebelum tersimpan, user melihat preview lokal (object URL) sehingga
 * tidak ada file sampah tertinggal kalau form dibatalkan.
 */

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/utils";
import ProductImage from "@/components/customer/ProductImage";
import type { CategorySummary, ProductWithCategory } from "@/lib/catalog";

type Props = {
  products: ProductWithCategory[];
  categories: CategorySummary[];
};

type FormState = {
  name: string;
  description: string;
  pricePerDay: string;
  stock: string;
  categoryId: string;
  image: string;
};

const inputClass =
  "mt-1 w-full rounded-sm border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-brand-primary";

const fileInputClass =
  "mt-1 block w-full text-sm text-foreground-muted file:mr-3 file:cursor-pointer file:rounded-sm file:border-0 file:bg-brand-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-primary";

function emptyForm(categoryId: string): FormState {
  return {
    name: "",
    description: "",
    pricePerDay: "",
    stock: "",
    categoryId,
    image: "",
  };
}

export default function ProductsManager({ products, categories }: Props) {
  const router = useRouter();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(() =>
    emptyForm(categories[0]?.id ?? "")
  );
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /** Bersihkan file terpilih + object URL preview-nya. */
  function clearSelectedFile() {
    setPreviewUrl((oldUrl) => {
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      return null;
    });
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setPreviewUrl((oldUrl) => {
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      if (!selected) return null;
      return URL.createObjectURL(selected);
    });
    setFile(selected);
    setError(null);
  }

  function openCreate() {
    setEditingId(null);
    clearSelectedFile();
    setForm(emptyForm(categories[0]?.id ?? ""));
    setError(null);
    setFormOpen(true);
  }

  function openEdit(product: ProductWithCategory) {
    setEditingId(product.id);
    clearSelectedFile();
    setForm({
      name: product.name,
      description: product.description,
      pricePerDay: String(product.pricePerDay),
      stock: String(product.stock),
      categoryId: product.categoryId,
      image: product.image ?? "",
    });
    setError(null);
    setFormOpen(true);
  }

  function cancelForm() {
    clearSelectedFile();
    setFormOpen(false);
    setEditingId(null);
    setError(null);
  }

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const pricePerDay = Number(form.pricePerDay);
    const stock = Number(form.stock);

    if (!Number.isInteger(pricePerDay) || pricePerDay <= 0) {
      setError("Harga per hari harus berupa angka lebih dari 0.");
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stok harus berupa angka 0 atau lebih.");
      return;
    }

    setSaving(true);

    // Kalau ada file baru dipilih, upload dulu → dapat URL publiknya.
    let imageUrl = form.image;
    if (file) {
      try {
        const uploadBody = new FormData();
        uploadBody.append("image", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadBody,
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.ok) {
          setError(uploadData.error ?? "Gagal mengupload gambar. Coba lagi.");
          setSaving(false);
          return;
        }
        imageUrl = uploadData.url;
      } catch {
        setError(
          "Tidak bisa mengupload gambar. Periksa koneksi dan coba lagi."
        );
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch(
        editingId ? `/api/products/${editingId}` : "/api/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            pricePerDay,
            stock,
            categoryId: form.categoryId,
            image: imageUrl,
          }),
        }
      );
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Gagal menyimpan produk. Coba lagi.");
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

  async function handleDelete(product: ProductWithCategory) {
    const confirmed = window.confirm(
      `Hapus produk "${product.name}"? Tindakan ini tidak bisa dibatalkan.`
    );
    if (!confirmed) return;

    setError(null);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Gagal menghapus produk. Coba lagi.");
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={openCreate}
            disabled={categories.length === 0}
            className="rounded-sm bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            + Tambah Produk
          </button>
          {categories.length === 0 && (
            <p className="text-xs text-foreground-muted">
              Buat minimal satu kategori dulu sebelum menambah produk.
            </p>
          )}
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-md border border-border-subtle bg-surface p-5"
        >
          <h2 className="font-medium text-foreground">
            {editingId ? "Ubah Produk" : "Tambah Produk"}
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="product-name" className="text-sm font-medium text-foreground">
                Nama Produk
              </label>
              <input
                id="product-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Tenda Dome 4 Orang"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="product-description"
                className="text-sm font-medium text-foreground"
              >
                Deskripsi
              </label>
              <textarea
                id="product-description"
                rows={3}
                required
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Deskripsi singkat produk..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label
                htmlFor="product-price"
                className="text-sm font-medium text-foreground"
              >
                Harga per Hari (Rp)
              </label>
              <input
                id="product-price"
                type="number"
                min={1}
                step={1}
                required
                value={form.pricePerDay}
                onChange={(e) => set("pricePerDay", e.target.value)}
                placeholder="35000"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="product-stock" className="text-sm font-medium text-foreground">
                Stok
              </label>
              <input
                id="product-stock"
                type="number"
                min={0}
                step={1}
                required
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="5"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="product-category"
                className="text-sm font-medium text-foreground"
              >
                Kategori
              </label>
              <select
                id="product-category"
                required
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className={inputClass}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="product-image"
                className="text-sm font-medium text-foreground"
              >
                Gambar Produk
              </label>
              <input
                id="product-image"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className={fileInputClass}
              />
              <p className="mt-1 text-xs text-foreground-muted">
                JPG / PNG / WebP / GIF, maks. 2 MB — pilih file, tidak perlu
                ketik path.
              </p>
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-border-subtle">
                <ProductImage
                  src={previewUrl ?? (form.image || null)}
                  alt="Preview gambar produk"
                  categorySlug=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-xs text-foreground-muted">
                {file ? (
                  <>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p>File baru — diupload saat kamu menekan Simpan.</p>
                    <button
                      type="button"
                      onClick={() => clearSelectedFile()}
                      className="mt-1 font-medium text-brand-accent-dark hover:underline"
                    >
                      Batalkan file ini
                    </button>
                  </>
                ) : form.image ? (
                  <>
                    <p className="font-mono break-all">{form.image}</p>
                    <button
                      type="button"
                      onClick={() => set("image", "")}
                      className="mt-1 font-medium text-red-600 hover:underline"
                    >
                      Hapus gambar
                    </button>
                  </>
                ) : (
                  <p>Belum ada gambar — akan memakai ilustrasi bawaan.</p>
                )}
              </div>
            </div>
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
        {products.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="font-medium text-foreground">Belum ada produk</p>
            <p className="mt-1 text-sm text-foreground-muted">
              Tambahkan produk pertama lewat tombol di atas.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-xs uppercase tracking-wide text-foreground-muted">
                <th className="px-4 py-3 font-medium">Produk</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Harga / hari</th>
                <th className="px-4 py-3 font-medium">Stok</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border-subtle last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-sm">
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          categorySlug={product.category.slug}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-foreground">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    {product.category.name}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {formatRupiah(product.pricePerDay)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        product.stock > 0
                          ? "bg-brand-primary/10 text-brand-primary"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        className="text-sm font-medium text-brand-primary hover:underline"
                      >
                        Ubah
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
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
