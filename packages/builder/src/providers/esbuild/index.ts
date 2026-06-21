import * as esbuild from 'esbuild';
import path from 'node:path';
import fs from 'node:fs';
import { logger } from '@snowieedev/vertex-shared';
import type { Builder, BuilderProvider, BuildResult } from '../../interfaces/Builder.js';
import type { VertexConfig } from '@snowieedev/vertex-config';

export class EsbuildBuilder implements Builder {
  constructor(private cwd: string, private config: VertexConfig) {}

  async build(): Promise<BuildResult> {
    const startTime = performance.now();
    const entryPoint = path.resolve(this.cwd, 'src/index.ts'); // Simplification for Phase 1
    
    // In Phase 1, we'll try to find a few common entry points, or error if missing.
    // In later phases, we'd integrate App Router, file-system routing, etc.
    const possibleEntries = ['src/index.ts', 'src/index.tsx', 'src/main.ts', 'src/main.tsx'];
    let finalEntry = entryPoint;
    let entryFound = false;

    for (const entry of possibleEntries) {
      if (fs.existsSync(path.resolve(this.cwd, entry))) {
        finalEntry = path.resolve(this.cwd, entry);
        entryFound = true;
        break;
      }
    }

    if (!entryFound) {
      logger.warn(`No entry point found (searched ${possibleEntries.join(', ')}).`);
      return { durationMs: 0, warnings: ['No entry point found'] };
    }

    const outdir = path.resolve(this.cwd, 'dist');

    try {
      const result = await esbuild.build({
        entryPoints: [finalEntry],
        outdir,
        bundle: true,
        minify: true,
        sourcemap: true,
        target: 'es2022',
        format: 'esm',
        // Example base path logic
        publicPath: this.config.base || '/',
        metafile: true,
      });

      const durationMs = performance.now() - startTime;
      const warnings = result.warnings.map(w => w.text);

      logger.success(`Build completed in ${durationMs.toFixed(2)}ms`);
      
      return { durationMs, warnings };
    } catch (error) {
      throw new Error(`Esbuild failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export const esbuildProvider: BuilderProvider = {
  async create(cwd: string, config: VertexConfig): Promise<Builder> {
    return new EsbuildBuilder(cwd, config);
  }
};
