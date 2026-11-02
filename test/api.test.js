import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { AssignmentStore } from '../src/store.js';
import { createApiHandler } from '../src/app.js';

const FIXED_NOW = new Date('2026-11-10T12:00:00Z');

async function startServer() {
  const dir = await mkdtemp(join(tmpdir(), 'duemate-'));
  const store = new AssignmentStore(join(dir, 'assignments.json'));
  await store.load();
  const handler = createApiHandler({ store, clock: () => FIXED_NOW });
  const server = createServer(handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return {
    base: `http://127.0.0.1:${port}`,
    async close() {
      await new Promise((resolve) => server.close(resolve));
      await rm(dir, { recursive: true, force: true });
    },
  };
}

const sample = {
  course: 'ENSE701',
  title: 'Assignment 1 report',
  weight: 20,
  dueDate: '2026-11-20',
  status: 'todo',
};

test('US-01/US-02: POST creates an assignment and GET returns it with derived fields', async () => {
  const app = await startServer();
  try {
    const created = await fetch(`${app.base}/api/assignments`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(sample),
    });
    assert.equal(created.status, 201);
    const { assignment } = await created.json();
    assert.ok(assignment.id);
    assert.equal(assignment.course, 'ENSE701');
    assert.equal(assignment.urgency, 'upcoming');
    assert.equal(typeof assignment.daysRemaining, 'number');

    const listed = await fetch(`${app.base}/api/assignments`);
    const data = await listed.json();
    assert.equal(listed.status, 200);
    assert.equal(data.assignments.length, 1);
    assert.equal(data.assignments[0].id, assignment.id);
  } finally {
    await app.close();
  }
});

test('US-03: invalid payload returns 422 with field-level details', async () => {
  const app = await startServer();
  try {
    const response = await fetch(`${app.base}/api/assignments`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ course: '', title: '', weight: 240, dueDate: 'nope' }),
    });

    assert.equal(response.status, 422);
    const body = await response.json();
    assert.equal(body.error, 'validation failed');
    assert.ok(body.details.includes('course is required'));
    assert.ok(body.details.some((detail) => detail.startsWith('weight must be')));
  } finally {
    await app.close();
  }
});

test('US-05: PATCH marks an assignment done and DELETE removes it', async () => {
  const app = await startServer();
  try {
    const created = await (
      await fetch(`${app.base}/api/assignments`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(sample),
      })
    ).json();
    const id = created.assignment.id;

    const patched = await fetch(`${app.base}/api/assignments/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'done' }),
    });
    assert.equal(patched.status, 200);
    const updated = await patched.json();
    assert.equal(updated.assignment.status, 'done');
    assert.equal(updated.assignment.urgency, 'done');

    const removed = await fetch(`${app.base}/api/assignments/${id}`, { method: 'DELETE' });
    assert.equal(removed.status, 204);

    const missing = await fetch(`${app.base}/api/assignments/${id}`, { method: 'PATCH' });
    assert.equal(missing.status, 404);
  } finally {
    await app.close();
  }
});

test('US-06: list can be filtered by status', async () => {
  const app = await startServer();
  try {
    for (const status of ['todo', 'done']) {
      await fetch(`${app.base}/api/assignments`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...sample, status }),
      });
    }

    const response = await fetch(`${app.base}/api/assignments?status=done`);
    const data = await response.json();
    assert.equal(data.assignments.length, 1);
    assert.equal(data.assignments[0].status, 'done');

    const bad = await fetch(`${app.base}/api/assignments?status=whatever`);
    assert.equal(bad.status, 400);
  } finally {
    await app.close();
  }
});

test('US-07: overdue assignments are returned first by the API', async () => {
  const app = await startServer();
  try {
    for (const dueDate of ['2026-12-01', '2026-11-05']) {
      await fetch(`${app.base}/api/assignments`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...sample, dueDate }),
      });
    }

    const data = await (await fetch(`${app.base}/api/assignments`)).json();
    assert.equal(data.assignments[0].urgency, 'overdue');
    assert.equal(data.assignments[1].urgency, 'upcoming');
  } finally {
    await app.close();
  }
});
