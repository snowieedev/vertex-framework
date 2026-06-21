import { viteProvider } from './providers/vite/index.js';
import type { DevServer, DevServerProvider } from './interfaces/DevServer.js';
import type { VertexConfig } from '@snowieedev/vertex-config';

export type ProviderType = 'vite';

const providers: Record<ProviderType, DevServerProvider> = {
  vite: viteProvider,
};

export async function createServer(
  providerType: ProviderType,
  cwd: string,
  config: VertexConfig
): Promise<DevServer> {
  const provider = providers[providerType];
  if (!provider) {
    throw new Error(`Unknown dev server provider: ${providerType}`);
  }

  return provider.create(cwd, config);
}
