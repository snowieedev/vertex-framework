import { Feature } from '@snowieedev/composer';

export const appRouterFeature: Feature = {
  id: 'appRouter',
  displayName: 'App Router',
  description: 'Add App Router file structure',
  folders: ['src/app'],
  npmDependencies: {
    'react': '^19.0.0',
    'react-dom': '^19.0.0',
    '@snowieedev/vertex-core': 'latest',
    '@snowieedev/vertex-router': 'latest',
    '@snowieedev/vertex-renderer': 'latest',
    '@snowieedev/vertex-runtime': 'latest'
  },
  devDependencies: {
    '@types/react': '^19.0.0',
    '@types/react-dom': '^19.0.0'
  },
  files: [
    {
      path: 'src/app/page.tsx',
      content: `export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello VERTEX with App Router</h1>
    </main>
  );
}
`,
    },
    {
      path: 'src/app/layout.tsx',
      content: `export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`,
    }
  ],
};
