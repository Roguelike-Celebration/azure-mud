// ESLint 9 config: neostandard plus React
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import { neostandard } from 'neostandard'

export default [
  ...neostandard({ ts: true, env: ['browser'], filesTs: ['**/*.tsx'] }),
  react.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { import: importPlugin },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './server/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname
      }
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
      'react/prop-types': 'off',
      '@typescript-eslint/await-thenable': 'error',
      'import/order': ['error', {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }],
      'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
      '@stylistic/linebreak-style': ['error', 'unix'],
      // These core rules don't understand TS types; tsc covers redeclarations and undefined names
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      'no-use-before-define': 'off',
      // typedefs: false - otherwise it fires when a same-named interface is declared after the use
      '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false, variables: false, typedefs: false }],
      'no-undef': 'off',
      '@typescript-eslint/no-shadow': 'error',
      // Disable indent for now (in the eslint 9 upgrade) to keep our current indentation style
      '@stylistic/indent': 'off',
      // Keep our existing JSX style: the old config never enabled standard's JSX style rules
      '@stylistic/jsx-closing-bracket-location': 'off',
      '@stylistic/jsx-closing-tag-location': 'off',
      '@stylistic/jsx-curly-brace-presence': 'off',
      '@stylistic/jsx-curly-newline': 'off',
      '@stylistic/jsx-curly-spacing': 'off',
      '@stylistic/jsx-equals-spacing': 'off',
      '@stylistic/jsx-first-prop-new-line': 'off',
      '@stylistic/jsx-indent-props': 'off',
      '@stylistic/jsx-pascal-case': 'off',
      '@stylistic/jsx-quotes': 'off',
      '@stylistic/jsx-tag-spacing': 'off',
      '@stylistic/jsx-wrap-multilines': 'off',
      // Not in standard 14; adopting them would be churn. Maybe later.
      '@stylistic/multiline-ternary': 'off',
      'no-var': 'off',
      'object-shorthand': 'off'
    }
  },
  {
    // Exempt React components: explicit-module-boundary-types can't recognize them
    files: ['src/**/*.ts'],
    rules: { '@typescript-eslint/explicit-module-boundary-types': 'warn' }
  }
]
