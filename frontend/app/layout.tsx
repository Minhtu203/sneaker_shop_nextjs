import { ThemeProvider } from 'next-themes';
import './globals.css';
import Header from '@/components/layout/Header';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Bebas_Neue } from 'next/font/google';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'SneakerT',
  description: 'Sneaker Shop',
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bebasNeue.variable} antialiased`}>
        <CustomCursor />
        <ThemeProvider>
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
