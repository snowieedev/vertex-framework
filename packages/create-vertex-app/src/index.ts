#!/usr/bin/env node
import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Composer, ProjectConfiguration } from '@snowieedev/composer';
import * as featuresList from '@snowieedev/features';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.clear();

  p.intro(`${pc.bgBlue(pc.white(' VERTEX '))} ${pc.dim('v0.1.0')}`);

  const project = await p.group(
    {
      name: () =>
        p.text({
          message: 'What is your project named?',
          placeholder: 'my-vertex-app',
          validate: (value) => {
            if (!value) return 'Please enter a name.';
            if (value.match(/[^a-zA-Z0-9-_]/)) return 'Project name can only contain letters, numbers, dashes, and underscores.';
          },
        }),
      packageManager: () =>
        p.select({
          message: 'Which package manager do you want to use?',
          options: [
            { value: 'npm', label: 'npm' },
            { value: 'pnpm', label: 'pnpm', hint: 'recommended' },
            { value: 'yarn', label: 'yarn' },
            { value: 'bun', label: 'bun' },
          ] as any,
        }),
      setup: () =>
        p.select({
          message: 'How would you like to set up your project?',
          options: [
            { value: 'default', label: 'Default (TypeScript, ESLint, Tailwind, shadcn/ui, Git)' },
            { value: 'custom', label: 'Custom (Choose individual tools)' },
          ] as any,
        }),
    },
    {
      onCancel: () => {
        p.cancel('Operation cancelled.');
        process.exit(0);
      },
    }
  );

  let selectedFeatures = ['typescript', 'eslint', 'tailwind', 'shadcn', 'git', 'aliases', 'appRouter'];

  if (project.setup === 'custom') {
    const custom = await p.group(
      {
        typescript: () => p.confirm({ message: 'Would you like to use TypeScript?', initialValue: true }),
        eslint: () => p.confirm({ message: 'Would you like to use ESLint?', initialValue: true }),
        tailwind: () => p.confirm({ message: 'Would you like to use Tailwind CSS?', initialValue: true }),
        animation: () => p.select({
          message: 'Which animation library?',
          options: [
            { value: 'motion', label: 'Motion' },
            { value: 'gsap', label: 'GSAP' },
            { value: 'anime', label: 'Anime.js' },
            { value: 'lottie', label: 'Lottie' },
            { value: 'none', label: 'None' },
          ] as any
        }),
        ui: () => p.select({
          message: 'Which UI library?',
          options: [
            { value: 'shadcn', label: 'shadcn/ui' },
            { value: 'magic-ui', label: 'Magic UI' },
            { value: 'none', label: 'None' },
          ] as any
        }),
        git: () => p.confirm({ message: 'Initialize a new git repository?', initialValue: true }),
        aliases: () => p.confirm({ message: 'Configure path aliases (@/*)?', initialValue: true }),
        appRouter: () => p.confirm({ message: 'Use App Router?', initialValue: true }),
      },
      {
        onCancel: () => {
          p.cancel('Operation cancelled.');
          process.exit(0);
        },
      }
    );
    
    selectedFeatures = [];
    if (custom.typescript) selectedFeatures.push('typescript');
    if (custom.eslint) selectedFeatures.push('eslint');
    if (custom.tailwind) selectedFeatures.push('tailwind');
    if (custom.animation !== 'none') selectedFeatures.push(custom.animation as string);
    if (custom.ui !== 'none') selectedFeatures.push(custom.ui as string);
    if (custom.git) selectedFeatures.push('git');
    if (custom.aliases) selectedFeatures.push('aliases');
    if (custom.appRouter) selectedFeatures.push('appRouter');
  }

  const s = p.spinner();
  s.start('Scaffolding project via Composer');

  const targetDir = path.resolve(process.cwd(), project.name as string);

  if (fs.existsSync(targetDir)) {
    s.stop('Project already exists');
    p.cancel(`Directory ${project.name} already exists. Please choose a different name.`);
    process.exit(1);
  }

  const config: ProjectConfiguration = {
    name: project.name as string,
    packageManager: project.packageManager as any,
    features: selectedFeatures
  };

  try {
    const composer = new Composer();
    
    // Register all available features
    const allFeatures = Object.values(featuresList);
    composer.registerFeatures(allFeatures);
    
    await composer.compose(targetDir, config);
    s.stop('Project scaffolded successfully');
  } catch (error: any) {
    s.stop('Project scaffolding failed');
    p.cancel(`Error: ${error.message}`);
    process.exit(1);
  }

  p.note(`Next Steps:
  1. cd ${project.name}
  2. ${project.packageManager} run dev`, 'Project created successfully!');

  p.outro(pc.green('You are ready to build!'));
}

main().catch(console.error);
