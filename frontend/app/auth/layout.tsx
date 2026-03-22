import '../globals.css';
import Header from '@/components/layout/Header';

export const metadata = {
  title: 'Login',
  description: 'Sneaker shop',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-(--primary-color)">
      <main className="min-h-screen">{children}</main>
    </div>
  );
}
