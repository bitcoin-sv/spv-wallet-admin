import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export const srcAlias = {
  '@': path.resolve(__dirname, './src'),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    nodePolyfills({
      include: ['buffer'],
      globals: {
        Buffer: true,
      },
    }),
  ],
  resolve: {
    alias: srcAlias,
  },
});
