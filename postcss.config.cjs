module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      config: {
        content: [
          './index.html',
          './src/**/*.{vue,js,ts,jsx,tsx}',
        ],
        // Всі конфігурації, теми, плагіни і т.д. будуть тут
      },
    },
  },
}