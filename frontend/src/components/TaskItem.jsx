import { useState } from 'react';

function formatDeadline(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function isOverdue(iso) {
  if (!iso) return false;
  return new Date(iso) < new Date();
}

function toDateTimeLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}`;
}

export default function TaskItem({ task, onToggle, onDelete, onUpdateDeadline }) {
  const [editingDeadline, setEditingDeadline] = useState(false);
  const [deadlineInput, setDeadlineInput] = useState('');
  const hasDeadline = !!task.deadline;
  const overdue = hasDeadline && !task.completed && isOverdue(task.deadline);

  function startEditDeadline() {
    setDeadlineInput(toDateTimeLocal(task.deadline));
    setEditingDeadline(true);
  }

  function saveDeadline() {
    if (deadlineInput.trim()) {
      onUpdateDeadline(task.id, deadlineInput.trim());
    } else {
      onUpdateDeadline(task.id, null);
    }
    setEditingDeadline(false);
  }

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
        />
        <span className="checkmark" aria-hidden />
      </label>
      <div className="task-body">
        <span className="task-title">{task.title}</span>
        {editingDeadline ? (
          <div className="task-deadline-edit">
            <input
              type="datetime-local"
              value={deadlineInput}
              onChange={(e) => setDeadlineInput(e.target.value)}
              autoFocus
            />
            <button type="button" onClick={saveDeadline}>Save</button>
            <button type="button" onClick={() => { setEditingDeadline(false); }}>Cancel</button>
          </div>
        ) : (
          <div className="task-deadline-wrap">
            {hasDeadline ? (
              <button
                type="button"
                className={`task-deadline ${overdue ? 'overdue' : ''}`}
                onClick={startEditDeadline}
                title="Edit deadline"
              >
                Due {formatDeadline(task.deadline)}
              </button>
            ) : (
              <button
                type="button"
                className="task-deadline add"
                onClick={startEditDeadline}
              >
                + Add deadline
              </button>
            )}
          </div>
        )}
      </div>
      <button
        type="button"
        className="task-delete"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        ×
      </button>
    </li>
  );
}
