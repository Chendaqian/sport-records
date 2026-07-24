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
        'theme-card': 'var(--color-card)',
        'theme-text': 'var(--color-text)',
        'theme-text-secondary': 'var(--color-text-secondary)',
        'theme-text-muted': 'var(--color-text-muted)',
        'theme-text-muted-light': 'var(--color-text-muted-light)',
        'theme-border': 'var(--color-border)',
        'theme-accent': 'var(--color-accent)',
        'theme-button-text': 'var(--color-button-text)',
        'theme-hover-bg': 'var(--color-hover-bg)',
      },
    },
  },
  plugins: [],
};
