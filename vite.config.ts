import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  build: {
    lib: {
      entry: {
        api: './lib/api/index.ts',
        endpoint: './lib/endpoint/index.ts',
        'endpoint/par': './lib/endpoint/par/index.ts',
        'endpoint/service-configuration':
          './lib/endpoint/service-configuration/index.ts',
        'endpoint/credential-metadata':
          './lib/endpoint/credential-metadata/index.ts',
        handler: './lib/handler/index.ts',
        'handler/par': './lib/handler/par/index.ts',
        'handler/authorization-fail':
          './lib/handler/authorization-fail/index.ts',
        'handler/service-configuration':
          './lib/handler/service-configuration/index.ts',
        'handler/credential-metadata':
          './lib/handler/credential-metadata/index.ts',
        extractor: './lib/extractor/index.ts',
        utils: './lib/utils/index.ts',
      },
      name: 'au3te-ts-base',
      fileName: (format, entry) => {
        const ext = format === 'es' ? 'js' : format;
        return `${entry}/index.${ext}`;
      },
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
