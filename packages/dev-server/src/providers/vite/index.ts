import { createServer as createViteServer } from 'vite';
import { logger } from '@snowieedev/vertex-shared';
import type { DevServer, DevServerProvider } from '../../interfaces/DevServer.js';
import type { VertexConfig } from '@snowieedev/vertex-config';
import { buildRouteManifest } from '@snowieedev/vertex-core';
import { matchRoute } from '@snowieedev/vertex-router';
import { createNodeRequest, sendNodeResponse } from '@snowieedev/vertex-runtime/server';
import path from 'node:path';

export class ViteDevServer implements DevServer {
  constructor(private viteServer: Awaited<ReturnType<typeof createViteServer>>) {}

  async start(): Promise<void> {
    await this.viteServer.listen();
    this.viteServer.printUrls();
    logger.success('Vite dev server started');
  }

  async close(): Promise<void> {
    await this.viteServer.close();
  }
}

export const viteProvider: DevServerProvider = {
  async create(cwd: string, config: VertexConfig): Promise<DevServer> {
    const viteServer = await createViteServer({
      root: cwd,
      base: config.base || '/',
      server: {
        port: config.port || 3000,
      },
      esbuild: {
        jsx: 'automatic',
      },
      ssr: {
        noExternal: ['@snowieedev/vertex-runtime', '@snowieedev/vertex-renderer', '@snowieedev/vertex-router']
      },
      plugins: [
        {
          name: 'vertex-runtime-resolve-tsx',
          enforce: 'pre',
          async resolveId(source, importer, options) {
            if (options.ssr && source.endsWith('.js')) {
              const fs = await import('node:fs');
              const tsxSource = source.replace(/\.js$/, '.tsx');
              const resolution = await this.resolve(tsxSource, importer, { skipSelf: true, ...options });
              if (resolution && resolution.id && fs.existsSync(resolution.id)) {
                return resolution;
              }
              const tsSource = source.replace(/\.js$/, '.ts');
              const resolutionTs = await this.resolve(tsSource, importer, { skipSelf: true, ...options });
              if (resolutionTs && resolutionTs.id && fs.existsSync(resolutionTs.id)) {
                return resolutionTs;
              }
            }
            return null;
          }
        },
        {
          name: 'vertex-runtime-middleware',
          configureServer(server) {
            // Note: NOT returning a function here injects this middleware BEFORE Vite's internal SPA fallback middleware!
            server.middlewares.use(async (req, res, next) => {
              try {
                const host = req.headers.host || 'localhost';
                const protocol = req.socket && (req.socket as any).encrypted ? 'https' : 'http';
                const url = new URL(req.url || '/', `${protocol}://${host}`);
                console.log(`[Vertex Middleware] Request to: ${url.href}`);
                
                // Rebuild manifest on each request in dev mode to pick up new routes
                let appDir = path.join(cwd, 'src', 'app');
                const fs = await import('node:fs');
                if (!fs.existsSync(appDir)) {
                  appDir = path.join(cwd, 'app');
                }
                const manifest = await buildRouteManifest(appDir);
                console.log(`[Vertex Middleware] Built manifest for ${appDir}. Root children count: ${manifest.root.children.length}`);
                
                const matchedRoute = matchRoute(manifest, url.pathname);
                if (!matchedRoute) {
                  console.log(`[Vertex Middleware] No route match for ${url.href}, skipping to next.`);
                  return next();
                }
                console.log(`[Vertex Middleware] Matched route: ${matchedRoute.leaf.path}`);
                
                const runtime = await server.ssrLoadModule('@snowieedev/vertex-runtime/server');
                
                // Create a default session storage for dev
                const sessionStorage = runtime.createCookieSessionStorage({
                  cookie: {
                    name: '__session',
                    secrets: ['secret'],
                    sameSite: 'lax',
                    path: '/',
                    httpOnly: true
                  }
                });

                const webReq = await createNodeRequest(req, res);
                const webRes = await runtime.handleRequest({
                  request: webReq,
                  manifest,
                  sessionStorage,
                  loadModule: (url: string) => server.ssrLoadModule(url)
                });
                
                if (webRes.status === 404) {
                  return next();
                }
                
                await sendNodeResponse(res, webRes);
              } catch (err) {
                console.error('Vertex Runtime Error:', err);
                next(err);
              }
            });
          }
        }
      ],
    });

    return new ViteDevServer(viteServer);
  }
};
