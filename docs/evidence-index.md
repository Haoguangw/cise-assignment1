# Evidence index

Assessment evidence for Assignment 1. Each row states what the evidence proves,
where it lives in the repository, and how it can be reproduced.

| # | Evidence | What it proves | Location | How to check |
| - | -------- | -------------- | -------- | ------------ |
| 1 | Prioritised backlog with testable acceptance criteria | Planning: every story has given/when/then criteria and a MoSCoW priority | `docs/backlog.md` | Read the table; each row maps to a test below |
| 2 | Tracked requirement (US-04) | A requirement exists before the code and is referenced in commits and tests | `docs/backlog.md` US-04; branch `feature/us-04-urgency` | `git log --all --oneline`; `git show b846459` |
| 3 | Reviewed change | A structured self-review with findings, three fixed before merge and two explicitly accepted | `docs/review-record.md` | Read the findings table; compare with `git diff 4a912a1 b846459` |
| 4 | Test evidence (red → green) | Tests were written first and failed, then passed after implementation | `docs/evidence/iteration-2/red-test-run.txt`, `docs/evidence/iteration-2/green-test-run.txt` | `npm test` reproduces the green run |
| 5 | Automated checks in CI | The same suite runs on Node 20, 22 and 24 on every push and pull request | `.github/workflows/ci.yml` | Push the repository and open the Actions tab |
| 6 | Traceability matrix | Requirement → implementation → test → commit, maintained per change | `docs/traceability.md` | Cross-check rows against file paths and test names |
| 7 | Iteration records and retrospectives | Iteration goals, outcomes, measures and agreed actions | `docs/iterations.md` | Compare the two iteration sections |
| 8 | Risk register | Risks identified during planning with likelihood, impact and response | `docs/risks.md` | Read R1–R8 |
| 9 | System overview diagram | Architecture, deployment and request flow | `docs/architecture.md`, figure in the report (Section 3) | Read the diagram and the design-decision notes |
| 10 | Contribution statement | Who did what, for a solo submission | `docs/contribution.md`, report Section 5 | Compare with commit authors and timestamps |
| 11 | Runnable increment | The software actually runs from the documented instructions | `README.md` | `npm start` → http://localhost:3000; `npm test` |

## Reproducibility notes

- No dependencies: `npm install` is not required, so no network access is needed
  and there is no lockfile drift.
- Tests use the built-in `node:test` runner (Node 20+). The API tests bind to an
  ephemeral port and a temporary data directory, so they can run twice in a row
  or in parallel without interfering with local data.
- Fixed clocks: API tests inject `clock: () => FIXED_NOW`, so "overdue" results
  do not depend on the day the tests are run.
