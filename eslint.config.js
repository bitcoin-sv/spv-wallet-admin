import eslint from '@eslint/js';

import * as tanstackQuery from '@tanstack/eslint-plugin-query';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import ts from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...ts.configs.recommended,
  {
    ignores: ['dist/**/*', 'node_modules/**/*', 'eslint.config.js', 'tailwind.config.js'],
  },
  {
    files: ['*.ts', '*.tsx'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      '@tanstack/query': {
        rules: tanstackQuery.rules,
      },
      import: { rules: importPlugin.rules },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...tanstackQuery.configs.recommended.rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      curly: 'error',
    },
  },
];
