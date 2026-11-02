# Product backlog — DueMate v1

Prioritised with MoSCoW. Every story has testable acceptance criteria in
Given/When/Then form so that "done" is not a matter of opinion.

**Iteration 1 goal:** a student can record assignments and see what is coming.
**Iteration 2 goal:** deadline risk becomes visible at a glance, with quality evidence.

| ID    | User story | Priority | Iteration | Acceptance criteria (Given / When / Then) | Status |
| ----- | ---------- | -------- | --------- | ----------------------------------------- | ------ |
| US-01 | As a student, I want to add an assignment with course, title, due date and weight, so that I have one list instead of four browser tabs. | Must | 1 | **Given** valid input, **when** I submit the form, **then** a `201` is returned with a generated `id` and the record is persisted. | Done |
| US-02 | As a student, I want the list ordered by deadline and to see how many days are left, so that I know what is next. | Must | 1 | **Given** three assignments with different due dates, **when** I request the list, **then** they are returned earliest-first and each carries `daysRemaining`. | Done |
| US-03 | As a student, I want clear validation messages, so that I can fix a bad entry without guessing. | Must | 1 | **Given** a missing course or title, a weight outside 0–100, an unknown status or an unparseable date, **when** I submit, **then** a `422` is returned listing each field error. | Done |
| US-04 | As a student, I want overdue and soon-due work to stand out and sort first, so that I do not miss a deadline by reading the list top-down. | Should | 2 | **Given** a mix of overdue, due-within-72h, upcoming and done items, **when** I request the list, **then** the order is overdue → due-soon → upcoming → done and each item exposes `urgency`. | Done (trial change) |
| US-05 | As a student, I want to mark an assignment done, reopen it, or delete it, so that the list stays truthful. | Must | 1 | **Given** an existing assignment, **when** I `PATCH` its status, **then** the stored status changes; **when** I `DELETE` it, **then** a subsequent `PATCH` returns `404`. | Done |
| US-06 | As a student, I want to filter by status, so that finished work does not hide current work. | Should | 1 | **Given** one todo and one done assignment, **when** I request `?status=done`, **then** only the done one is returned; an unknown status returns `400`. | Done |
| US-07 | As a student, I want to export open deadlines to my calendar, so that reminders come from the tool I already use. | Should | 1 | **Given** open assignments, **when** I request `/api/export.ics`, **then** a valid VCALENDAR is returned with one VEVENT per open assignment and no completed ones. | Done |
| US-08 | As a student, I want to remove a typo without deleting and re-adding the record. | Could | 2 | **Given** an existing assignment, **when** I `PATCH` a single field, **then** the other fields are unchanged. | Backlog |
| US-09 | As a student, I want to search by course code, so that I can focus on one paper. | Could | 2 | **Given** assignments from two courses, **when** I search `ENSE`, **then** only ENSE701 rows are returned. | Backlog |
| US-10 | As a student, I want a reminder before the deadline. | Won't (this release) | — | Out of scope: needs a scheduler and notification channel. | Out of scope |

## Out of scope for this release

- User accounts and multi-user access (single-user, local data file).
- Push or email reminders.
- Native mobile application.
- Collaborative features (sharing a list with a study group).

## Definition of done

1. Acceptance criteria covered by at least one automated test.
2. `npm test` green locally and in CI (Node 20, 22 and 24).
3. Traceability row added to `docs/traceability.md`.
4. README or API documentation updated when behaviour changes.
5. Self-review completed against the checklist in `docs/review-record.md`.
