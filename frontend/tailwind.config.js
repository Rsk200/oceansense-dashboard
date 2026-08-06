/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#041E42',
          light: '#0B2F5C',
        },
        accent: {
          DEFAULT: '#00C2FF',
          light: '#19E3FF',
        },
        success: '#00D26A',
        warning: '#FFC857',
        danger: '#EF4444',
        border: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
