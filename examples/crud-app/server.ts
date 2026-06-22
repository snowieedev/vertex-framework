import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRouteManifest } from '@snowieedev/vertex-core';
import { createNodeRequest, sendNodeResponse, handleRequest, createCookieSessionStorage } from '@snowieedev/vertex-runtime';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Set up simple session storage for demo
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'vertex_session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  }
});

async function startServer() {
  const appDir = path.join(__dirname, 'app');
  
  console.log('Scanning routes in', appDir);
  const manifest = await buildRouteManifest(appDir);
  console.log('Manifest loaded successfully!');

  app.all('*', async (req, res) => {
    try {
      const webRequest = await createNodeRequest(req, res);
      
      const response = await handleRequest({
        request: webRequest,
        manifest,
        sessionStorage,
      });

      // If the action modified the session, we need to commit it.
      // But how do we know? For the demo, we assume the user commits inside the action.
      // Wait, in Remix, commitSession returns a string to be set as Set-Cookie.
      // Let's just pass the session into the action and loader, but commit needs to be manual.
      // Or we can commit it automatically if we intercept it here. 
      // For this architecture demo, we'll let the action/loader handle setting the cookie.

      await sendNodeResponse(res, response);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

  app.listen(port, () => {
    console.log(`CRUD Demo running at http://localhost:${port}`);
  });
}

startServer().catch(console.error);
