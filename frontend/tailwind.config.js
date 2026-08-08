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
        article: {
          navy: '#0B1E33',
          'navy-light': '#122A44',
          panel: '#16304B',
          'panel-line': 'rgba(243,239,230,0.12)',
          gold: '#E8A33D',
          teal: '#4FB3AB',
          clay: '#C1622E',
          ivory: '#F3EFE6',
          'ivory-dim': '#B9C2CE',
          danger: '#E8664F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
        article: ['Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
}
