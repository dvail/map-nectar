let tailwindAnimations = require('tailwindcss-animations');

module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.tsx',
  ],
  theme: {
    extend: { },
    fontFamily: {
      mono: ['Inconsolata', 'monospace'],
    },
    flexGrow: {
      default: 1,
      0: 0,
      1: 1,
      2: 2,
      3: 3,
    },
    animations: {
      pulse: {
        from: {
          transform: 'scale(1)',
        },
        to: {
          transform: 'scale(0.9)',
        },
      },
      'expand-up': {
        from: {
          transform: 'scale(1, 0)',
        },
        to: {
          transform: 'scale(1, 1)',
        },
      },
      'collapse-down': {
        from: {
          transform: 'scale(1, 1)',
        },
        to: {
          transform: 'scale(1, 0)',
        },
      },
    },
    animationDuration: { // defaults to these values
      default: '1s',
      '200ms': '0.2s',
      '500ms': '0.5s',
      '0s': '0s',
      '1s': '1s',
      '2s': '2s',
      '3s': '3s',
      '4s': '4s',
      '5s': '5s',
    },
  },
  variants: {
  },
  plugins: [
    tailwindAnimations,
  ],
}
