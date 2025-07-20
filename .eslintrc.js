// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  // FIX: Removed '*.js' from ignorePatterns so this config file itself can be linted.
  ignorePatterns: ['dist', 'build', 'node_modules', '*.cjs'],
  overrides: [
    {
      // Rules specifically for your React client files
      files: ['client/src/**/*.{ts,tsx}'],
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      plugins: ['react-refresh'],
      rules: {
        'react-refresh/only-export-components': 'warn',
      },
    },
    {
      // Rules specifically for your Node.js server files
      files: ['server/src/**/*.ts'],
      rules: {
        // You can add server-specific rules here if needed
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
