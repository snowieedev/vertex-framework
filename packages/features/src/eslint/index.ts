import { Feature } from '@snowieedev/composer';

export const eslintFeature: Feature = {
  id: 'eslint',
  displayName: 'ESLint',
  description: 'Add ESLint configuration',
  devDependencies: {
    eslint: '^9.0.0',
    'typescript-eslint': '^7.7.0',
  },
  files: [
    {
      path: 'eslint.config.mjs',
      content: `import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);
`,
    },
  ],
};
