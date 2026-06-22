import type { IncomingMessage, ServerResponse } from 'node:http';

export async function createNodeRequest(req: IncomingMessage, res: ServerResponse): Promise<Request> {
  const origin = req.headers.host 
    ? `http://${req.headers.host}` 
    : 'http://localhost';
  
  const url = new URL(req.url || '/', origin);

  const init: RequestInit = {
    method: req.method,
    headers: createHeaders(req.headers),
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const { Readable } = await import('node:stream');
    init.body = Readable.toWeb ? Readable.toWeb(req) as any : new ReadableStream({
      start(controller) {
        req.on('data', chunk => controller.enqueue(chunk));
        req.on('end', () => controller.close());
        req.on('error', err => controller.error(err));
      }
    });
    // Duplicate internal Request initialization requires `duplex: 'half'` for streams in Node 18 fetch
    (init as any).duplex = 'half';
  }

  return new Request(url.href, init);
}

function createHeaders(nodeHeaders: IncomingMessage['headers']): Headers {
  const headers = new Headers();
  for (const [key, values] of Object.entries(nodeHeaders)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }
  return headers;
}

export async function sendNodeResponse(res: ServerResponse, webResponse: Response): Promise<void> {
  res.statusCode = webResponse.status;
  res.statusMessage = webResponse.statusText;

  for (const [key, value] of webResponse.headers.entries()) {
    // Append instead of set to handle multiple headers like Set-Cookie
    if (key.toLowerCase() === 'set-cookie') {
      // In Fetch API Headers, Set-Cookie is technically joined by ", " but that breaks cookies.
      // We will parse the raw array using getSetCookie if available
      if (typeof webResponse.headers.getSetCookie === 'function') {
        res.setHeader(key, webResponse.headers.getSetCookie());
      } else {
        // Fallback for older environments
        res.setHeader(key, value);
      }
    } else {
      res.setHeader(key, value);
    }
  }

  if (webResponse.body) {
    const { Readable } = await import('node:stream');
    if (Readable.fromWeb) {
      const nodeReadable = Readable.fromWeb(webResponse.body as any);
      nodeReadable.pipe(res);
    } else {
      // Fallback manual read
      const reader = webResponse.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    }
  } else {
    res.end();
  }
}
