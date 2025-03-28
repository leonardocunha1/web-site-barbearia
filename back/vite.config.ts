// vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    workspace: [
      {
        test: {
          name: 'e2e',
          include: ['src/http/controllers/**/**.spec.ts'],
          environment: 'prisma',
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
      },
      {
        test: {
          name: 'unit',
          include: ['src/use-cases/**.spec.ts'],
          environment: 'node',
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
      },
    ],
  },
});
