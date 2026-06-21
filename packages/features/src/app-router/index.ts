import { Feature } from '@snowieedev/composer';

export const appRouterFeature: Feature = {
  id: 'appRouter',
  displayName: 'App Router',
  description: 'Add App Router file structure',
  folders: ['src/app'],
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
