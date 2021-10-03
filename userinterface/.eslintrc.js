module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  settings: {
    react: {
      version: '17.0.1',
    },
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': ['error'],
    semi: ['error', 'never'],
    'react/prop-types': 0,
    'react/display-name': 'off',
    'react/no-unescaped-entities': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': 0
  },
}
