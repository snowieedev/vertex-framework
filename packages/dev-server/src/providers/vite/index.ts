import { createServer as createViteServer } from 'vite';
import { logger } from '@snowieedev/vertex-shared';
import type { DevServer, DevServerProvider } from '../../interfaces/DevServer.js';
import type { VertexConfig } from '@snowieedev/vertex-config';

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
      // Note: in a real implementation we'd load user plugins or framework-specific Vite plugins here
      plugins: [],
    });

    return new ViteDevServer(viteServer);
  }
};
