import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'au3te-ts-base',
      fileName: 'index',
    },
  },
  plugins: [
    nodePolyfills({
      globals: {
        Buffer: 'build',
        global: 'build',
        process: 'build',
      },
      overrides: {
        fs: 'memfs',
      },
    }),
  ],
});
