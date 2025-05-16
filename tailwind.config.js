// tailwind.config.js - Updated for GC branding
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'Noto Sans', ...fontFamily.sans], // GC preferred fonts
        mono: ['Source Code Pro', ...fontFamily.mono],
      },
      colors: {
        // Government of Canada color palette
        gc: {
          red: '#FF0000',      // FIP Red (Canada wordmark)
          darkred: '#B10E1E',  // Dark Red
          blue: {
            DEFAULT: '#26374A', // Primary Blue
            light: '#4D80B3',   // Light Blue
            dark: '#293749',    // Dark Blue
            50: '#E6EBF0',
            100: '#BFD0DE',
            200: '#99B5CC',
            300: '#729AB9',
            400: '#4C7FA7',
            500: '#26374A',     // Base blue
            600: '#1F2C3B',
            700: '#19222D',
            800: '#12191E',
            900: '#0C0F0F',
          },
          yellow: {
            DEFAULT: '#FFBF47', // Secondary Gold/Yellow
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FFBF47',     // Base yellow
            400: '#FBBF24',
            500: '#F59E0B',
            600: '#D97706',
            700: '#B45309',
            800: '#92400E',
            900: '#78350F',
          },
          gray: {
            light: '#F8F8F8',  // Light Gray
            medium: '#EEEEEE', // Medium Gray
            dark: '#333333',   // Dark Gray
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#EEEEEE',    // GC Medium Gray
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#333333',    // GC Dark Gray
            900: '#111827',
          },
        },
        // Maintain original functional color names pointing to GC colors
        primary: {
          DEFAULT: '#26374A', // GC Primary Blue
          50: '#E6EBF0',
          100: '#BFD0DE',
          200: '#99B5CC',
          300: '#729AB9',
          400: '#4C7FA7',
          500: '#26374A',
          600: '#1F2C3B',
          700: '#19222D',
          800: '#12191E',
          900: '#0C0F0F',
        },
        accent: {
          DEFAULT: '#B10E1E', // GC Dark Red
          50: '#F9E5E8',
          100: '#EFB8C0',
          200: '#E58A97',
          300: '#DB5C6F',
          400: '#D12E46',
          500: '#B10E1E',
          600: '#8E0B18',
          700: '#6A0812',
          800: '#47060C',
          900: '#230306',
        },
        warning: {
          DEFAULT: '#FFBF47', // GC Yellow
          // Yellow shades...
        },
        // Keep other functional colors...
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
};