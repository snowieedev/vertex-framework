import React from 'react';
import { MatchedRoute } from '../router/matcher.js';
import { RouteSegment } from '../types/index.js';

// Internal type for imported components
type ComponentModule = {
  default: React.ComponentType<any>;
};

export async function renderServerTree(matchedRoute: MatchedRoute, url: string): Promise<React.ReactElement> {
  const { leaf, layouts, params } = matchedRoute;

  // 1. Import the page component
  if (!leaf.page) {
    throw new Error(`Matched route ${leaf.path} has no page.tsx`);
  }
  
  // In a real framework, this import would be resolved via an internal bundler manifest.
  // For the architectural phase, we dynamically import the absolute path.
  const fileUrl = (pathStr: string) => {
    const jsPath = pathStr.replace(/\.tsx$/, '.js');
    return process.platform === 'win32' ? `file://${jsPath}` : jsPath;
  };
  
  const pageModule: ComponentModule = await import(fileUrl(leaf.page));
  const PageComponent = pageModule.default;
  
  if (!PageComponent) {
    throw new Error(`Page component at ${leaf.page} must be a default export.`);
  }

  // 2. Wrap the page with its layouts
  let currentElement = <PageComponent params={params} searchParams={{}} />;

  // Iterate backwards through layouts to wrap bottom-up
  for (let i = layouts.length - 1; i >= 0; i--) {
    const layoutNode = layouts[i];
    if (layoutNode.layout) {
      const layoutModule: ComponentModule = await import(fileUrl(layoutNode.layout));
      const LayoutComponent = layoutModule.default;
      
      if (!LayoutComponent) {
        throw new Error(`Layout component at ${layoutNode.layout} must be a default export.`);
      }

      currentElement = (
        <LayoutComponent params={params}>
          {currentElement}
        </LayoutComponent>
      );
    }
  }

  return currentElement;
}
