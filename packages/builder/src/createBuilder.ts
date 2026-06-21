import { esbuildProvider } from './providers/esbuild/index.js';
import type { Builder, BuilderProvider } from './interfaces/Builder.js';
import type { VertexConfig } from '@snowieedev/vertex-config';

export type ProviderType = 'esbuild';

const providers: Record<ProviderType, BuilderProvider> = {
  esbuild: esbuildProvider,
};

export async function createBuilder(
  providerType: ProviderType,
  cwd: string,
  config: VertexConfig
): Promise<Builder> {
  const provider = providers[providerType];
  if (!provider) {
    throw new Error(`Unknown builder provider: ${providerType}`);
  }

  return provider.create(cwd, config);
}
