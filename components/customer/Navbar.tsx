"use client";

/**
 * Navbar modern untuk halaman customer.
 *
 * Dilengkapi logo brand TAPAK dengan visual gunung & jalur, search bar
 * terintegrasi ikon, badge keranjang interaktif, dan menu mobile yang bersih.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalQuantity } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/catalog?q=${encodeURIComponent(trimmed)}` : "/catalog");
    setMenuOpen(false);
  }

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setMenuOpen(false)}
        className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          active
            ? "bg-brand-primary text-white shadow-xs"
            : "text-foreground-muted hover:text-brand-primary hover:bg-brand-primary/10"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3.5 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 shrink-0 transition-transform active:scale-95"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary text-white shadow-xs transition-colors group-hover:bg-brand-primary-dark">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Mountain peak */}
              <path d="M3 20 L10 7 L15 15 L18 10 L22 20 Z" />
              <path d="M8 20 L10 16 L12 20" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl leading-none text-brand-primary font-black tracking-tight">
              TAPAK<span className="text-brand-accent">.</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest uppercase text-foreground-muted">
              Outdoor Rental
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 text-sm sm:flex ml-2">
          {navLink("/", "Beranda")}
          {navLink("/catalog", "Katalog")}
        </nav>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 max-w-md items-center sm:flex ml-auto mr-2"
          role="search"
        >
          <label htmlFor="navbar-search" className="sr-only">
            Cari peralatan
          </label>
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-foreground-muted">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="navbar-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari tenda, carrier, kompor..."
              className="w-full rounded-full border border-border-subtle bg-surface-alt/70 pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-foreground-muted transition-all focus:border-brand-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
        </form>

        {/* Cart Button */}
        <Link
          href="/cart"
          className="ml-auto sm:ml-0 flex shrink-0 items-center gap-2 rounded-full border border-border-subtle bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground transition-all hover:border-brand-primary/50 hover:bg-surface-alt active:scale-95 shadow-2xs"
        >
          <svg
            className="h-4 w-4 text-brand-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span className="hidden sm:inline font-semibold">Keranjang</span>
          {totalQuantity > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent px-1.5 text-xs font-bold text-white shadow-xs animate-bounce">
              {totalQuantity}
            </span>
          ) : (
            <span className="hidden sm:inline text-xs text-foreground-muted">0</span>
          )}
        </Link>

        {/* Mobile menu hamburger toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-surface text-foreground transition-colors hover:bg-surface-alt sm:hidden"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="border-t border-border-subtle bg-surface px-4 py-4 sm:hidden animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="mb-4 flex relative" role="search">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-foreground-muted">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="navbar-search-mobile"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari tenda, carrier, matras..."
              className="w-full rounded-full border border-border-subtle bg-surface-alt pl-9 pr-4 py-2 text-sm text-foreground focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </form>
          <nav className="flex flex-col gap-1.5 text-sm">
            {navLink("/", "Beranda")}
            {navLink("/catalog", "Katalog Peralatan")}
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-foreground-muted hover:bg-brand-primary/10 hover:text-brand-primary font-medium"
            >
              <span>Keranjang Rental</span>
              {totalQuantity > 0 && (
                <span className="rounded-full bg-brand-accent px-2 py-0.5 text-xs font-bold text-white">
                  {totalQuantity} item
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
