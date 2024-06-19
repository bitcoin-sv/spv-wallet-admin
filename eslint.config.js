import { fixupConfigRules } from '@eslint/compat';
import pluginJs from '@eslint/js';
import * as reactQuery from '@tanstack/eslint-plugin-query';
import pluginImport from 'eslint-plugin-import';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import * as reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  {
    plugins: {
      '@tanstack/query': reactQuery,
      import: { rules: pluginImport.rules },
      'react-hooks/recommended': reactHooks,
    },
    rules: {
      '@tanstack/query/exhaustive-deps': 'error',
      '@tanstack/query/no-rest-destructuring': 'warn',
      '@tanstack/query/stable-query-client': 'error',
      'import/exports-last': 'off',
      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: true,
        },
      ],
      'import/order': [
        'error',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin', 'object', 'type'],
          'newlines-between': 'always-and-inside-groups',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
];
