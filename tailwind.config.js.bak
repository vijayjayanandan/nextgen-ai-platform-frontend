// tailwind.config.js
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
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      colors: {
        // Government of Canada color palette
        primary: {
          DEFAULT: '#26374A', // GC blue
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
          DEFAULT: '#B10E1E', // GC red
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
        success: {
          DEFAULT: '#2B8823',
        },
        warning: {
          DEFAULT: '#EE7100',
        },
        info: {
          DEFAULT: '#269ABC',
        },
      },
      borderRadius: {
        'lg': '0.5rem',
        'md': '0.375rem',
        'sm': '0.25rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};