"use client";

/**
 * Gambar produk dengan fallback visual bertema outdoor.
 *
 * Jika file gambar asli belum tersedia atau gagal dimuat,
 * komponen ini merender ilustrasi perlengkapan outdoor bergaya
 * modern dengan gradasi latar, topografi, dan badge kategori.
 */

import { useState } from "react";
import CategoryIcon from "./CategoryIcon";

type ThemeConfig = {
  bgGradient: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  label: string;
};

const THEMES: Record<string, ThemeConfig> = {
  tenda: {
    bgGradient: "from-emerald-950/10 via-green-900/5 to-stone-900/10",
    iconColor: "text-emerald-700",
    badgeBg: "bg-emerald-700/10 border-emerald-700/20",
    badgeText: "text-emerald-800",
    label: "Tenda Gunung",
  },
  carrier: {
    bgGradient: "from-amber-950/10 via-stone-800/5 to-orange-950/10",
    iconColor: "text-amber-800",
    badgeBg: "bg-amber-700/10 border-amber-700/20",
    badgeText: "text-amber-900",
    label: "Trekking Pack",
  },
  "sleeping-bag": {
    bgGradient: "from-sky-950/10 via-indigo-900/5 to-slate-900/10",
    iconColor: "text-indigo-800",
    badgeBg: "bg-indigo-700/10 border-indigo-700/20",
    badgeText: "text-indigo-900",
    label: "Sleeping Bag",
  },
  matras: {
    bgGradient: "from-lime-950/10 via-stone-800/5 to-emerald-950/10",
    iconColor: "text-green-800",
    badgeBg: "bg-green-700/10 border-green-700/20",
    badgeText: "text-green-900",
    label: "Matras Camping",
  },
  "kompor-portable": {
    bgGradient: "from-orange-950/10 via-amber-900/5 to-stone-900/10",
    iconColor: "text-orange-700",
    badgeBg: "bg-orange-700/10 border-orange-700/20",
    badgeText: "text-orange-800",
    label: "Alat Masak",
  },
};

const DEFAULT_THEME: ThemeConfig = {
  bgGradient: "from-stone-900/10 via-emerald-950/5 to-stone-900/10",
  iconColor: "text-brand-primary",
  badgeBg: "bg-brand-primary/10 border-brand-primary/20",
  badgeText: "text-brand-primary",
  label: "Peralatan",
};

export default function ProductImage({
  src,
  alt,
  categorySlug,
  className = "",
}: {
  src: string | null;
  alt: string;
  categorySlug: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    const theme = THEMES[categorySlug] ?? DEFAULT_THEME;

    return (
      <div
        className={`contour-bg relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${theme.bgGradient} ${className}`}
      >
        {/* Soft radial glow */}
        <div className="absolute inset-0 bg-radial from-white/40 via-transparent to-transparent pointer-events-none" />

        {/* Dynamic Category Illustration */}
        <div className="relative z-10 flex flex-col items-center transition-transform duration-300 group-hover:scale-110">
          <CategoryIcon
            categorySlug={categorySlug}
            className={`h-20 w-20 drop-shadow-sm sm:h-24 sm:w-24 ${theme.iconColor}`}
          />
        </div>

        {/* Small bottom brand tag */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide backdrop-blur-xs ${theme.badgeBg} ${theme.badgeText}`}
          >
            {theme.label}
          </span>
        </div>

        {/* Subtle mountain ridge silhouette at the bottom */}
        <svg
          className="absolute -bottom-1 inset-x-0 w-full text-foreground/5 pointer-events-none"
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,40 L0,22 L35,12 L70,28 L115,8 L160,25 L200,15 L200,40 Z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
