import { Feature } from '@snowieedev/composer';

export const eslintFeature: Feature = {
  id: 'eslint',
  displayName: 'ESLint',
  description: 'Add ESLint configuration',
  devDependencies: {
    eslint: '^8.56.0',
    '@typescript-eslint/eslint-plugin': '^7.0.0',
    '@typescript-eslint/parser': '^7.0.0',
  },
  configFragments: {
    eslint: {
      env: { browser: true, es2020: true },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {},
    },
  },
};
