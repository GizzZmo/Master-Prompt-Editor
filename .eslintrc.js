module.exports = {
  root: true,
  env: {module.exports = {
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
  // ✅ Explicitly ignore build artifacts and config files
  ignorePatterns: ['dist', 'build', 'node_modules', '*.js', '*.cjs'],
  overrides: [
    {
      // ✅ Rules specifically for your React client files
      files: ['client/src/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
      extends: [
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime', // For new JSX transform
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react-refresh/only-export-components': 'warn',
      },
      plugins: ['react-refresh'],
    },
    {
      // ✅ Rules specifically for your Node.js server files
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
  // ✅ Explicitly ignore build artifacts and config files
  ignorePatterns: ['dist', 'build', 'node_modules', '*.js', '*.cjs'],
  overrides: [
    {
      // ✅ Rules specifically for your React client files
      files: ['client/src/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
      extends: [
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime', // For new JSX transform
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react-refresh/only-export-components': 'warn',
      },
      plugins: ['react-refresh'],
    },
    {
      // ✅ Rules specifically for your Node.js server files
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
