#!/usr/bin/env node
import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

  let features = {
    typescript: true,
    eslint: true,
    tailwind: true,
    motion: true,
    ui: 'shadcn',
    git: true,
    aliases: true,
    appRouter: true,
  };

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
            { value: 'magic', label: 'Magic UI' },
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
    features = { ...features, ...custom, motion: custom.animation === 'motion', ui: custom.ui as string };
  }

  const s = p.spinner();
  s.start('Scaffolding project');

  const targetDir = path.resolve(process.cwd(), project.name as string);

  if (fs.existsSync(targetDir)) {
    s.stop('Project already exists');
    p.cancel(`Directory ${project.name} already exists. Please choose a different name.`);
    process.exit(1);
  }

  await fs.mkdir(targetDir, { recursive: true });

  // Locate templates - in prod this would be resolved from @snowieedev/vertex-templates or similar
  // For Phase 1 we assume the templates package is installed nearby or shipped with the CLI
  // We'll mimic this by assuming a specific relative path or a known location for the template.
  // Actually, since we are in the monorepo for now, we can resolve it up the tree, but for a distributed tool
  // we would bundle templates. Let's just create some dummy files if templates aren't found, 
  // or point to the installed @snowieedev/vertex-templates package.
  
  // Since we're in the monorepo, let's use the local packages/templates/default folder for this phase.
  // We'll resolve it assuming we are inside `packages/create-vertex-app/dist`.
  const templateDir = path.resolve(__dirname, '../../templates/default');
  
  if (fs.existsSync(templateDir)) {
    await fs.copy(templateDir, targetDir);
    // Rename .tmpl files
    if (fs.existsSync(path.resolve(targetDir, 'package.json.tmpl'))) {
      const pkgContent = await fs.readFile(path.resolve(targetDir, 'package.json.tmpl'), 'utf-8');
      await fs.writeFile(path.resolve(targetDir, 'package.json'), pkgContent.replace('{{projectName}}', project.name as string));
      await fs.remove(path.resolve(targetDir, 'package.json.tmpl'));
    }
  } else {
    // Fallback if not found
    await fs.writeFile(path.resolve(targetDir, 'package.json'), JSON.stringify({
      name: project.name,
      version: "0.1.0",
      private: true,
      scripts: { dev: "vertex dev", build: "vertex build" },
      devDependencies: { "@snowieedev/vertex-cli": "latest" }
    }, null, 2));
    await fs.mkdir(path.resolve(targetDir, 'src'));
    await fs.writeFile(path.resolve(targetDir, 'src/index.ts'), "console.log('Hello VERTEX');");
  }

  // Handle git initialization
  if (features.git) {
    try {
      const { execSync } = await import('node:child_process');
      execSync('git init', { cwd: targetDir, stdio: 'ignore' });
    } catch (e) {
      // ignore
    }
  }

  s.stop('Project scaffolded');

  p.note(`Next Steps:
  1. cd ${project.name}
  2. ${project.packageManager} install
  3. ${project.packageManager} run dev`, 'Project created successfully!');

  p.outro(pc.green('You are ready to build!'));
}

main().catch(console.error);
