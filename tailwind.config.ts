import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#131722',
        accent: '#7dd3fc',
        subtle: '#9CA3AF'
      },
      boxShadow: {
        glow: '0 0 24px rgba(125, 211, 252, 0.15)'
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: []
} satisfies Config