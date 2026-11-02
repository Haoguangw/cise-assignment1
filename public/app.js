// Browser client: talks only to the JSON API, so the same API can be tested headlessly.

const form = document.querySelector('#assignment-form');
const formMessage = document.querySelector('#form-message');
const listEl = document.querySelector('#assignment-list');
const emptyEl = document.querySelector('#empty-state');
const filterEl = document.querySelector('#filter');

const URGENCY_LABEL = {};

function setMessage(text, isError = false) {
  formMessage.textContent = text;
  formMessage.style.color = isError ? '#c62828' : '#2f7d32';
}

function formatDue(dueDate, daysRemaining) {
  const date = new Date(dueDate).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const suffix =
    daysRemaining < 0
      ? ` (${Math.abs(daysRemaining)} day(s) late)`
      : daysRemaining === 0
        ? ' (today)'
        : ` (${daysRemaining} day(s) left)`;
  return `${date}${suffix}`;
}

async function loadAssignments() {
  const status = filterEl.value;
  const url = status ? `/api/assignments?status=${encodeURIComponent(status)}` : '/api/assignments';
  const response = await fetch(url);
  const data = await response.json();
  render(data.assignments ?? []);
}

function render(assignments) {
  listEl.innerHTML = '';
  emptyEl.hidden = assignments.length > 0;

  for (const item of assignments) {
    const li = document.createElement('li');
    li.className = `item ${item.status}`;
    li.dataset.id = item.id;

    const info = document.createElement('div');
    const heading = document.createElement('h3');
    heading.textContent = item.title;

    const meta = document.createElement('p');
    meta.className = 'meta';
    meta.append(
      `${item.course} · ${formatDue(item.dueDate, item.daysRemaining)} · worth ${item.weight}%`,
    );
    if (item.notes) meta.append(` · ${item.notes}`);

    info.append(heading, meta);

    const actions = document.createElement('div');
    actions.className = 'item-actions';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.textContent = item.status === 'done' ? 'Reopen' : 'Mark done';
    toggle.addEventListener('click', async () => {
      await fetch(`/api/assignments/${item.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: item.status === 'done' ? 'todo' : 'done' }),
      });
      await loadAssignments();
    });

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'danger';
    remove.textContent = 'Delete';
    remove.addEventListener('click', async () => {
      await fetch(`/api/assignments/${item.id}`, { method: 'DELETE' });
      await loadAssignments();
    });

    actions.append(toggle, remove);
    li.append(info, actions);
    listEl.append(li);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(form).entries());
  payload.weight = Number(payload.weight);

  const response = await fetch('/api/assignments', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.status === 201) {
    form.reset();
    setMessage('Assignment added.');
    await loadAssignments();
    return;
  }

  const problem = await response.json();
  setMessage((problem.details ?? [problem.error]).join('; '), true);
});

filterEl.addEventListener('change', loadAssignments);

await loadAssignments();
