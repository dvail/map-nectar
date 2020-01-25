module.exports = {
  "extends": ["airbnb"],
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
  },
  "globals": {
  },
  "rules": {
    "arrow-parens": 0,
    "max-len": 0,
    "quotes": 0,
    "no-console": 0,
    "no-bitwise": 0,
    "no-plusplus": 0,
    "no-multi-spaces": 0,
    "no-else-return": 0,
    "no-param-reassign": 0,
    "no-use-before-define": ["error", { "functions": false }],
    "object-curly-newline": 0,
    "prefer-const": 0,
    "function-paren-newline": 0, // Disabled for cleaner hyperscript
    "no-unused-expressions": 0, // Not compatible with pipeline operator
    "semi": 0,
    "jsx-quotes": 0,
    "react/prop-types": 0,
    "react/react-in-jsx-scope": 0,
    "react/jsx-filename-extension": 0,
    "react/no-unknown-property": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/label-has-for": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "jsx-a11y/no-noninteractive-tabindex": 0,
  },
}