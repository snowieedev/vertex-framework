import { ProjectBlueprint } from '../types.js';

export class PackageBuilder {
  build(blueprint: ProjectBlueprint): string {
    const pkg = { ...blueprint.configFragments.packageJson };
    
    // Merge dependencies
    if (Object.keys(blueprint.dependencies).length > 0) {
      pkg.dependencies = {
        ...pkg.dependencies,
        ...blueprint.dependencies,
      };
      pkg.dependencies = this.sortObject(pkg.dependencies as Record<string, string>);
    }

    // Merge devDependencies
    if (Object.keys(blueprint.devDependencies).length > 0) {
      pkg.devDependencies = {
        ...pkg.devDependencies,
        ...blueprint.devDependencies,
      };
      pkg.devDependencies = this.sortObject(pkg.devDependencies as Record<string, string>);
    }

    return JSON.stringify(pkg, null, 2);
  }

  private sortObject(obj: Record<string, string>): Record<string, string> {
    return Object.keys(obj)
      .sort()
      .reduce((res, key) => {
        res[key] = obj[key];
        return res;
      }, {} as Record<string, string>);
  }
}
