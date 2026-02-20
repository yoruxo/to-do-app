import { useState } from 'react';

export default function AddTask({ onAdd }) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setErr('');
    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setTitle('');
    } catch (e) {
      setErr(e.message || 'Could not add task');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="add-task" onSubmit={handleSubmit}>
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
      {err && <span className="add-task-error">{err}</span>}
    </form>
  );
}
