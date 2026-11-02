// iCalendar (RFC 5545) export, so deadlines can be pushed into a real calendar.

function escapeText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function toIcsDate(isoString) {
  return new Date(isoString).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

/**
 * @param {Array<{id:string,title:string,course:string,dueDate:string,notes?:string}>} assignments
 * @param {Date} now
 * @returns {string} a VCALENDAR document with one VEVENT per assignment
 */
export function buildIcs(assignments, now = new Date()) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DueMate//Assignment Tracker//EN',
    'CALSCALE:GREGORIAN',
  ];

  for (const item of assignments) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${item.id}@duemate.local`,
      `DTSTAMP:${toIcsDate(now.toISOString())}`,
      `DTSTART:${toIcsDate(item.dueDate)}`,
      `DTEND:${toIcsDate(item.dueDate)}`,
      `SUMMARY:${escapeText(`${item.course}: ${item.title}`)}`,
      `DESCRIPTION:${escapeText(item.notes ?? '')}`,
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}
