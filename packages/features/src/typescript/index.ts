import { Feature } from '@snowieedev/composer';

export const typescriptFeature: Feature = {
  id: 'typescript',
  displayName: 'TypeScript',
  description: 'Add TypeScript support',
  devDependencies: {
    typescript: '^5.0.0',
    '@types/node': '^20.0.0',
  },
  configFragments: {
    tsconfig: {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        baseUrl: '.',
      },
      include: ['src/**/*'],
    },
  },
  folders: ['src', 'src/styles'],
  files: [
    {
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to VERTEX</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23000%22/><text x=%2250%25%22 y=%2255%25%22 font-size=%2250%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22%23fff%22 font-weight=%22bold%22 font-family=%22sans-serif%22>V</text></svg>" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      body {
        margin: 0;
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #09090b;
        color: #fafafa;
        overflow-x: hidden;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/index.ts"></script>
  </body>
</html>
`,
    },
    {
      path: 'src/styles/globals.css',
      content: `/* Default fallback styles if Tailwind is not present */
:root {
  --bg-gradient: radial-gradient(circle at top, #18181b 0%, #09090b 100%);
}
body {
  background: var(--bg-gradient);
  min-height: 100vh;
}
`,
    },
    {
      path: 'src/index.ts',
      content: `import './styles/globals.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  app.innerHTML = \`
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      text-align: center;
      box-sizing: border-box;
      position: relative;
    ">
      <!-- Glow effect -->
      <div style="
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 600px;
        height: 300px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%);
        pointer-events: none;
        z-index: 1;
      "></div>

      <div style="max-width: 640px; z-index: 2;">
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px rgba(255, 255, 255, 0.1) solid;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          margin-bottom: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #a1a1aa;
        ">
          <span style="display: inline-block; width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></span>
          Scaffolded via VERTEX Composer
        </div>

        <h1 style="
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          letter-spacing: -0.05em;
          line-height: 1.1;
          margin: 0 0 1.5rem 0;
          background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        ">
          Welcome to <span style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">VERTEX</span>
        </h1>

        <p style="
          font-size: 1.125rem;
          line-height: 1.6;
          color: #a1a1aa;
          margin: 0 0 2.5rem 0;
        ">
          Your project has been successfully composed with modern developer tooling. Edit <code style="background: rgba(255, 255, 255, 0.1); padding: 0.2rem 0.4rem; border-radius: 4px; color: #f4f4f5; font-family: monospace; font-size: 0.9em;">src/index.ts</code> to start building.
        </p>

        <div style="
          display: flex;
          gap: 1rem;
          justify-content: center;
          align-items: center;
        ">
          <a href="https://github.com/snowieedev/vertex-framework" target="_blank" style="
            background: #ffffff;
            color: #09090b;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: opacity 0.2s;
          ">
            Explore Documentation
          </a>
        </div>
      </div>
    </div>
  \`;
}
`,
    },
  ],
};
