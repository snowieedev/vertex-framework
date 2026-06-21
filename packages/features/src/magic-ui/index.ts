import { Feature } from '@snowieedev/composer';

export const magicUiFeature: Feature = {
  id: 'magic-ui',
  displayName: 'Magic UI',
  description: 'Add Magic UI components',
  dependencies: ['tailwind'],
  conflicts: ['shadcn'], // Optional conflict handling example
  devDependencies: {
    'lucide-react': '^0.358.0',
    'class-variance-authority': '^0.7.0',
    'clsx': '^2.1.0',
    'tailwind-merge': '^2.2.1',
    'framer-motion': '^11.0.0'
  },
  folders: ['src/components/magicui', 'src/lib'],
  files: [
    {
      path: 'src/lib/utils.ts',
      content: `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`,
    }
  ],
};
