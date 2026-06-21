export interface RouteSegment {
  /** The URL segment this node represents (e.g., 'about', ':user', '', or null for route groups) */
  path: string;
  
  /** The absolute filesystem path to the directory of this segment */
  filesystemPath: string;
  
  // Handlers
  /** Absolute path to page.tsx */
  page?: string;
  /** Absolute path to layout.tsx */
  layout?: string;
  /** Absolute path to loading.tsx */
  loading?: string;
  /** Absolute path to error.tsx */
  error?: string;
  /** Absolute path to not-found.tsx */
  notFound?: string;
  
  /** Child segments */
  children: RouteSegment[];
  
  // Segment semantics
  /** Whether this is a dynamic route (e.g. [user]) */
  isDynamic: boolean;
  /** Whether this is a catch-all route (e.g. [...slug]) */
  isCatchAll: boolean;
  /** Whether this is an optional catch-all route (e.g. [[...slug]]) */
  isOptionalCatchAll: boolean;
  /** Whether this is a route group (e.g. (marketing)) */
  isRouteGroup: boolean;
  
  /** The name of the parameter if it's dynamic, catch-all, or optional catch-all */
  paramName: string | null;
  /** The name of the group if it's a route group */
  groupName: string | null;
}

export interface RouteManifest {
  /** The root segment of the application */
  root: RouteSegment;
}

export interface RenderContext {
  url: string;
  manifest: RouteManifest;
  params: Record<string, string | string[]>;
}
