# Review record — US-04 (workflow trial change)

Because this is a solo submission there is no second author to review the change,
so the review is a structured self-review carried out against the acceptance
criteria rather than a casual read-through. The checklist is derived from the
inspection practice described by Fagan (1976): the reviewer is given a defined
role, a preparation step and a checklist, and findings are recorded and closed
before the change is merged.

- **Requirement under review:** US-04 (overdue and soon-due work stands out and
  sorts first). Acceptance criteria in `docs/backlog.md`.
- **Branch:** `feature/us-04-urgency`
- **Change under review:** `b846459` (tests only, red) → merge commit
- **Procedure:** (1) read the acceptance criteria; (2) read the diff against
  `main`; (3) trace each acceptance criterion to a test; (4) run `npm test`;
  (5) record findings; (6) fix or accept explicitly.

## Test-first evidence

| Step | Command | Result | Evidence |
| ---- | ------- | ------ | -------- |
| 1. Tests written first | `npm test` at `b846459` | **3 pass, 4 fail** (red) | `docs/evidence/iteration-2/red-test-run.txt` |
| 2. Implementation added | `npm test` | **16 pass, 0 fail** (green) | `docs/evidence/iteration-2/green-test-run.txt` |

## Findings

| ID | Location | Severity | Finding | Action | Status |
| -- | -------- | -------- | ------- | ------ | ------ |
| R-1 | `src/assignments.js` — `decorate` | Medium (correctness/UI contradiction) | `Math.ceil` on a negative remainder rounded *up*, so an item 12 hours late reported `daysRemaining = 0` and the client rendered "(today)" next to an **overdue** badge. | Round towards zero in both directions (`floor` when the remainder is negative) and add a regression test `review R-1`. | **Fixed before merge** |
| R-2 | `src/assignments.js` — `sortForDisplay` | Low (performance) | The comparator recomputes `urgencyOf` on every comparison, so classification runs O(n log n) times instead of O(n). | Accepted: with tens of items the cost is microseconds, and memoising would add state to a pure function. Recorded, not fixed. | Accepted |
| R-3 | `public/app.js` | Medium (test coverage) | The badge and the CSS state classes are only verified by manual inspection; no DOM test exists. | Deferred to Assignment 2 (tracked as technical debt in `docs/risks.md` R3/R8 and `docs/traceability.md` "Known gaps"). | Open, accepted for this submission |
| R-4 | `test/ics.test.js`, `docs/traceability.md` | Low (traceability) | The calendar-export test was still named `US-08` while the backlog lists that story as `US-07`, so the traceability row pointed at a test that appears to belong to a different feature. | Story ID corrected in the test name and the traceability row. | **Fixed before merge** |
| R-5 | `README.md` | Low (documentation) | The API table was written before `urgency` existed in responses, so the derived fields were undocumented. | README updated to list `urgency` among the derived fields. | **Fixed before merge** |

## Checklist result

| Check | Result |
| ----- | ------ |
| Every acceptance criterion has at least one automated test | Pass (4 tests) |
| No new runtime dependency added | Pass |
| No secret, credential or personal data in the diff | Pass |
| README/API documentation updated | Pass (R-5) |
| Traceability row added in the same commit | Pass (`docs/traceability.md`) |
| Tests green locally | Pass (16/16) |
| Tests green in CI | Configured; first run on push of `main` |

**Merge decision:** approved after R-1, R-4 and R-5 were fixed, with R-2 and R-3
explicitly accepted and recorded as debt.
