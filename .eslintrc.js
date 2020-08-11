module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'plugin:jsx-a11y/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'jsx-a11y'
  ],
  rules: {
    'no-unused-vars': 0,
    'space-before-function-paren': ['error', 'never']
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
