export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
        />
        <span className="checkmark" aria-hidden />
      </label>
      <span className="task-title">{task.title}</span>
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
