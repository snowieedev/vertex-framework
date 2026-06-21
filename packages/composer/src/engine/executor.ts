import fs from 'fs-extra';
import path from 'node:path';
import { ProjectBlueprint, ProjectConfiguration } from '../types.js';
import { PackageBuilder } from '../builders/package-builder.js';
import { ConfigBuilder } from '../builders/config-builder.js';
import { execSync } from 'node:child_process';
import pc from 'picocolors';

export class Executor {
  private packageBuilder = new PackageBuilder();
  private configBuilder = new ConfigBuilder();

  async execute(targetDir: string, config: ProjectConfiguration, blueprint: ProjectBlueprint) {
    console.log(pc.blue('Creating folders...'));
    await fs.mkdir(targetDir, { recursive: true });
    for (const folder of blueprint.folders) {
      await fs.mkdir(path.resolve(targetDir, folder), { recursive: true });
    }

    console.log(pc.blue('Writing package.json...'));
    const packageJsonContent = this.packageBuilder.build(blueprint);
    await fs.writeFile(path.resolve(targetDir, 'package.json'), packageJsonContent);

    console.log(pc.blue('Writing config files...'));
    const configFiles = this.configBuilder.build(blueprint);
    for (const [filename, content] of configFiles.entries()) {
      await fs.writeFile(path.resolve(targetDir, filename), content);
    }

    console.log(pc.blue('Writing feature files...'));
    for (const [filepath, content] of blueprint.files.entries()) {
      const fullPath = path.resolve(targetDir, filepath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content);
    }

    if (!config.skipInstall) {
      console.log(pc.blue(`Installing dependencies using ${config.packageManager}...`));
      try {
        execSync(`${config.packageManager} install`, { cwd: targetDir, stdio: 'inherit' });
      } catch (error) {
        console.error(pc.red('Failed to install dependencies.'), error);
        throw error;
      }
    } else {
      console.log(pc.blue(`Skipping dependency installation. You will need to run '${config.packageManager} install' manually.`));
    }

    console.log(pc.blue('Running post-install hooks...'));
    for (const hook of blueprint.postInstallHooks) {
      await hook({ targetDir, packageManager: config.packageManager });
    }

    console.log(pc.green('Project generation complete!'));
  }
}
