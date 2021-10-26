module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  plugins: ['import', 'jsx-a11y', 'react', 'prettier'],
  rules: {
    'react/jsx-filename-extension': 0,
    'react/forbid-prop-types': 1,
    'react/require-default-props': 1,
    'react/no-array-index-key': 1,
    'react/display-name': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'import/no-named-as-default': 0,
    'import/prefer-default-export': 0,
    'react/destructuring-assignment': 0,
    'prettier/prettier': 1,
    'react/no-deprecated': 1,
    'no-unused-vars': 1,
    'no-debugger': 1,
    'no-console': 1,
    'react/prop-types': 'off',
  },
};
