import fs from 'node:fs';
import path from 'node:path';
import { logger, CONFIG_FILE_NAME, VertexError } from '@snowieedev/vertex-shared';
import jiti from 'jiti';
import type { VertexConfig } from './types.js';

export async function loadConfig(cwd: string = process.cwd()): Promise<VertexConfig> {
  const configPath = path.resolve(cwd, CONFIG_FILE_NAME);
  if (!fs.existsSync(configPath)) {
    logger.debug(`No ${CONFIG_FILE_NAME} found at ${cwd}, using default configuration.`);
    return {};
  }

  try {
    const createJiti = (jiti as any).default || jiti;
    const jitiInstance = createJiti(process.cwd(), { interopDefault: true });
    const configModule = jitiInstance(configPath);
    
    // Support module.exports or export default
    const config = configModule.default || configModule;
    return config as VertexConfig;
  } catch (error) {
    throw new VertexError(`Failed to load configuration from ${configPath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
