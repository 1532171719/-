import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Page
        'bg-page': '#F8FAFC',
        'bg-card': '#FFFFFF',
        'bg-elevated': '#F1F5F9',
        // Primary accents
        'brand': '#4F46E5',
        'brand-light': '#818CF8',
        'brand-bg': '#EEF2FF',
        // Semantic accents
        'accent-cyan': '#06B6D4',
        'accent-cyan-bg': '#ECFEFF',
        'accent-green': '#10B981',
        'accent-green-bg': '#ECFDF5',
        'accent-amber': '#F59E0B',
        'accent-amber-bg': '#FFFBEB',
        'accent-red': '#EF4444',
        'accent-red-bg': '#FEF2F2',
        // Text
        'text-main': '#1E293B',
        'text-secondary': '#64748B',
        'text-muted': '#94A3B8',
        // Borders
        'border-light': '#E2E8F0',
        'border-hover': '#CBD5E1',
      },
      fontFamily: {
        sans: ['Source Sans 3', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        heading: ['Lexend', 'Noto Sans SC', 'PingFang SC', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
        'card-hover': '0 12px 24px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.03)',
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [typography],
}
