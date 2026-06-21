import { Feature } from '@snowieedev/composer';

export const gsapFeature: Feature = {
  id: 'gsap',
  displayName: 'GSAP',
  description: 'Add GSAP for animations',
  npmDependencies: {
    'gsap': '^3.12.5',
  },
  folders: ['src/lib/animations'],
  files: [
    {
      path: 'src/lib/animations/gsap-utils.ts',
      content: `import gsap from 'gsap';

export const fadeIn = (target: string | Element) => {
  gsap.fromTo(target, { opacity: 0 }, { opacity: 1, duration: 1 });
};
`,
    }
  ],
};
