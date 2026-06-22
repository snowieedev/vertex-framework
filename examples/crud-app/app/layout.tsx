import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vertex CRUD App</title>
        <style>{`
          body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
          .message { padding: 1rem; background: #e0ffe0; border: 1px solid #00aa00; margin-bottom: 1rem; }
          .error { padding: 1rem; background: #ffe0e0; border: 1px solid #aa0000; margin-bottom: 1rem; }
          form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
          input { padding: 0.5rem; flex-grow: 1; }
          button { padding: 0.5rem 1rem; cursor: pointer; }
          ul { list-style: none; padding: 0; }
          li { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; }
        `}</style>
      </head>
      <body>
        <h1>Vertex CRUD Demo</h1>
        {children}
      </body>
    </html>
  );
}
