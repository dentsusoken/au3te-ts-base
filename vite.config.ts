import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  build: {
    lib: {
      entry: {
        api: './lib/api/index.ts',
        handler: './lib/handler/index.ts',
        'handler/par': './lib/handler/par/index.ts',
        'handler/authorization': './lib/handler/authorization/index.ts',
        'handler/authorization-decision':
          './lib/handler/authorization-decision/index.ts',
        'handler/authorization-fail':
          './lib/handler/authorization-fail/index.ts',
        'handler/authorization-issue':
          './lib/handler/authorization-issue/index.ts',
        'handler/token': './lib/handler/token/index.ts',
        'handler/token-issue': './lib/handler/token-issue/index.ts',
        'handler/token-fail': './lib/handler/token-fail/index.ts',
        'handler/token-create': './lib/handler/token-create/index.ts',
        'handler/introspection': './lib/handler/introspection/index.ts',
        'handler/service-configuration':
          './lib/handler/service-configuration/index.ts',
        'handler/credential-metadata':
          './lib/handler/credential-metadata/index.ts',
        'handler/credential-single-parse':
          './lib/handler/credential-single-parse/index.ts',
        extractor: './lib/extractor/index.ts',
        session: './lib/session/index.ts',
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
