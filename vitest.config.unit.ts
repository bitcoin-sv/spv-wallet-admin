import { defineConfig } from 'vitest/config';
import { srcAlias } from './vite.config';

export default defineConfig({
  resolve: {
    alias: srcAlias,
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.unit.test.ts'],
  },
});
