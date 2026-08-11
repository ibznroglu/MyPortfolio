/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Every themed colour reads from a CSS variable, so switching themes is
      // one attribute on <html> rather than a `dark:` variant on every class.
      colors: {
        surface: 'rgb(var(--surface) / <alpha-value>)',
        raised: 'rgb(var(--surface-raised) / <alpha-value>)',
        heading: 'rgb(var(--heading) / <alpha-value>)',
        body: 'rgb(var(--body) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--accent-hover) / <alpha-value>)',
        'accent-soft': 'rgb(var(--accent-soft) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        'on-brand': 'rgb(var(--on-brand) / <alpha-value>)',
        hairline: 'rgb(var(--hairline) / <alpha-value>)',
      },
      fontFamily: {
        sans: [
          'Raleway Variable',
          'Raleway',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
