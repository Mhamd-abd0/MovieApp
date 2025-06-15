import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MovieApp - Discover Amazing Movies',
  description: 'Discover, search, and manage your favorite movies with MovieApp. Browse now playing movies, get detailed information, and create your personal wishlist.',
  keywords: 'movies, cinema, film, entertainment, movie database, now playing, movie search',
  authors: [{ name: 'MovieApp Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#dc2626',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}