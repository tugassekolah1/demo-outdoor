/**
 * Ikon outdoor modern dengan aksen dual-tone untuk tiap kategori produk.
 * Digunakan di homepage, filter katalog, kartu produk, dan navigasi.
 */

type IconProps = {
  className?: string;
};

function TentIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* Background fill */}
      <polygon points="32,10 6,52 58,52" fill="currentColor" fillOpacity="0.12" />
      <polygon points="32,24 16,52 48,52" fill="currentColor" fillOpacity="0.18" />
      {/* Outer frame */}
      <path d="M6 52 L32 10 L58 52" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Inner flap / entrance */}
      <path d="M18 52 L32 26 L46 52" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      {/* Ground baseline & pegs */}
      <path d="M3 52 H61" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
      <path d="M6 52 L3 56 M58 52 L61 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Center pole seam */}
      <path d="M32 10 V26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Vent cap */}
      <path d="M26 18 Q32 14 38 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CarrierIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* Main pack body fill */}
      <rect x="18" y="16" width="28" height="40" rx="7" fill="currentColor" fillOpacity="0.12" />
      <rect x="20" y="10" width="24" height="10" rx="4" fill="currentColor" fillOpacity="0.22" />
      {/* Pack outline */}
      <rect x="18" y="16" width="28" height="40" rx="7" stroke="currentColor" strokeWidth="2.75" />
      {/* Top lid */}
      <rect x="20" y="10" width="24" height="10" rx="4" stroke="currentColor" strokeWidth="2.5" />
      {/* Compression straps */}
      <path d="M18 28 H46" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18 38 H46" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Buckles */}
      <rect x="28" y="26" width="8" height="4" rx="1.5" fill="currentColor" />
      <rect x="28" y="36" width="8" height="4" rx="1.5" fill="currentColor" />
      {/* Side mesh pockets */}
      <path d="M14 26 C11 34 11 42 14 48" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M50 26 C53 34 53 42 50 48" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Haul loop */}
      <path d="M27 10 V6 C27 4.5 29 4 32 4 C35 4 37 4.5 37 6 V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SleepingBagIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* Sleeping bag contour fill */}
      <path
        d="M20 12 C20 7 44 7 44 12 V38 C44 48 38 56 32 56 C26 56 20 48 20 38 Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      {/* Main outline */}
      <path
        d="M20 14 C20 8 44 8 44 14 V40 C44 49 38 56 32 56 C26 56 20 49 20 40 Z"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      {/* Hood & face opening */}
      <ellipse cx="32" cy="18" rx="7" ry="6" stroke="currentColor" strokeWidth="2.25" fill="currentColor" fillOpacity="0.18" />
      {/* Quilt baffle lines */}
      <path d="M21 28 Q32 31 43 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 36 Q32 39 42 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 44 Q32 47 40 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Zipper line */}
      <path d="M32 24 V32" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" strokeLinecap="round" />
    </svg>
  );
}

function MatrasIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* Rolled mat body fill */}
      <rect x="10" y="22" width="44" height="22" rx="6" fill="currentColor" fillOpacity="0.12" />
      {/* Outer body */}
      <rect x="10" y="22" width="44" height="22" rx="6" stroke="currentColor" strokeWidth="2.75" />
      {/* Rolled end circle & coil */}
      <ellipse cx="16" cy="33" rx="5" ry="9" stroke="currentColor" strokeWidth="2.25" fill="currentColor" fillOpacity="0.25" />
      <path d="M16 28 Q18 33 16 38" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      {/* Carrying straps */}
      <rect x="25" y="19" width="5" height="28" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
      <rect x="39" y="19" width="5" height="28" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
      {/* Strap handle */}
      <path d="M27 19 Q34 11 41 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function StoveIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* Gas canister fill */}
      <rect x="20" y="36" width="24" height="20" rx="4" fill="currentColor" fillOpacity="0.15" />
      {/* Gas canister */}
      <rect x="20" y="36" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="2.75" />
      <path d="M26 36 V32 H38 V36" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Burner head */}
      <path d="M22 26 H42 L40 32 H24 Z" stroke="currentColor" strokeWidth="2.25" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round" />
      {/* Pot supports */}
      <path d="M16 22 L24 26 M48 22 L40 26 M32 20 V26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Flame */}
      <path
        d="M32 10 C30 14 28 17 32 21 C36 17 34 14 32 10 Z"
        fill="#e26c36"
        stroke="#e26c36"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DefaultIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* Mountain silhouettes */}
      <polygon points="32,14 10,50 54,50" fill="currentColor" fillOpacity="0.12" />
      <path d="M10 50 L32 14 L54 50" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 34 L32 24 L38 34 L32 31 Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M30 50 L44 28 L58 50" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sun / compass circle */}
      <circle cx="48" cy="18" r="5" stroke="currentColor" strokeWidth="2.2" fill="currentColor" fillOpacity="0.15" />
      <path d="M4 50 H60" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
    </svg>
  );
}

export default function CategoryIcon({
  categorySlug,
  className,
}: {
  categorySlug: string;
  className?: string;
}) {
  switch (categorySlug) {
    case "tenda":
      return <TentIcon className={className} />;
    case "carrier":
      return <CarrierIcon className={className} />;
    case "sleeping-bag":
      return <SleepingBagIcon className={className} />;
    case "matras":
      return <MatrasIcon className={className} />;
    case "kompor-portable":
      return <StoveIcon className={className} />;
    default:
      return <DefaultIcon className={className} />;
  }
}
