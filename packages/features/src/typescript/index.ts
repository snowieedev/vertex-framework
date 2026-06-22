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
        background: #ffffff;
        color: #000000;
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
  --bg-color: #ffffff;
}
body {
  background: var(--bg-color);
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
    <!-- Main container centering everything -->
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      text-align: center;
      font-family: sans-serif;
    ">
      
      <!-- Main Heading -->
      <h1 style="
        font-size: 3rem;
        font-weight: 800;
        margin: 0 0 1rem 0;
        color: #000000;
      ">
        Welcome to VERTEX
      </h1>

      <!-- Description/Instructions -->
      <p style="
        font-size: 1.125rem;
        color: #555555;
        margin: 0 0 2rem 0;
      ">
        Get started by editing <code style="background: #f4f4f5; padding: 0.2rem 0.4rem; border-radius: 4px; color: #000; font-family: monospace;">src/index.ts</code>
      </p>

      <!-- Action Button -->
      <a href="https://github.com/snowieedev/vertex-framework" target="_blank" style="
        background: #000000;
        color: #ffffff;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        font-weight: 600;
        text-decoration: none;
      ">
        Read Documentation
      </a>

    </div>
  \`;
}
`,
    },
  ],
};
