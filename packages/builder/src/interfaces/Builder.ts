import type { VertexConfig } from '@snowieedev/vertex-config';

export interface BuildResult {
  durationMs: number;
  warnings: string[];
}

export interface Builder {
  build(): Promise<BuildResult>;
}

export interface BuilderProvider {
  create(cwd: string, config: VertexConfig): Promise<Builder>;
}
