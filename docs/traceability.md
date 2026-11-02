# Traceability matrix

Every requirement traces forwards to the code that implements it and the test
that proves it; every test traces back to a requirement. Rows are added in the
same commit as the change (see the Definition of Done in `docs/backlog.md`).

| Requirement | Implementation | Automated test | Commit |
| ----------- | -------------- | -------------- | ------ |
| US-01 Add assignment | `src/assignments.js` (`validateAssignment`), `src/app.js` (`POST /api/assignments`), `src/store.js` (`create`) | `test/assignments.test.js` — "US-01: a complete assignment is accepted and normalised"; `test/api.test.js` — "US-01/US-02: POST creates an assignment and GET returns it with derived fields" | `4a912a1` |
| US-02 Order by deadline and days remaining | `src/assignments.js` (`sortForDisplay`, `decorate`), `src/app.js` (`GET /api/assignments`) | `test/assignments.test.js` — "US-04: open assignments are listed in due-date order", "US-04: decorate exposes urgency and days remaining for the client" | `4a912a1`, `b846459` |
| US-03 Validation messages | `src/assignments.js` (`validateAssignment`, `parseDueDate`), `src/app.js` (422 responses) | `test/assignments.test.js` — four US-03 cases; `test/api.test.js` — "US-03: invalid payload returns 422 with field-level details" | `4a912a1` |
| US-04 Urgency and prioritised order | `src/assignments.js` (`urgencyOf`, `sortForDisplay`, `decorate`), `public/styles.css` (`.item.overdue`, `.item.due-soon`), `public/app.js` (badge and state class) | `test/assignments.test.js` — three US-04 cases plus the `review R-1` regression test; `test/api.test.js` — "US-04: overdue assignments are returned first by the API" | `b846459` (red), `feature/us-04-urgency` merge |
| US-05 Mark done / reopen / delete | `src/app.js` (`PATCH`, `DELETE /api/assignments/:id`), `src/store.js` (`update`, `remove`) | `test/api.test.js` — "US-05: PATCH marks an assignment done and DELETE removes it" | `4a912a1` |
| US-06 Filter by status | `src/app.js` (`GET /api/assignments?status=`), `public/app.js` (filter control) | `test/api.test.js` — "US-06: list can be filtered by status" | `4a912a1` |
| US-07 Calendar export | `src/ics.js`, `src/app.js` (`GET /api/export.ics`) | `test/ics.test.js` — "US-07: calendar export contains one event per assignment with CRLF endings" | `4a912a1` |

## Known gaps

- US-08 and US-09 remain in the backlog; no code or test exists yet.
- The browser client (`public/app.js`) is exercised manually; no automated DOM
  test yet (review finding R-3, recorded as technical debt in `docs/risks.md`).

## Verification at the merge commit

- Red step, before implementation: **3 passing, 4 failing**
  (`docs/evidence/iteration-2/red-test-run.txt`).
- Green step, after implementation: **16 passing, 0 failing**
  (`docs/evidence/iteration-2/green-test-run.txt`).
