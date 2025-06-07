import { ReactNode } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata = {
  title: 'NextGen AI Platform',
  description: 'Advanced AI platform for next-generation applications',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
        <div className="flex flex-col min-h-screen">
          {/* @ts-ignore */}
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          {/* @ts-ignore */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
