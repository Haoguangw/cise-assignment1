# DueMate

A small, single-user assignment deadline tracker built as the workflow trial for
**ENSE701 Contemporary Issues in Software Engineering — Assignment 1**.

DueMate keeps one list of course assignments (course, title, due date, weight,
status) and orders it so that the work that needs attention first is at the top.

## Requirements

- Node.js 20 or newer (no `npm install` step: the project has **no runtime or dev dependencies**)

## Run the app

```bash
npm start
# open http://localhost:3000
```

Optional environment variables:

| Variable        | Default                 | Purpose                          |
| --------------- | ----------------------- | -------------------------------- |
| `PORT`          | `3000`                  | HTTP port                        |
| `DUEMATE_DATA`  | `data/assignments.json` | Where assignments are stored     |

The data file is created automatically on first start.

## Run the tests

```bash
npm test
```

Tests use the built-in `node:test` runner and cover the domain rules, the HTTP
API (against an ephemeral port) and the calendar export. The API tests use a
temporary data file, so they never touch `data/assignments.json`.

## API

| Method | Path                    | Description                                        |
| ------ | ----------------------- | -------------------------------------------------- |
| GET    | `/api/health`           | Liveness probe                                     |
| GET    | `/api/assignments`      | List assignments, ordered by urgency then due date |
| GET    | `/api/assignments?status=done` | List filtered by status                     |
| POST   | `/api/assignments`      | Create (`course`, `title`, `dueDate`, `weight`, `status`, `notes`) |
| PATCH  | `/api/assignments/:id`  | Partially update an assignment                     |
| DELETE | `/api/assignments/:id`  | Delete an assignment                               |
| GET    | `/api/export.ics`       | Download open deadlines as an iCalendar file       |

`dueDate` accepts `YYYY-MM-DD` (treated as the end of that day) or a full ISO
8601 timestamp. Invalid payloads return `422` with a `details` array.

Responses add two derived, read-only fields:

- `urgency` — `overdue`, `due-soon` (within 72 hours), `upcoming` or `done`
- `daysRemaining` — whole days until the deadline, negative once it has passed

The list is ordered `overdue` → `due-soon` → `upcoming` → `done`, and within a
band by earliest deadline.

## Layout

```
src/assignments.js   domain rules: validation, urgency, ordering (pure functions)
src/store.js         JSON-file persistence
src/ics.js           iCalendar export
src/app.js           HTTP routing (no I/O beyond the store)
src/server.js        node:http server + static file serving
public/              browser client (vanilla ES modules, no build step)
test/                node:test suites
docs/                backlog, traceability, iteration records, review record
```

## Project documents

- `docs/backlog.md` — prioritised backlog with acceptance criteria
- `docs/traceability.md` — requirement → code → test traceability matrix
- `docs/iterations.md` — iteration goals, outcomes and retrospectives
- `docs/risks.md` — risk register
- `docs/review-record.md` — self-review record for the trial change
- `docs/evidence-index.md` — where each piece of assessment evidence lives

## Licence / acknowledgement

Course project; no third-party code is reused. Built-in Node.js modules only.
