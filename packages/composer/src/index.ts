import { Feature, ProjectConfiguration } from './types.js';
import { DependencyResolver } from './engine/dependency-resolver.js';
import { BlueprintBuilder } from './engine/blueprint-builder.js';
import { Executor } from './engine/executor.js';

export * from './types.js';

export class Composer {
  private availableFeatures: Feature[] = [];

  registerFeature(feature: Feature) {
    this.availableFeatures.push(feature);
  }

  registerFeatures(features: Feature[]) {
    this.availableFeatures.push(...features);
  }

  async compose(targetDir: string, config: ProjectConfiguration) {
    const resolver = new DependencyResolver(this.availableFeatures);
    const resolvedFeatures = resolver.resolve(config.features);

    const builder = new BlueprintBuilder();
    const blueprint = builder.build(config, resolvedFeatures);

    const executor = new Executor();
    await executor.execute(targetDir, config, blueprint);
  }
}
