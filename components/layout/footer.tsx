// components/layout/footer.tsx
// If this file already exists, update it to include the locale prop in the interface

import Link from "next/link";

export interface FooterProps {
  locale?: string;
}

export function Footer({ locale = "en" }: FooterProps) {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} NextGen AI Platform
            </p>
          </div>
          
          <nav className="flex space-x-6">
            <Link 
              href={`/${locale}/privacy`} 
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Privacy Policy
            </Link>
            <Link 
              href={`/${locale}/terms`} 
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Terms of Service
            </Link>
            <Link 
              href={`/${locale}/help`} 
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Help
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}