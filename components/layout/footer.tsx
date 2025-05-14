"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/client';

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-auto border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/en" className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-2 inline-block">
              NextGen AI Platform
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              A powerful AI platform for chat, document analysis, and more.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/en/docs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/en/help" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/en/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/en/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/en/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/en/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} NextGen AI Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
