import type { VertexConfig } from '@snowieedev/vertex-config';

export interface DevServer {
  start(): Promise<void>;
  close(): Promise<void>;
}

export interface DevServerProvider {
  create(cwd: string, config: VertexConfig): Promise<DevServer>;
}
