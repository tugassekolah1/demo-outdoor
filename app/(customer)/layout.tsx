import Navbar from "@/components/customer/Navbar";
import Footer from "@/components/customer/Footer";

/**
 * Layout khusus untuk semua halaman customer (grup route "(customer)").
 * Route group ini tidak muncul di URL — homepage tetap di "/".
 */
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
