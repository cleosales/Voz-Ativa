// As cores vêm de variáveis CSS (src/index.css) para o modo de alto contraste
// trocar toda a paleta sem mexer nos componentes.
const cor = (nome) => `rgb(var(--${nome}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: cor('bg'),
        surface: cor('surface'),
        ink: cor('ink'),
        muted: cor('muted'),
        line: cor('line'),
        'line-strong': cor('line-strong'),
        brand: cor('brand'),
        'brand-fg': cor('brand-fg'),
        'brand-soft': cor('brand-soft'),
        accent: cor('accent'),
        'accent-fg': cor('accent-fg'),
        danger: cor('danger'),
        'danger-soft': cor('danger-soft'),
        ok: cor('ok'),
        'ok-soft': cor('ok-soft'),
        warn: cor('warn'),
        'warn-soft': cor('warn-soft'),
      },
      fontFamily: {
        sans: ['"Atkinson Hyperlegible"', 'system-ui', '"Segoe UI"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
