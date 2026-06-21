import { ProjectBlueprint } from '../types.js';

export class ConfigBuilder {
  build(blueprint: ProjectBlueprint): Map<string, string> {
    const files = new Map<string, string>();

    // tsconfig.json
    if (Object.keys(blueprint.configFragments.tsconfig).length > 0) {
      files.set('tsconfig.json', JSON.stringify(blueprint.configFragments.tsconfig, null, 2));
    }

    // eslint config
    if (Object.keys(blueprint.configFragments.eslint).length > 0) {
      files.set('eslint.config.js', `export default ${JSON.stringify(blueprint.configFragments.eslint, null, 2)};`);
    }

    // tailwind config
    if (blueprint.configFragments.tailwindConfig.length > 0) {
      const mergedContent = blueprint.configFragments.tailwindConfig.join('\n');
      files.set('tailwind.config.ts', mergedContent);
    }

    // vertex.config.ts
    if (blueprint.configFragments.vertexConfig.length > 0) {
      const mergedContent = blueprint.configFragments.vertexConfig.join('\n');
      files.set('vertex.config.ts', mergedContent);
    }

    return files;
  }
}
