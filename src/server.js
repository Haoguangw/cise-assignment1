// Entry point: serves the static client and delegates /api/* to the API handler.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AssignmentStore } from './store.js';
import { createApiHandler } from './app.js';

const here = fileURLToPath(new URL('.', import.meta.url));
const publicDir = resolve(here, '..', 'public');
const dataFile = process.env.DUEMATE_DATA ?? resolve(here, '..', 'data', 'assignments.json');
const port = Number(process.env.PORT ?? 3000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const store = new AssignmentStore(dataFile);
await store.load();

const api = createApiHandler({ store });

const server = createServer(async (req, res) => {
  if (req.url.startsWith('/api/')) return api(req, res);

  const requested = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = join(publicDir, normalize(requested).replace(/^([/\\])+/, ''));

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403).end('forbidden');
    return;
  }

  try {
    const body = await readFile(filePath);
    res.writeHead(200, { 'content-type': MIME[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('not found');
  }
});

server.listen(port, () => {
  console.log(`DueMate running at http://localhost:${port}`);
  console.log(`Data file: ${dataFile}`);
});
