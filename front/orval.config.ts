import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3333';

console.log({ ORVAL_API_URL: API_URL });

const config = {
  api: {
    output: {
      client: 'react-query',
      target: 'react-query',
      schemas: 'schemas',
      workspace: 'src/api',
      mode: 'tags',
      indexFiles: true,
      override: {
        header: false,
        mutator: {
          path: './http/axios-instance.ts',
          name: 'axiosInstance',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformer: (t: any) => {
          t.override.query.useInfinite = true;
          t.operationId = t.operationId.replace('Controller', '');
          t.operationName = t.operationName.replace('Controller', '');
          return t;
        },
      },
      mock: false,
    },
    input: {
      target:
        `${API_URL}/docs/json`,
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
  zodApi: {
    input: {
      target:
        `${API_URL}/docs/json`,
    },
    output: {
      mode: 'tags',
      indexFiles: true,
      client: 'zod',
      workspace: 'src/api',
      target: 'zod',
      override: {
        header: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        operationName: (operation: any) => {
          return `zod${operation.operationId}`;
        },
        zod: {
          generate: {
          body: true,
          param: true,
          query: true,
          response: true,
          header: false,
        },
        },
      },
    },
    hooks: {
      // afterAllFilesWrite: 'prettier --write',
    },
  },
};

export default config;
