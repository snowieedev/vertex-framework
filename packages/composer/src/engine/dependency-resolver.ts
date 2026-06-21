import { Feature } from '../types.js';

export class DependencyResolver {
  private features: Map<string, Feature>;

  constructor(availableFeatures: Feature[]) {
    this.features = new Map(availableFeatures.map(f => [f.id, f]));
  }

  resolve(selectedFeatureIds: string[]): Feature[] {
    const resolvedIds = new Set<string>();
    const stack = [...selectedFeatureIds];

    while (stack.length > 0) {
      const id = stack.pop()!;
      if (resolvedIds.has(id)) continue;

      const feature = this.features.get(id);
      if (!feature) {
        throw new Error(`Unknown feature: ${id}`);
      }

      resolvedIds.add(id);

      if (feature.dependencies) {
        for (const dep of feature.dependencies) {
          if (!resolvedIds.has(dep) && !stack.includes(dep)) {
            stack.push(dep);
          }
        }
      }
    }

    const resolvedFeatures = Array.from(resolvedIds).map(id => this.features.get(id)!);

    // Check for conflicts
    for (const feature of resolvedFeatures) {
      if (feature.conflicts) {
        for (const conflict of feature.conflicts) {
          if (resolvedIds.has(conflict)) {
            throw new Error(`Conflict detected: Feature "${feature.id}" conflicts with "${conflict}".`);
          }
        }
      }
    }

    return resolvedFeatures;
  }
}
