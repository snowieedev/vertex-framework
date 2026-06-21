import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { renderServerTree } from './server.js';
import { MatchedRoute } from '../router/matcher.js';

export interface RenderOptions {
  url: string;
  matchedRoute: MatchedRoute;
  res: import('node:http').ServerResponse;
  clientManifest?: Record<string, string>;
}

export async function renderToStream(options: RenderOptions) {
  const { url, matchedRoute, res } = options;

  try {
    // 1. Build the server component tree (Layouts + Page)
    const tree = await renderServerTree(matchedRoute, url);

    // 2. Wrap in a basic HTML document (in a real framework this would be a RootLayout)
    // We add a minimal HTML shell if the root layout doesn't provide one.
    // For Vertex, we'll assume the root layout provides <html> and <body>.
    // If not, we could inject it here. Let's just stream the tree directly, 
    // expecting the developer to provide a root layout containing <html> and <body>.
    
    // 3. Render and stream
    const stream = renderToPipeableStream(tree, {
      bootstrapScripts: [], // Here we would inject the client bundle script URLs
      onShellReady() {
        res.setHeader('Content-Type', 'text/html');
        stream.pipe(res);
      },
      onShellError(error) {
        console.error('Shell error:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Internal Server Error</h1>');
      },
      onError(error) {
        console.error('Streaming error:', error);
      }
    });

  } catch (error) {
    console.error('Render error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Internal Server Error</h1>');
  }
}
