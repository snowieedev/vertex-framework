import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRouteManifest, matchRoute, renderToStream } from '@snowieedev/vertex';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3001;
async function startServer() {
    const appDir = path.join(__dirname, 'app');
    console.log('Scanning routes in', appDir);
    const manifest = await buildRouteManifest(appDir);
    console.log('Manifest loaded successfully!');
    app.get('*', async (req, res) => {
        const url = `http://localhost:${port}${req.url}`;
        const matchedRoute = matchRoute(manifest, url);
        if (!matchedRoute) {
            res.status(404).send('<h1>404 - Not Found</h1><p>No route matched.</p>');
            return;
        }
        await renderToStream({
            url,
            matchedRoute,
            res
        });
    });
    app.listen(port, () => {
        console.log(`Vertex Demo running at http://localhost:${port}`);
    });
}
startServer().catch(console.error);
