import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
