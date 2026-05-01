/** @type {import('tailwindcss').Config} */
export default {
  // content: which files Tailwind scans for class names to include in the bundle
  // If a class isn't found here, Tailwind won't generate CSS for it (tree-shaking).
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom colors that match our brand
      colors: {
        primary: {
          50:  '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
