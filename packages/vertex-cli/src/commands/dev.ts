import { logger, handleError } from '@snowieedev/vertex-shared';
import { loadConfig } from '@snowieedev/vertex-config';
import { createServer } from '@snowieedev/vertex-dev-server';

export async function devCommand() {
  try {
    const cwd = process.cwd();
    logger.info('Starting dev server...');
    const config = await loadConfig(cwd);
    
    // In future, this could be configurable. For now, strictly Vite.
    const devServer = await createServer('vite', cwd, config);
    await devServer.start();
    
    // Catch signals to gracefully close
    process.on('SIGINT', async () => {
      logger.info('Shutting down dev server...');
      await devServer.close();
      process.exit(0);
    });
  } catch (err) {
    handleError(err);
  }
}
