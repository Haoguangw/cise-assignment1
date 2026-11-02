# System overview

DueMate is a small, single-user web application. The diagram below is the one
reproduced in the Assignment 1 report.

```
┌──────────────────────────────────────────────────────────────────┐
│ Browser (public/)                                                │
│   index.html    form + list + status filter                      │
│   app.js        fetch() calls, renders urgency badge & classes   │
│   styles.css    state colours: .overdue / .due-soon / .done      │
└───────────────────────────┬──────────────────────────────────────┘
                            │ HTTP + JSON (no build step)
┌───────────────────────────▼──────────────────────────────────────┐
│ node:http server — src/server.js                                 │
│   • static file serving (MIME by extension, path-traversal guard)│
│   • delegates every /api/* request to the route handler          │
└───────────────────────────┬──────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│ Route handler — src/app.js                                       │
│   GET  /api/health                                               │
│   GET  /api/assignments[?status=]     POST   /api/assignments    │
│   PATCH/DELETE /api/assignments/:id   GET    /api/export.ics     │
│   • reads JSON body (32 KB limit), maps errors to 4xx            │
└──────┬───────────────────────────────────┬───────────────────────┘
       │                                   │
┌──────▼──────────────────────┐   ┌────────▼──────────────────────┐
│ Domain — src/assignments.js │   │ Export — src/ics.js           │
│  validateAssignment         │   │  buildIcs (RFC 5545, CRLF)    │
│  parseDueDate               │   └───────────────────────────────┘
│  urgencyOf                  │
│  sortForDisplay             │
│  decorate (+daysRemaining)  │
│  (pure functions, clock     │
│   injected by the caller)   │
└──────┬──────────────────────┘
       │
┌──────▼──────────────────────────────────────────────────────────┐
│ Persistence — src/store.js → data/assignments.json               │
│   load / persist / create / update / remove (full-file writes)   │
└─────────────────────────────────────────────────────────────────┘
```

Tests (`test/`) exercise the domain, the route handler over HTTP and the export
directly; the server module is the only piece that is not unit tested, because it
contains only wiring.

## Design decisions

| # | Decision | Reason | Trade-off accepted |
| - | -------- | ------ | ------------------ |
| D1 | **No third-party dependencies** (Node built-ins only) | An assessor can run the code with `npm start` and `npm test` and no network; there is no lockfile or supply-chain risk, which matters because the marking depends on reproducibility. | No framework conveniences: routing and static serving are hand-written (~60 lines). |
| D2 | **Domain rules as pure functions with an injected clock** | "Overdue" depends on time; injecting `now` makes tests deterministic instead of date-dependent, and keeps HTTP concerns out of the rules. | Callers must pass a clock; defaults are provided. |
| D3 | **Derived fields computed server-side** (`urgency`, `daysRemaining`) | The browser cannot disagree with the API about what "overdue" means, and the same rule is reused by the `.ics` export and any future client. | Slightly larger payloads; deadline changes require a fresh request rather than a client-side recomputation. |
| D4 | **Single JSON file instead of a database** | The scope is one user with tens of records; a database would add installation steps and harm reproducibility. | No concurrent writers, no queries, no transactions — recorded as a limitation and as candidate technical debt (`docs/risks.md` R4/R8). |
| D5 | **No client build step** (vanilla ES modules) | `npm install` is not needed at all, so a reviewer can inspect exactly the code that runs. | No reactive framework; manual DOM updates in `public/app.js`. |
| D6 | **Validation at the boundary, not in the UI only** | Client-side checks are a convenience; the API rejects bad input with `422` and field-level details so that the rule is testable and cannot be bypassed. | Duplicate validation logic if a second client appears. |
| D7 | **Traceability inside the repository** (backlog → traceability matrix → tests → commit) | Marks are earned by evidence, and evidence that is not linked is hard to verify. | Documentation work per change; enforced through the Definition of Done. |
