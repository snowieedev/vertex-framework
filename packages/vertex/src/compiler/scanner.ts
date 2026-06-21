import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { RouteSegment } from '../types/index.js';

const ROUTE_FILES = ['page.tsx', 'layout.tsx', 'loading.tsx', 'error.tsx', 'not-found.tsx'] as const;
type RouteFile = typeof ROUTE_FILES[number];

export async function scanAppDirectory(appDir: string): Promise<RouteSegment> {
  const isAppDir = appDir.endsWith('app') || appDir.endsWith('app/') || appDir.endsWith('app\\');
  return scanDirectory(appDir, isAppDir ? '/' : path.basename(appDir));
}

async function scanDirectory(dirPath: string, segmentPath: string): Promise<RouteSegment> {
  let entries: import('fs').Dirent[] = [];
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch (error) {
    // If directory doesn't exist or isn't readable, return an empty segment
    return createEmptySegment(dirPath, segmentPath);
  }

  const segment = createEmptySegment(dirPath, segmentPath);

  // Check for route files
  for (const file of ROUTE_FILES) {
    const filePath = path.join(dirPath, file);
    try {
      await fs.stat(filePath);
      const key = file.replace('.tsx', '');
      if (key === 'not-found') {
        segment.notFound = filePath;
      } else {
        (segment as any)[key] = filePath;
      }
    } catch {
      // File does not exist, ignore
    }
  }

  // Recursively process child directories
  const dirs = entries.filter((entry) => entry.isDirectory());
  for (const dir of dirs) {
    const childPath = path.join(dirPath, dir.name);
    const childSegment = await scanDirectory(childPath, dir.name);
    segment.children.push(childSegment);
  }

  return segment;
}

function createEmptySegment(filesystemPath: string, rawPath: string): RouteSegment {
  const isDynamic = rawPath.startsWith('[') && rawPath.endsWith(']') && !rawPath.startsWith('[...') && !rawPath.startsWith('[[...');
  const isCatchAll = rawPath.startsWith('[...') && rawPath.endsWith(']');
  const isOptionalCatchAll = rawPath.startsWith('[[...') && rawPath.endsWith(']]');
  const isRouteGroup = rawPath.startsWith('(') && rawPath.endsWith(')');

  let paramName: string | null = null;
  if (isDynamic) paramName = rawPath.slice(1, -1);
  if (isCatchAll) paramName = rawPath.slice(4, -1);
  if (isOptionalCatchAll) paramName = rawPath.slice(5, -2);

  let groupName: string | null = null;
  if (isRouteGroup) groupName = rawPath.slice(1, -1);

  let finalPath = rawPath;
  if (isRouteGroup) finalPath = '';
  if (isDynamic) finalPath = `:${paramName}`;
  if (isCatchAll || isOptionalCatchAll) finalPath = '*';
  if (finalPath === 'app' || finalPath === '/') finalPath = '/';

  return {
    path: finalPath,
    filesystemPath,
    children: [],
    isDynamic,
    isCatchAll,
    isOptionalCatchAll,
    isRouteGroup,
    paramName,
    groupName,
  };
}
