import { Feature } from '@snowieedev/composer';
import { execSync } from 'node:child_process';
import pc from 'picocolors';

export const gitFeature: Feature = {
  id: 'git',
  displayName: 'Git',
  description: 'Initialize a git repository',
  files: [
    {
      path: '.gitignore',
      content: `node_modules/
dist/
.env
.DS_Store
`,
    },
  ],
  postInstall: async ({ targetDir }) => {
    try {
      console.log(pc.blue('Initializing git repository...'));
      execSync('git init', { cwd: targetDir, stdio: 'ignore' });
      execSync('git add .', { cwd: targetDir, stdio: 'ignore' });
    } catch (error) {
      console.warn(pc.yellow('Failed to initialize git repository. Is git installed?'));
    }
  },
};
