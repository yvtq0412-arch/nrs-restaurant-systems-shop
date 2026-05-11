import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        serif: ['"Playfair Display"', '"Noto Serif JP"', 'serif'],
      },
      colors: {
        ink: '#0a0a0a',
        bone: '#f7f5f0',
      },
    },
  },
  plugins: [],
};

export default config;
