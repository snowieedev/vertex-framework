import { Feature } from '@snowieedev/composer';

export const animeFeature: Feature = {
  id: 'anime',
  displayName: 'Anime.js',
  description: 'Add Anime.js for animations',
  npmDependencies: {
    'animejs': '^3.2.2',
  },
  devDependencies: {
    '@types/animejs': '^3.1.12',
  },
};
