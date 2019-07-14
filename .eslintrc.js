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
    "no-console": 0,
    "prefer-const": 0,
    "no-unused-expressions": 0, // Not compatible with pipeline operator
    "semi": 0,
  },
}