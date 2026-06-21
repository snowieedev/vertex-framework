import { Feature } from '@snowieedev/composer';

export const tailwindFeature: Feature = {
  id: 'tailwind',
  displayName: 'Tailwind CSS',
  description: 'Add Tailwind CSS styling',
  devDependencies: {
    tailwindcss: '^3.4.0',
    postcss: '^8.4.0',
    autoprefixer: '^10.4.0',
  },
  configFragments: {
    tailwindConfig: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`,
  },
  folders: ['src/styles'],
  files: [
    {
      path: 'postcss.config.js',
      content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,
    },
    {
      path: 'src/styles/globals.css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
    },
  ],
};
