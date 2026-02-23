import { useState } from 'react';

export default function AddTask({ onAdd }) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setErr('');
    setSubmitting(true);
    try {
      await onAdd(trimmed, deadline || null);
      setTitle('');
      setDeadline('');
    } catch (e) {
      setErr(e.message || 'Could not add task');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="add-task" onSubmit={handleSubmit}>
      <div className="add-task-row">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          disabled={submitting}
          maxLength={500}
          autoFocus
        />
        <button type="submit" disabled={submitting || !title.trim()}>
          Add
        </button>
      </div>
      <div className="add-task-deadline">
        <label htmlFor="deadline">Deadline</label>
        <input
          id="deadline"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          disabled={submitting}
        />
      </div>
      {err && <span className="add-task-error">{err}</span>}
    </form>
  );
}
