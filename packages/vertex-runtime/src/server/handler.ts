import { RouteManifest } from '@snowieedev/vertex-core';
import { matchRoute } from '@snowieedev/vertex-router';
import { renderServerTree } from '@snowieedev/vertex-renderer';
import { renderToPipeableStream } from 'react-dom/server';
import { VertexRequestContext } from './context.js';
import { parseCookies } from './cookies.js';
import { SessionStorage } from './session.js';

export interface HandleRequestOptions {
  request: Request;
  manifest: RouteManifest;
  sessionStorage?: SessionStorage;
}

export async function handleRequest(options: HandleRequestOptions): Promise<Response> {
  const { request, manifest, sessionStorage } = options;
  const url = new URL(request.url);

  const matchedRoute = matchRoute(manifest, url.href);
  if (!matchedRoute) {
    return new Response('Not Found', { status: 404 });
  }

  let finalResponse: Response | null = null;
  const session = sessionStorage ? await sessionStorage.getSession(request.headers.get('Cookie')) : null;

  try {
    const cookies = parseCookies(request.headers.get('Cookie'));

    const context: VertexRequestContext = {
      request,
      url,
      params: matchedRoute.params,
      searchParams: url.searchParams,
      cookies,
      session,
    };

    // Load the route modules
    const leafUrl = process.platform === 'win32' 
      ? `file://${matchedRoute.leaf.page!.replace(/\.tsx$/, '.js')}`
      : matchedRoute.leaf.page!.replace(/\.tsx$/, '.js');
    const leafModule = await import(leafUrl);

    // 1. Handle Action for non-GET/HEAD requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      if (leafModule.action) {
        const actionResult = await leafModule.action(context);
        if (actionResult instanceof Response) {
          finalResponse = actionResult;
        }
      }
    }

    // 2. Handle Loader (if action didn't return a Response)
    if (!finalResponse && leafModule.loader) {
      const loaderResult = await leafModule.loader(context);
      if (loaderResult instanceof Response) {
        if (loaderResult.status >= 300 && loaderResult.status < 400) {
          finalResponse = loaderResult;
        } else if (loaderResult.headers.get('Content-Type')?.includes('application/json')) {
           const data = await loaderResult.json();
           (matchedRoute as any).loaderData = data;
        } else {
           finalResponse = loaderResult;
        }
      } else {
        (matchedRoute as any).loaderData = loaderResult;
      }
    }

    // 3. Render HTML Stream if no response has been finalized yet
    if (!finalResponse) {
      const tree = await renderServerTree(matchedRoute, url.href);
      
      const { Transform } = await import('node:stream');
      const transform = new Transform({
        transform(chunk: any, encoding: string, callback: any) {
          callback(null, chunk);
        }
      });
      
      const stream = renderToPipeableStream(tree, {
        bootstrapScripts: [],
        onShellReady() {},
        onAllReady() {},
        onError(err) {
          console.error('Streaming error:', err);
        }
      });

      stream.pipe(transform);

      const readable = new ReadableStream({
        start(controller) {
          transform.on('data', (chunk: any) => controller.enqueue(chunk));
          transform.on('end', () => controller.close());
          transform.on('error', (err: any) => controller.error(err));
        }
      });

      finalResponse = new Response(readable, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Transfer-Encoding': 'chunked'
        }
      });
    }

  } catch (error) {
    if (error instanceof Response) {
      finalResponse = error;
    } else {
      console.error('Unhandled Server Error:', error);
      finalResponse = new Response('Internal Server Error', { status: 500 });
    }
  }

  // 4. Commit session if present
  if (sessionStorage && session) {
    const cookieStr = await sessionStorage.commitSession(session);
    console.log('Committing session cookie:', cookieStr);
    finalResponse.headers.append('Set-Cookie', cookieStr);
    console.log('Final headers:', Array.from(finalResponse.headers.entries()));
  }

  return finalResponse;
}
