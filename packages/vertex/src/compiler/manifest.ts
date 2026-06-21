import { scanAppDirectory } from './scanner.js';
import { RouteManifest } from '../types/index.js';

export async function buildRouteManifest(appDir: string): Promise<RouteManifest> {
  const rootSegment = await scanAppDirectory(appDir);
  return {
    root: rootSegment,
  };
}
