import { logger, handleError } from '@snowieedev/vertex-shared';
import { loadConfig } from '@snowieedev/vertex-config';
import { createBuilder } from '@snowieedev/vertex-builder';

export async function buildCommand() {
  try {
    const cwd = process.cwd();
    logger.info('Starting production build...');
    const config = await loadConfig(cwd);

    // Hardcoded to esbuild for Phase 1
    const builder = await createBuilder('esbuild', cwd, config);
    
    const result = await builder.build();
    
    if (result.warnings && result.warnings.length > 0) {
      result.warnings.forEach(w => logger.warn(w));
    }
  } catch (err) {
    handleError(err);
  }
}
