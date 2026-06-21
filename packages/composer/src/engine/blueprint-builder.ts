import { Feature, ProjectBlueprint, ProjectConfiguration } from '../types.js';
import deepmerge from 'deepmerge';

export class BlueprintBuilder {
  build(config: ProjectConfiguration, resolvedFeatures: Feature[]): ProjectBlueprint {
    const blueprint: ProjectBlueprint = {
      folders: [],
      files: new Map(),
      dependencies: {},
      devDependencies: {},
      configFragments: {
        packageJson: {
          name: config.name,
          version: '0.1.0',
          private: true,
          scripts: {},
        },
        tsconfig: {},
        vertexConfig: [],
        tailwindConfig: [],
        eslint: {},
      },
      postInstallHooks: [],
    };

    for (const feature of resolvedFeatures) {
      if (feature.folders) {
        blueprint.folders.push(...feature.folders);
      }

      if (feature.files) {
        for (const file of feature.files) {
          blueprint.files.set(file.path, file.content);
        }
      }

      if (feature.npmDependencies) {
        Object.assign(blueprint.dependencies, feature.npmDependencies);
      }

      if (feature.devDependencies) {
        Object.assign(blueprint.devDependencies, feature.devDependencies);
      }

      if (feature.configFragments) {
        if (feature.configFragments.packageJson) {
          blueprint.configFragments.packageJson = deepmerge(
            blueprint.configFragments.packageJson,
            feature.configFragments.packageJson
          );
        }
        if (feature.configFragments.tsconfig) {
          blueprint.configFragments.tsconfig = deepmerge(
            blueprint.configFragments.tsconfig,
            feature.configFragments.tsconfig
          );
        }
        if (feature.configFragments.eslint) {
          blueprint.configFragments.eslint = deepmerge(
            blueprint.configFragments.eslint,
            feature.configFragments.eslint
          );
        }
        if (feature.configFragments.vertexConfig) {
          blueprint.configFragments.vertexConfig.push(feature.configFragments.vertexConfig);
        }
        if (feature.configFragments.tailwindConfig) {
          blueprint.configFragments.tailwindConfig.push(feature.configFragments.tailwindConfig);
        }
      }

      if (feature.postInstall) {
        blueprint.postInstallHooks.push(feature.postInstall);
      }
    }

    // Deduplicate folders
    blueprint.folders = Array.from(new Set(blueprint.folders));

    return blueprint;
  }
}
