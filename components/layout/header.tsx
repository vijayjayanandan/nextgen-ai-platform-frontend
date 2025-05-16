// components/layout/header.tsx
// If this file already exists, update it to include the user prop in the interface

import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
} | null;

export interface HeaderProps {
  user?: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/en" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              NextGen AI Platform
            </Link>
            <nav className="ml-6 space-x-4 hidden md:flex">
              <Link href="/en/chat" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                Chat
              </Link>
              <Link href="/en/documents" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                Documents
              </Link>
              <Link href="/en/settings" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                Settings
              </Link>
            </nav>
          </div>
          
          {user && (
            <div className="flex items-center">
              <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                {user.name}
              </span>
              <Link 
                href="/en/auth/login" 
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Logout
              </Link>
            </div>
          )}
          
          {!user && (
            <Link 
              href="/en/auth/login" 
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}