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
    'react/prop-types': 0
  },
  // use override to exempt React components; v3 of the rule can't exempt React per se
  overrides: [
    {
      files: ['src/**/*.ts'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'warn'
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
}
