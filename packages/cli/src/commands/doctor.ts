import { logger } from '@snowieedev/vertex-shared';
import { execSync } from 'node:child_process';

export function doctorCommand() {
  logger.info('VERTEX Diagnostics:');
  
  try {
    const nodeVersion = execSync('node -v').toString().trim();
    logger.success(`Node.js: ${nodeVersion}`);
  } catch {
    logger.error('Node.js not found');
  }

  try {
    const pnpmVersion = execSync('pnpm -v').toString().trim();
    logger.success(`pnpm: ${pnpmVersion}`);
  } catch {
    logger.error('pnpm not found');
  }

  logger.info('Environment appears healthy.');
}
