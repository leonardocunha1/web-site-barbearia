import { defineConfig } from 'tsup';
import path from 'path';

export default defineConfig({
  entry: {
    app: 'src/app.ts',
    server: 'src/server.ts',
    types: 'src/types.ts',
  },
  outDir: 'build',
  format: ['cjs'],
  target: 'es2020',
  sourcemap: true,
  clean: true,
  dts: false,
  tsconfig: 'tsconfig.json',
  esbuildOptions(options) {
    options.alias = {
      ...options.alias,
      '@': path.resolve(__dirname, 'src'),
    };
  },
});
