# Iteration records

Two one-week iterations, as planned in Assignment 1. Each record states the
goal, the committed backlog items, who did what, the outcome and the
retrospective actions.

## Iteration 1

- **Dates:** week 1, 27–31 October 2026
- **Goal:** a student can record assignments and see what is coming.
- **Backlog committed:** US-01, US-02, US-03, US-05, US-06, US-07
- **Roles (solo submission, roles held sequentially):** analyst (stakeholder and
  requirements), developer (implementation), reviewer (self-review against
  checklist), tester (automated and exploratory testing).
- **Delivered:** the JSON API, the JSON-file store, the iCalendar export, the
  browser client and 13 automated tests.
- **Not delivered:** US-04 (urgency), US-08, US-09 — carried into iteration 2.

### Outcome

| Item | Acceptance criteria met | Verification |
| ---- | ----------------------- | ------------ |
| US-01 | Yes | `test/api.test.js`, `test/assignments.test.js` |
| US-02 | Yes | `test/assignments.test.js` |
| US-03 | Yes | 5 assertions across two suites |
| US-05 | Yes | `test/api.test.js` |
| US-06 | Yes | `test/api.test.js` |
| US-07 | Yes | `test/ics.test.js` |

`npm test`: **13 passing, 0 failing**.

### Retrospective (what to change in iteration 2)

1. **Testing was retro-fitted.** Unit tests were written after the API worked, so
   three validation edge cases (empty note, 100 % weight, date-only parsing) were
   found late. → In iteration 2 the test is written first for the trial change
   and the commit message records the red-then-green sequence.
2. **No automated check ran on every change.** Tests were run manually. → A
   GitHub Actions workflow (`.github/workflows/ci.yml`) is added, covering Node
   20, 22 and 24.
3. **The list was readable but not prioritised.** A deadline tracker that hides
   overdue work has not solved the user's problem. → US-04 is pulled forward and
   becomes the workflow trial.
4. **Traceability was reconstructed at the end.** → The traceability row is now
   edited in the same commit as the code.

### Process measures (baseline set here, compared in iteration 2)

| Measure | Definition | Iteration 1 value |
| ------- | ---------- | ----------------- |
| Automated tests | Count of passing `node:test` assertions | 13 |
| Requirement coverage | Stories with ≥ 1 automated test ÷ committed stories | 6 / 6 (100 %) |
| Lead time for the trial change | First commit on the branch → merge | measured in iteration 2 |
| Rework | Commits that fix a defect found by testing after the first implementation | 3 |

## Iteration 2 (planned)

- **Dates:** week 2, 3–7 November 2026
- **Goal:** deadline risk is visible at a glance, and the workflow is proven by a
  tracked, reviewed, tested change rather than by assertion.
- **Backlog committed:** US-04 (trial change), CI workflow, retrospective actions 1–4
- **Planned evidence:** `docs/review-record.md` (test-first sequence, review
  findings), CI run log, updated traceability row.
- **Success measure:** the trial change merges with all acceptance criteria
  covered by tests and zero defects found after merge.

### Outcome

To be completed at the end of iteration 2.
