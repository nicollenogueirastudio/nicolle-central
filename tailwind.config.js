/** @type {import('tailwindcss').Config} */
// Visual inspirado na Apple: fundo cinza-quente claro, superfícies brancas,
// tipografia sem serifa com tracking justo, cantos arredondados e sombras sutis.
// Paleta interna: taupe + oliva, sem vermelho.
const sistema = ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'Inter', 'system-ui', 'sans-serif']

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F5F3',
        'warm-beige': '#E8E6E1',
        charcoal: '#1D1D1F',
        dark: '#1D1D1F',
        muted: '#86868B',
        accent: '#8B7355',
        gold: '#B59A6E',
        'soft-white': '#FFFFFF',
        olive: '#6B6F4E',
        linha: 'rgba(0,0,0,0.08)',
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'Inter', 'system-ui', 'sans-serif'],
        body: sistema,
        sans: sistema,
        mono: ['"SF Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.04)',
        flutuante: '0 8px 40px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06)',
        controle: '0 1px 3px rgba(0,0,0,0.10), 0 1px 1px rgba(0,0,0,0.04)',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      keyframes: {
        entrar: { from: { transform: 'translateX(24px)', opacity: '0' }, to: { transform: 'none', opacity: '1' } },
        surgir: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        entrar: 'entrar .32s cubic-bezier(0.25,0.1,0.25,1)',
        surgir: 'surgir .2s ease-out',
      },
    },
  },
  plugins: [],
}
