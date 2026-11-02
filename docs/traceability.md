# Traceability matrix

Every requirement traces forwards to the code that implements it and the test
that proves it; every test traces back to a requirement. Rows are added in the
same commit as the change (see the Definition of Done in `docs/backlog.md`).

| Requirement | Implementation | Automated test | Commit |
| ----------- | -------------- | -------------- | ------ |
| US-01 Add assignment | `src/assignments.js` (`validateAssignment`), `src/app.js` (`POST /api/assignments`), `src/store.js` (`create`) | `test/assignments.test.js` — "US-01: a complete assignment is accepted and normalised"; `test/api.test.js` — "US-01/US-02: POST creates an assignment…" | `iter-1` |
| US-02 Order by deadline and days remaining | `src/assignments.js` (`sortByDueDate`, `decorate`), `src/app.js` (`GET /api/assignments`) | `test/assignments.test.js` — "US-04: open assignments are listed in due-date order", "US-04: decorate exposes days remaining" | `iter-1` |
| US-03 Validation messages | `src/assignments.js` (`validateAssignment`, `parseDueDate`), `src/app.js` (422 responses) | `test/assignments.test.js` — four US-03 cases; `test/api.test.js` — "US-03: invalid payload returns 422 with field-level details" | `iter-1` |
| US-05 Mark done / reopen / delete | `src/app.js` (`PATCH`, `DELETE /api/assignments/:id`), `src/store.js` (`update`, `remove`) | `test/api.test.js` — "US-05: PATCH marks an assignment done and DELETE removes it" | `iter-1` |
| US-06 Filter by status | `src/app.js` (`GET /api/assignments?status=`), `public/app.js` (filter control) | `test/api.test.js` — "US-06: list can be filtered by status" | `iter-1` |
| US-07 Calendar export | `src/ics.js`, `src/app.js` (`GET /api/export.ics`) | `test/ics.test.js` — "US-08: calendar export contains one event per assignment with CRLF endings" | `iter-1` |

## Known gaps

- US-08 and US-09 remain in the backlog; no code or test exists yet.
- The browser client (`public/app.js`) is exercised manually; no automated DOM
  test yet (tracked as a technical-debt item in `docs/risks.md`).
