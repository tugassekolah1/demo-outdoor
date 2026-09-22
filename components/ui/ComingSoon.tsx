/**
 * Komponen placeholder untuk halaman yang folder/route-nya sudah dibuat
 * tapi fiturnya belum dikerjakan (akan diisi di phase berikutnya).
 */
export default function ComingSoon({
  title,
  phase,
}: {
  title: string;
  phase: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-foreground/60">
        Halaman ini belum dikerjakan. Direncanakan pada{" "}
        <span className="font-medium text-brand-primary">{phase}</span>.
      </p>
    </div>
  );
}
