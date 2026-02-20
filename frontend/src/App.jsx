import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import './App.css';

const API_BASE = '/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchTasks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) throw new Error('Failed to load tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function addTask(title) {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to add task');
      }
      const task = await res.json();
      setTasks((prev) => [task, ...prev]);
    } catch (err) {
      throw err;
    }
  }

  async function toggleTask(id, completed) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteTask(id) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p className="subtitle">React · Node · PostgreSQL</p>
      </header>

      <AddTask onAdd={addTask} />

      {loading && <p className="status">Loading tasks…</p>}
      {error && (
        <p className="status error">
          {error}. Make sure the backend is running and the database is set up.
        </p>
      )}
      {!loading && !error && (
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}
