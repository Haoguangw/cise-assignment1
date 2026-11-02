import test from 'node:test';
import assert from 'node:assert/strict';
import { buildIcs } from '../src/ics.js';

test('US-08: calendar export contains one event per assignment with CRLF endings', () => {
  const now = new Date('2026-11-10T12:00:00Z');
  const ics = buildIcs(
    [
      {
        id: 'abc',
        course: 'ENSE701',
        title: 'Assignment 1; report, final',
        dueDate: '2026-11-20T23:59:00.000Z',
        notes: 'line one\nline two',
      },
    ],
    now,
  );

  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /END:VCALENDAR\r\n$/);
  assert.match(ics, /UID:abc@duemate\.local/);
  assert.match(ics, /DTSTART:20261120T235900Z/);
  assert.match(ics, /SUMMARY:ENSE701: Assignment 1\\; report\\, final/);
  assert.match(ics, /DESCRIPTION:line one\\nline two/);
});
