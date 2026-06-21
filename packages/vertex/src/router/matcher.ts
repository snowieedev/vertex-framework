import { RouteManifest, RouteSegment } from '../types/index.js';

export interface MatchedRoute {
  leaf: RouteSegment;
  layouts: RouteSegment[];
  params: Record<string, string | string[]>;
}

export function matchRoute(manifest: RouteManifest, url: string): MatchedRoute | null {
  const urlPath = new URL(url, 'http://localhost').pathname;
  // split and remove empty segments
  const segments = urlPath.split('/').filter(Boolean);

  const layouts: RouteSegment[] = [];
  const params: Record<string, string | string[]> = {};

  const match = matchNode(manifest.root, segments, layouts, params);
  
  if (!match) return null;

  return {
    leaf: match,
    layouts,
    params,
  };
}

function matchNode(
  node: RouteSegment,
  remainingUrlSegments: string[],
  layouts: RouteSegment[],
  params: Record<string, string | string[]>
): RouteSegment | null {
  if (node.layout) {
    layouts.push(node);
  }

  // If we have no remaining segments, this node must have a page to match exactly
  // UNLESS it's a route group or optional catch-all, but let's handle that carefully.
  if (remainingUrlSegments.length === 0) {
    // If this node has a page, we found a match.
    if (node.page) {
      return node;
    }
    
    // Otherwise, we might need to check if there are index children or route groups that have a page
    for (const child of node.children) {
      if (child.isRouteGroup || (child.isOptionalCatchAll && child.path === '*')) {
        const result = matchNode(child, remainingUrlSegments, layouts, params);
        if (result) return result;
      }
      // Check for an explicit index path? path === '/' is handled as empty segment conceptually, 
      // but in our scanner path === '/' or path === '' depends on the folder.
      if (child.path === '/' || child.path === '') {
         const result = matchNode(child, remainingUrlSegments, layouts, params);
         if (result) return result;
      }
    }
    
    // Backtrack layouts if no match found here
    if (node.layout) layouts.pop();
    return null;
  }

  const currentSegment = remainingUrlSegments[0];

  for (const child of node.children) {
    // 1. Exact match
    if (child.path === currentSegment) {
      const result = matchNode(child, remainingUrlSegments.slice(1), layouts, params);
      if (result) return result;
    }

    // 2. Dynamic match
    if (child.isDynamic && child.paramName) {
      params[child.paramName] = currentSegment;
      const result = matchNode(child, remainingUrlSegments.slice(1), layouts, params);
      if (result) return result;
      delete params[child.paramName];
    }

    // 3. Route group (doesn't consume URL segment)
    if (child.isRouteGroup) {
      const result = matchNode(child, remainingUrlSegments, layouts, params);
      if (result) return result;
    }

    // 4. Catch All
    if (child.isCatchAll && child.paramName) {
      params[child.paramName] = [...remainingUrlSegments];
      // Catch-all consumes all remaining segments, so it must have a page to be a leaf
      if (child.page) {
         if (child.layout) layouts.push(child);
         return child;
      }
      // If it has children (rare for catch-all but possible), try them
      const result = matchNode(child, [], layouts, params);
      if (result) return result;
      delete params[child.paramName];
    }

    // 5. Optional Catch All
    if (child.isOptionalCatchAll && child.paramName) {
      params[child.paramName] = [...remainingUrlSegments];
      if (child.page) {
         if (child.layout) layouts.push(child);
         return child;
      }
      const result = matchNode(child, [], layouts, params);
      if (result) return result;
      delete params[child.paramName];
    }
  }

  if (node.layout) layouts.pop();
  return null;
}
