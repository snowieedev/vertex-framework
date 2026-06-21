export interface Feature {
  id: string;
  displayName: string;
  description?: string;
  
  dependencies?: string[];
  optionalDependencies?: string[];
  conflicts?: string[];
  
  npmDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  
  files?: Array<{
    path: string;
    content: string;
  }>;
  
  // Folders to ensure exist
  folders?: string[];
  
  // Fragments of configuration that the builders will merge
  configFragments?: {
    packageJson?: Record<string, any>;
    tsconfig?: Record<string, any>;
    vertexConfig?: string; // TS code fragment
    tailwindConfig?: string;
    eslint?: Record<string, any>;
  };
  
  // Hook to run after installation (e.g., git init, or specific file creations that depend on others)
  postInstall?: (context: { targetDir: string; packageManager: string }) => Promise<void>;
}

export interface ProjectConfiguration {
  name: string;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  features: string[]; // List of selected feature IDs
}

export interface ProjectBlueprint {
  folders: string[];
  files: Map<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  configFragments: {
    packageJson: Record<string, any>;
    tsconfig: Record<string, any>;
    vertexConfig: string[];
    tailwindConfig: string[];
    eslint: Record<string, any>;
  };
  postInstallHooks: Array<(context: { targetDir: string; packageManager: string }) => Promise<void>>;
}
