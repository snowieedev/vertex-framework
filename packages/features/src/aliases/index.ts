import { Feature } from '@snowieedev/composer';

export const aliasesFeature: Feature = {
  id: 'aliases',
  displayName: 'Path Aliases',
  description: 'Configure @/* path aliases',
  configFragments: {
    tsconfig: {
      compilerOptions: {
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
        },
      },
    },
  },
};
