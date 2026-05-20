import Header from '@/components/layout/Header';
import HeaderAdmin from '@/components/layout/HeaderAdmin';

export const metadata = {
  title: 'SneakerT | Admin',
  description: 'Sneaker Shop',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderAdmin />
      <main className="min-h-screen pt-20 bg-(--primary-color)">{children}</main>
    </>
  );
}
