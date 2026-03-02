/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#006856',
          primaryHover: '#00705e',
          accent: '#00867b',
          light: '#e6f4f1',
        },
        surface: {
          glass: 'rgba(255,255,255,0.12)',
          glassStrong: 'rgba(255,255,255,0.22)',
          glassDark: 'rgba(0,0,0,0.18)',
          glassDarkStrong: 'rgba(0,0,0,0.32)',
        },
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
