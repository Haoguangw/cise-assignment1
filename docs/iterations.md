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

## Iteration 2

- **Dates:** week 2, 3–7 November 2026
- **Goal:** deadline risk is visible at a glance, and the workflow is proven by a
  tracked, reviewed, tested change rather than by assertion.
- **Backlog committed:** US-04 (trial change), CI workflow, retrospective actions 1–4
- **Roles:** as iteration 1, with the reviewer role held against the checklist in
  `docs/review-record.md` rather than informally.
- **Delivered:** US-04 (urgency classification, prioritised ordering, badge and
  state styling), the GitHub Actions workflow, and one review-driven defect fix.
- **Not delivered:** US-08, US-09 (carried into Assignment 2).

### Outcome

| Item | Acceptance criteria met | Verification |
| ---- | ----------------------- | ------------ |
| US-04 urgency classification, ordering, visual state | Yes | 4 tests in `test/assignments.test.js`, 1 in `test/api.test.js` |
| Test-first discipline | Yes | red run 3/7 → green run 16/16 (`docs/evidence/iteration-2/`) |
| CI workflow (Node 20/22/24) | Configured | `.github/workflows/ci.yml` |
| Traceability row in the same commit | Yes | `docs/traceability.md` |
| Review finding R-1 (overdue items reported 0 days) | Fixed before merge | regression test `review R-1` |

`npm test`: **16 passing, 0 failing**. Change size: 3 files, +66 / −7 lines.

### Process comparison (iteration 1 → iteration 2)

| Measure | Definition | Iteration 1 | Iteration 2 |
| ------- | ---------- | ----------- | ----------- |
| Automated tests | Passing `node:test` cases | 13 | 16 |
| Requirement coverage | Stories with ≥ 1 test ÷ committed stories | 6 / 6 | 7 / 7 |
| Rework | Defects found by testing after the first implementation | 3 | 1 (found in review, before merge) |
| Change size | Lines in the trial change | — | +66 / −7 across 3 files |
| Verification | When tests were run | manually, after the fact | before implementation (red) and after (green) |

### Retrospective

The two iteration 1 actions that were actually taken — writing the tests first and
recording traceability in the same commit — both produced a visible effect: the
change produced a red run before any implementation existed, and the only defect
that survived to review (R-1, day rounding) was caught by reading the diff against
the acceptance criteria rather than by luck. Iteration 1's rework count of three
problems found after implementation fell to one.

The remaining weakness is unchanged and now clearly the largest one: the browser
layer is verified only by hand. That is the first item for Assignment 2, together
with US-08 and US-09.
