import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAssignment,
  parseDueDate,
  sortByDueDate,
  decorate,
} from '../src/assignments.js';

test('US-01: a complete assignment is accepted and normalised', () => {
  const result = validateAssignment({
    course: '  ENSE701 ',
    title: 'Assignment 1 report',
    weight: '20',
    dueDate: '2026-11-20',
    status: 'todo',
    notes: 'draft first',
  });

  assert.equal(result.valid, true);
  assert.equal(result.value.course, 'ENSE701');
  assert.equal(result.value.title, 'Assignment 1 report');
  assert.equal(result.value.weight, 20);
  assert.equal(result.value.notes, 'draft first');
});

test('US-03: missing course and title are rejected with readable errors', () => {
  const result = validateAssignment({ weight: 20, dueDate: '2026-11-20' });

  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, ['course is required', 'title is required']);
});

test('US-03: weight outside 0-100 is rejected', () => {
  const base = { course: 'ENSE701', title: 'Report', dueDate: '2026-11-20' };

  assert.equal(validateAssignment({ ...base, weight: -1 }).valid, false);
  assert.equal(validateAssignment({ ...base, weight: 101 }).valid, false);
  assert.equal(validateAssignment({ ...base, weight: 'abc' }).valid, false);
  assert.equal(validateAssignment({ ...base, weight: 0 }).valid, true);
  assert.equal(validateAssignment({ ...base, weight: 100 }).valid, true);
});

test('US-03: unknown status is rejected', () => {
  const result = validateAssignment({
    course: 'ENSE701',
    title: 'Report',
    weight: 20,
    dueDate: '2026-11-20',
    status: 'finished',
  });

  assert.equal(result.valid, false);
  assert.match(result.errors.join('; '), /status must be one of/);
});

test('US-03: a malformed due date is rejected', () => {
  assert.equal(parseDueDate('not-a-date'), null);
  assert.equal(parseDueDate(''), null);
  assert.equal(parseDueDate(undefined), null);
  assert.notEqual(parseDueDate('2026-11-20'), null);
});

test('US-03: date-only input is anchored to the end of that day', () => {
  const iso = parseDueDate('2026-11-20');
  const parsed = new Date(iso);

  assert.equal(parsed.getFullYear(), 2026);
  assert.equal(parsed.getMonth(), 10);
  assert.equal(parsed.getDate(), 20);
  assert.equal(parsed.getHours(), 23);
});

test('US-04: open assignments are listed in due-date order', () => {
  const items = [
    { id: 'c', dueDate: '2026-12-01T09:00:00Z', status: 'todo' },
    { id: 'a', dueDate: '2026-11-05T09:00:00Z', status: 'todo' },
    { id: 'b', dueDate: '2026-11-11T09:00:00Z', status: 'doing' },
  ];

  assert.deepEqual(
    sortByDueDate(items).map((item) => item.id),
    ['a', 'b', 'c'],
  );
});

test('US-04: decorate exposes days remaining for the client', () => {
  const now = new Date('2026-11-10T12:00:00Z');
  const decorated = decorate(
    { id: 'a', course: 'ENSE701', title: 'Report', weight: 20, dueDate: '2026-11-13T12:00:00Z', status: 'todo' },
    now,
  );

  assert.equal(decorated.daysRemaining, 3);
});
