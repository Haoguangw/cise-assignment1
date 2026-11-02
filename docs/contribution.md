# Contribution statement

**Solo submission.** The assessment brief describes a team of four; the course
lecturer approved an individual submission for this offering, so all four roles
were held sequentially by the one author. The statement below therefore records
work rather than dividing it, and distinguishes the roles so that the evidence for
each can still be checked.

| Role | Work performed | Evidence |
| ---- | -------------- | -------- |
| Analyst / product owner | Defined the problem and stakeholders, wrote the user stories with given/when/then acceptance criteria, set MoSCoW priorities and the out-of-scope list, maintained the risk register. | `docs/backlog.md`, `docs/risks.md` |
| Designer | Produced the system overview, chose the layering and the six design decisions, decided to keep the client dependency-free. | `docs/architecture.md` |
| Developer | Implemented the store, domain rules, route handler, HTTP server, browser client and iCalendar export; 3 files changed in the trial change (+66/−7). | `src/`, `public/`, `git log` |
| Reviewer | Ran a checklist-based self-review of the trial change, recorded five findings, fixed three before merge and accepted two as debt. | `docs/review-record.md` |
| Tester | Wrote 16 automated tests (domain, API over HTTP, export), captured the red and green runs, configured the CI matrix. | `test/`, `docs/evidence/iteration-2/`, `.github/workflows/ci.yml` |
| Scribe | Maintained the iteration records, retrospectives, traceability matrix and this evidence index. | `docs/iterations.md`, `docs/traceability.md`, `docs/evidence-index.md` |

## Timeline of my work

| Date | Activity | Output |
| ---- | -------- | ------ |
| 27 Oct 2026 | Problem framing, stakeholder analysis, backlog drafting | `docs/backlog.md` v1 |
| 28–29 Oct 2026 | Iteration 1 implementation (API, store, export, client) | commit `4a912a1` |
| 30 Oct 2026 | Iteration 1 testing and retrospective; risk register review | `docs/iterations.md`, `docs/risks.md` |
| 2 Nov 2026 | US-04 acceptance tests written first, red run captured | commit `b846459` |
| 2 Nov 2026 | US-04 implementation, green run, self-review, defect R-1 fixed | `feature/us-04-urgency` |
| 2 Nov 2026 | Report and evidence index | this submission |

## Declaration

This repository contains the code, tests and project documents submitted for this
assessment. No third-party source code is reused; the only external inputs are the
course materials and the peer-reviewed sources listed in the report reference list.
Built-in Node.js modules (`node:http`, `node:fs`, `node:crypto`, `node:test`) are
used as documented in the Node.js API documentation.

Signed: Haoguang Wang (25305403)
