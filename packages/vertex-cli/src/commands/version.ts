import { logger, FRAMEWORK_NAME } from '@snowieedev/vertex-shared';
// Ideally, read from package.json in production
export function versionCommand() {
  logger.info(`${FRAMEWORK_NAME} v0.1.0`);
}
