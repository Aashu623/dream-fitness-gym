/** @type {import('tailwindcss').Config} */
import { blackA, violet, mauve } from '@radix-ui/colors';
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ...blackA,
        ...violet,
        ...mauve,
      },
    },
  },
  plugins: [],
}
