/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}'],
  theme: {
    fontFamily: {
      sans: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen-Sans',
        'Ubuntu',
        'Cantarell',
        'Helvetica Neue',
        'sans-serif',
      ],
    },
    extend: {
      colors: {
        'theme-bg': 'var(--color-bg)',
        'theme-surface': 'var(--color-surface)',
        'theme-card': 'var(--color-card)',
        'theme-text': 'var(--color-text)',
        'theme-text-secondary': 'var(--color-text-secondary)',
        'theme-text-muted': 'var(--color-text-muted)',
        'theme-text-muted-light': 'var(--color-text-muted-light)',
        'theme-border': 'var(--color-border)',
        'theme-accent': 'var(--color-accent)',
        'theme-accent-hover': 'var(--color-accent-hover)',
        'theme-accent-light': 'var(--color-accent-light)',
        'theme-button-text': 'var(--color-button-text)',
        'theme-hover-bg': 'var(--color-hover-bg)',
      },
      boxShadow: {
        'theme-sm': 'var(--color-shadow-sm)',
        'theme-md': 'var(--color-shadow-md)',
        'theme-lg': 'var(--color-shadow-lg)',
      },
    },
  },
  plugins: [],
};
