import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#171e19',
        charcoal: {
          DEFAULT: '#171e19',
          light: '#242e27',
          dark: '#0f1411',
        },
        darkgray: '#272727',
        yellow: {
          DEFAULT: '#ffe17c',
          hover: '#ffd850',
          light: '#fff4cc',
        },
        sage: {
          DEFAULT: '#b7c6c2',
          light: '#d2deda',
          dark: '#93a39f',
        },
        lightgray: '#f8f9fa',
        primary: {
          DEFAULT: '#ffe17c',
          foreground: '#171e19',
        },
        secondary: {
          DEFAULT: '#171e19',
          foreground: '#ffffff',
        },
      },
      fontFamily: {
        anton: ['"Anton"', 'sans-serif'],
        satoshi: ['"Satoshi"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['"Satoshi"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Courier New', 'monospace'],
      },
      transitionTimingFunction: {
        brutalist: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap, 1rem)))' },
        },
      },
      animation: {
        marquee: 'marquee var(--duration, 35s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 35s) linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
