import type { Metadata } from 'next';
import { Open_Sans, Caveat } from 'next/font/google';
import './globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-caveat',
});

export const metadata: Metadata = {
  title: 'BaranginAja - Platform E-Commerce Barang Bekas Mahasiswa',
  description: 'Jual beli barang bekas mahasiswa berkualitas, ramah kantong, dan hemat untuk kebutuhan kos dan kuliah.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${openSans.variable} ${caveat.variable}`}>
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" 
        />
      </head>
      <body className="bg-base-white text-base-dark font-sans min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <AuthModal />
      </body>
    </html>
  );
}


