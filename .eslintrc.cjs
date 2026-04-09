module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '.turbo/**',
    'apps/mobile/.expo/**',
    'apps/mobile/android/**',
    'apps/mobile/ios/**',
  ],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      env: {
        es2022: true,
        node: true,
        jest: true,
      },
      rules: {
        'no-undef': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
      },
    },
  ],
};
