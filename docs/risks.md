# Risk register

Reviewed at the start of each iteration. Likelihood and impact are High / Medium / Low.

| ID | Risk | Likelihood | Impact | Response (mitigation) | Owner | Status |
| -- | ---- | ---------- | ------ | --------------------- | ----- | ------ |
| R1 | Scope creep: the tracker grows into a full calendar/notification product and nothing is finished. | High | High | MoSCoW priorities fixed for the release; anything not in the backlog goes to `docs/backlog.md` "Out of scope"; iteration goals must fit one week. | Product owner role | Open — reviewed weekly |
| R2 | Requirements change late (e.g. deciding to add reminders mid-iteration). | Medium | Medium | Change is only accepted into the *next* iteration; the current iteration goal is frozen; every accepted change is recorded in `docs/iterations.md` with its reason. | Analyst role | Open |
| R3 | Unverified user interface: API tests cannot catch a broken form or a hidden warning colour. | High | Medium | Explicit manual test script for the client each iteration; DOM/E2E automation planned for Assignment 2; CSS state classes are asserted indirectly by `urgency` values in API responses. | Tester role | Open — highest remaining risk |
| R4 | Data loss: the JSON file is overwritten or corrupted between runs. | Low | High | Writes are full-file and atomic enough for single-user use; the file is excluded from git (`.gitignore`) so a checkout cannot clobber local data; export to `.ics` provides an independent copy of deadlines. | Developer role | Accepted (small, single-user scope) |
| R5 | Time pressure (course workload, part-time work) compresses iteration 2. | High | Medium | Cut scope, not quality: US-08 and US-09 are explicitly droppable; the trial change is kept small (~60 lines). | All roles | Open |
| R6 | Solo submission: no second pair of eyes, so a self-review may miss defects. | High | Medium | Structured review checklist (Fagan, 1976) applied line by line against the acceptance criteria; review findings recorded in `docs/review-record.md`; CI provides an independent, repeatable check. | Reviewer role | Mitigated, residual risk accepted |
| R7 | Tooling drift: Node version differences (local 24 vs CI 20/22/24). | Medium | Low | CI matrix covers 20, 22 and 24; no dependencies means no lockfile or supply-chain drift. | Developer role | Mitigated |
| R8 | Technical debt: the browser client is untested and the store is a single JSON file. | Medium | Medium | Recorded here and in `docs/traceability.md` "Known gaps"; both are planned items for Assignment 2 rather than hidden debt. | Developer role | Open |
