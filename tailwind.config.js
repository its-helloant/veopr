const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'mobile-h1': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }], // text-2xl sm:text-3xl md:text-4xl lg:text-5xl
        'mobile-h2': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }], // text-xl sm:text-2xl md:text-3xl
        'mobile-body': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // text-sm sm:text-base
      },
      spacing: {
        'mobile-margin': '1rem', // mb-4 sm:mb-6 md:mb-8
        'mobile-padding': '1rem', // px-4 sm:px-6 md:px-8
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()]
}; 