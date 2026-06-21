import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Vertex Demo App</title>
        <meta charSet="utf-8" />
      </head>
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: 20 }}>
        <header style={{ borderBottom: '1px solid #ccc', paddingBottom: 10, marginBottom: 20 }}>
          <h1>Vertex Framework</h1>
          <nav>
            <a href="/" style={{ marginRight: 10 }}>Home</a>
            <a href="/users/john">User: John</a>
          </nav>
        </header>
        <main>
          {children}
        </main>
        <footer style={{ marginTop: 40, paddingTop: 10, borderTop: '1px solid #ccc', fontSize: '0.8em', color: '#666' }}>
          Built with Vertex Phase 2 Engine
        </footer>
      </body>
    </html>
  );
}
