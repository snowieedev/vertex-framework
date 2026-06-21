#!/usr/bin/env node
import { Command } from 'commander';
import { devCommand } from './commands/dev.js';
import { buildCommand } from './commands/build.js';
import { doctorCommand } from './commands/doctor.js';
import { versionCommand } from './commands/version.js';

const program = new Command();

program
  .name('vertex')
  .description('The VERTEX Framework CLI')
  .version('0.1.0', '-v, --version', 'Output the current version');

program
  .command('dev')
  .description('Start the development server')
  .action(devCommand);

program
  .command('build')
  .description('Build the project for production')
  .action(buildCommand);

program
  .command('doctor')
  .description('Run diagnostics on your environment')
  .action(doctorCommand);

// Also support `vertex --version` out of the box via commander,
// but we explicitly wire the action just in case they typed `vertex version`
program
  .command('version')
  .description('Print framework version')
  .action(versionCommand);

program.parse(process.argv);
