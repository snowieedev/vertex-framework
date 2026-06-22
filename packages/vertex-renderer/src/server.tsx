import React from 'react';
import { MatchedRoute } from '@snowieedev/vertex-router';
import { RouteSegment } from '@snowieedev/vertex-core';

// Internal type for imported components
type ComponentModule = {
  default: React.ComponentType<any>;
};

export interface ServerRenderOptions {
  loadModule?: (url: string) => Promise<any>;
}

export async function renderServerTree(matchedRoute: MatchedRoute, urlStr: string, options: ServerRenderOptions = {}): Promise<React.ReactElement> {
  const { leaf, layouts, params } = matchedRoute;
  const url = new URL(urlStr, 'http://localhost');
  const searchParams = Object.fromEntries(url.searchParams.entries());

  // 1. Import the page component
  if (!leaf.page) {
    throw new Error(`Matched route ${leaf.path} has no page.tsx`);
  }
  
  // In a real framework, this import would be resolved via an internal bundler manifest.
  // For the architectural phase, we dynamically import the absolute path.
  const isDev = !!options.loadModule;
  const targetExt = isDev ? '.tsx' : '.js';
  const fileUrl = (pathStr: string) => {
    let jsPath = pathStr.replace(/\.tsx$/, targetExt).replace(/\\/g, '/');
    if (!isDev && process.platform === 'win32') {
      jsPath = `file://${jsPath}`;
    }
    return jsPath;
  };
  
  const pageModule: ComponentModule = options.loadModule 
    ? await options.loadModule(fileUrl(leaf.page)) 
    : await import(fileUrl(leaf.page));
  const PageComponent = pageModule.default;
  
  if (!PageComponent) {
    throw new Error(`Page component at ${leaf.page} must be a default export.`);
  }

  // Extract loaderData and actionData if populated by the runtime handler
  const loaderData = (matchedRoute as any).loaderData;
  const actionData = (matchedRoute as any).actionData;

  // 2. Wrap the page with its layouts
  let currentElement = <PageComponent params={params} searchParams={searchParams} loaderData={loaderData} actionData={actionData} />;

  // Iterate backwards through layouts to wrap bottom-up
  for (let i = layouts.length - 1; i >= 0; i--) {
    const layoutNode = layouts[i];
    if (layoutNode.layout) {
      const layoutModule: ComponentModule = options.loadModule
        ? await options.loadModule(fileUrl(layoutNode.layout))
        : await import(fileUrl(layoutNode.layout));
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

export async function renderServerError(matchedRoute: MatchedRoute, error: Error, options: ServerRenderOptions = {}): Promise<React.ReactElement> {
  const { leaf, layouts } = matchedRoute;

  const isDev = !!options.loadModule;
  const targetExt = isDev ? '.tsx' : '.js';
  const fileUrl = (pathStr: string) => {
    let jsPath = pathStr.replace(/\.tsx$/, targetExt).replace(/\\/g, '/');
    if (!isDev && process.platform === 'win32') {
      jsPath = 'file://' + jsPath;
    }
    return jsPath;
  };

  let errorComponentPath = leaf.error;
  if (!errorComponentPath) {
    for (let i = layouts.length - 1; i >= 0; i--) {
      if (layouts[i].error) {
        errorComponentPath = layouts[i].error;
        break;
      }
    }
  }

  if (!errorComponentPath) {
    return React.createElement('div', null, 'Internal Server Error: ', error.message);
  }

  const errorModule: ComponentModule = options.loadModule 
    ? await options.loadModule(fileUrl(errorComponentPath)) 
    : await import(fileUrl(errorComponentPath));
  const ErrorComponent = errorModule.default;

  return React.createElement(ErrorComponent, { error });
}


