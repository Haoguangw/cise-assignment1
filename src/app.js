// HTTP routing for the JSON API. The server module only wires this up to node:http,
// so the API can be exercised in tests against an ephemeral port.

import { validateAssignment, decorateAll, decorate, STATUSES } from './assignments.js';
import { buildIcs } from './ics.js';

const MAX_BODY_BYTES = 32 * 1024;

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('request body too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (raw.trim() === '') return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(Object.assign(new Error('request body must be valid JSON'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

/**
 * @param {{store: import('./store.js').AssignmentStore, clock?: () => Date}} options
 */
export function createApiHandler({ store, clock = () => new Date() }) {
  return async function handle(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const path = url.pathname;

    try {
      if (req.method === 'GET' && path === '/api/health') {
        return sendJson(res, 200, { status: 'ok', time: clock().toISOString() });
      }

      if (req.method === 'GET' && path === '/api/assignments') {
        const now = clock();
        let items = store.all();
        const status = url.searchParams.get('status');
        if (status) {
          if (!STATUSES.includes(status)) {
            return sendJson(res, 400, { error: `status must be one of: ${STATUSES.join(', ')}` });
          }
          items = items.filter((item) => item.status === status);
        }
        return sendJson(res, 200, { assignments: decorateAll(items, now) });
      }

      if (req.method === 'POST' && path === '/api/assignments') {
        const body = await readJsonBody(req);
        const result = validateAssignment(body);
        if (!result.valid) return sendJson(res, 422, { error: 'validation failed', details: result.errors });
        const created = await store.create(result.value);
        return sendJson(res, 201, { assignment: decorate(created, clock()) });
      }

      const match = path.match(/^\/api\/assignments\/([A-Za-z0-9-]+)$/);
      if (match) {
        const id = match[1];
        const existing = store.find(id);
        if (!existing) return sendJson(res, 404, { error: 'assignment not found' });

        if (req.method === 'PATCH') {
          const body = await readJsonBody(req);
          const merged = { ...existing, ...body };
          const result = validateAssignment(merged);
          if (!result.valid) return sendJson(res, 422, { error: 'validation failed', details: result.errors });
          const updated = await store.update(id, result.value);
          return sendJson(res, 200, { assignment: decorate(updated, clock()) });
        }

        if (req.method === 'DELETE') {
          await store.remove(id);
          return sendJson(res, 204, {});
        }

        return sendJson(res, 405, { error: 'method not allowed' });
      }

      if (req.method === 'GET' && path === '/api/export.ics') {
        const now = clock();
        const body = buildIcs(decorateAll(store.all(), now).filter((item) => item.status !== 'done'), now);
        res.writeHead(200, {
          'content-type': 'text/calendar; charset=utf-8',
          'content-disposition': 'attachment; filename="duemate.ics"',
        });
        return res.end(body);
      }

      return sendJson(res, 404, { error: 'not found' });
    } catch (error) {
      const status = error.status ?? 500;
      return sendJson(res, status, { error: error.message ?? 'internal server error' });
    }
  };
}
