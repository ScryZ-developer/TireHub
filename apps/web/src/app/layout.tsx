import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'TireHub — Маркетплейс шин и дисков',
  description: 'Покупайте и продавайте шины и диски — магазины и частные объявления по всей России',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="min-h-screen pt-8 pb-12 md:pt-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
