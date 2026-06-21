import { Feature } from '@snowieedev/composer';

export const shadcnFeature: Feature = {
  id: 'shadcn',
  displayName: 'shadcn/ui',
  description: 'Add shadcn/ui components',
  dependencies: ['tailwind'],
  conflicts: ['magic-ui'], // Optional conflict handling example
  devDependencies: {
    'lucide-react': '^0.358.0',
    'class-variance-authority': '^0.7.0',
    'clsx': '^2.1.0',
    'tailwind-merge': '^2.2.1',
  },
  folders: ['src/components/ui', 'src/lib'],
  files: [
    {
      path: 'src/lib/utils.ts',
      content: `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`,
    },
    {
      path: 'components.json',
      content: `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
`,
    }
  ],
};
