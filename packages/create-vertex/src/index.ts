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
    },
    {
      onCancel: () => {
        p.cancel('Operation cancelled.');
        process.exit(0);
      },
    }
  );

  const s = p.spinner();
  s.start('Scaffolding project...');

  const targetDir = path.resolve(process.cwd(), project.name as string);

  if (fs.existsSync(targetDir)) {
    s.stop('Project already exists');
    p.cancel(`Directory ${project.name} already exists. Please choose a different name.`);
    process.exit(1);
  }

  try {
    // Determine template path
    let templateDir = path.resolve(__dirname, '../templates/default');
    if (!fs.existsSync(templateDir)) {
      // Try alternate path for local dev (if running via tsx from src)
      templateDir = path.resolve(__dirname, '../../templates/default');
    }

    if(!fs.existsSync(templateDir)) {
      throw new Error('Template directory not found at ' + templateDir);
    }

    await fs.copy(templateDir, targetDir);

    // Update package.json
    const pkgPath = path.join(targetDir, 'package.json');
    const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
    pkg.name = project.name;
    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

    s.stop('Project scaffolded successfully');
  } catch (error: any) {
    s.stop('Project scaffolding failed');
    p.cancel(`Error: ${error.message}`);
    process.exit(1);
  }

  p.note(`Next Steps:
  1. cd ${project.name}
  2. ${project.packageManager} install
  3. ${project.packageManager} run dev`, 'Project created successfully!');

  p.outro(pc.green('You are ready to build!'));
}

main().catch(console.error);
