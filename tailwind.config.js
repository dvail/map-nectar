module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      animation: {}
     },
    fontFamily: {
      mono: ['Inconsolata', 'monospace'],
      sans: ['"Source Sans Pro"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    flexGrow: {
      DEFAULT: 1,
      0: 0,
      1: 1,
      2: 2,
      3: 3,
    },
  },
  variants: {
  },
  plugins: [],
}
