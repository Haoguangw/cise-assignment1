// Domain rules for DueMate assignments.
// Kept free of I/O so the rules can be unit tested without a server or a database.

export const STATUSES = ['todo', 'doing', 'done'];

const MAX_NOTE_LENGTH = 500;

/**
 * Validate and normalise raw client input.
 * @param {object} input
 * @returns {{valid: boolean, errors: string[], value: object}}
 */
export function validateAssignment(input = {}) {
  const errors = [];

  const course = typeof input.course === 'string' ? input.course.trim() : '';
  if (course.length === 0) errors.push('course is required');
  if (course.length > 80) errors.push('course must be 80 characters or fewer');

  const title = typeof input.title === 'string' ? input.title.trim() : '';
  if (title.length === 0) errors.push('title is required');
  if (title.length > 120) errors.push('title must be 120 characters or fewer');

  const weight = Number(input.weight);
  if (!Number.isFinite(weight)) errors.push('weight must be a number');
  else if (weight < 0 || weight > 100) errors.push('weight must be between 0 and 100');

  const dueDate = parseDueDate(input.dueDate);
  if (dueDate === null) errors.push('dueDate must be a valid date (YYYY-MM-DD or ISO 8601)');

  const status = input.status === undefined ? 'todo' : input.status;
  if (!STATUSES.includes(status)) errors.push(`status must be one of: ${STATUSES.join(', ')}`);

  const notes = typeof input.notes === 'string' ? input.notes.trim() : '';
  if (notes.length > MAX_NOTE_LENGTH) errors.push(`notes must be ${MAX_NOTE_LENGTH} characters or fewer`);

  return {
    valid: errors.length === 0,
    errors,
    value: {
      course,
      title,
      weight: Number.isFinite(weight) ? weight : 0,
      dueDate,
      status,
      notes,
    },
  };
}

/**
 * Accept "YYYY-MM-DD" (interpreted as end of that day, local time) or a full ISO timestamp.
 * @param {unknown} raw
 * @returns {string|null} normalised ISO string, or null when unparseable
 */
export function parseDueDate(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return null;
  const text = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const date = new Date(`${text}T23:59:00`);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/**
 * Display order: earliest deadline first.
 * @param {Array} assignments
 */
export function sortByDueDate(assignments) {
  return [...assignments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

/**
 * Add derived, read-only fields used by the API and the browser client.
 */
export function decorate(assignment, now = new Date()) {
  const remaining = new Date(assignment.dueDate).getTime() - now.getTime();
  return {
    ...assignment,
    daysRemaining: Math.ceil(remaining / (24 * 60 * 60 * 1000)),
  };
}

export function decorateAll(assignments, now = new Date()) {
  return sortByDueDate(assignments).map((item) => decorate(item, now));
}
