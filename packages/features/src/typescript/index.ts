import { Feature } from '@snowieedev/composer';

export const typescriptFeature: Feature = {
  id: 'typescript',
  displayName: 'TypeScript',
  description: 'Add TypeScript support',
  devDependencies: {
    typescript: '^5.0.0',
    '@types/node': '^20.0.0',
  },
  configFragments: {
    tsconfig: {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        baseUrl: '.',
      },
      include: ['src/**/*'],
    },
  },
  folders: ['src'],
  files: [
    {
      path: 'src/index.ts',
      content: `console.log('Hello VERTEX');\n`,
    },
  ],
};
