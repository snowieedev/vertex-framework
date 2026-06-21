import { logger } from './logger.js';

export class VertexError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VertexError';
  }
}

export function handleError(error: unknown) {
  if (error instanceof VertexError) {
    logger.error(error.message);
  } else if (error instanceof Error) {
    logger.error(error.message);
    if (process.env.DEBUG && error.stack) {
      console.error(error.stack);
    }
  } else {
    logger.error(String(error));
  }
  process.exit(1);
}
