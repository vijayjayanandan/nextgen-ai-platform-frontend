"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/client';

export function Header() {
  const { t } = useTranslation();
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-4 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/en" className="text-xl font-bold text-primary-600 dark:text-primary-400">
          NextGen AI Platform
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                href="/en/chat" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
              >
                {t('navigation.chat')}
              </Link>
            </li>
            <li>
              <Link 
                href="/en/documents" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
              >
                {t('navigation.documents')}
              </Link>
            </li>
            <li>
              <Link 
                href="/en/settings" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
              >
                {t('navigation.settings')}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
