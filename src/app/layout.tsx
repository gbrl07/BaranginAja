import type { Metadata } from 'next';
import { Google_Sans_Flex, Caveat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

const googleSansFlex = Google_Sans_Flex({
  subsets: ['latin'],
  variable: '--font-google-sans',
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
    <html lang="id" className={`${googleSansFlex.variable} ${caveat.variable}`}>
      <body className="bg-base-white text-base-dark font-sans min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AuthModal />
      </body>
    </html>
  );
}

