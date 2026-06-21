# VERTEX Framework

VERTEX is a modern, scalable, and extensible web framework.

## Architecture

VERTEX is built on a provider-based architecture, decoupling the framework logic from underlying implementation details.

- **`@snowieedev/vertex-cli`**: The command-line interface.
- **`@snowieedev/vertex-config`**: Configuration loading and validation.
- **`@snowieedev/vertex-dev-server`**: Development server abstraction (currently Vite).
- **`@snowieedev/vertex-builder`**: Production build system abstraction (currently esbuild).
- **`@snowieedev/vertex-shared`**: Shared utilities and error handling.
- **`create-vertex-app`**: Interactive wizard to scaffold new VERTEX projects.
- **`@snowieedev/vertex-templates`**: Base project templates.

## Development Workflow

1. Clone the repository.
2. Run `pnpm install`.
3. Run `pnpm build` to compile all packages.
4. Test out the CLI via `node packages/cli/dist/index.js doctor`.
5. Scaffold a project using `node packages/create-vertex-app/dist/index.js`.

## Adding Providers

To add a new provider (e.g., Webpack for builder), you can implement the `BuilderProvider` interface and add it to `createBuilder.ts`. The CLI remains completely unaware of the underlying engine.
