import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, completed, created_at, deadline FROM tasks ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

function parseDeadline(value) {
  if (value == null || value === '') return null;
  const s = typeof value === 'string' ? value.trim() : String(value);
  if (!s) return null;
  const date = new Date(s);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

router.post('/', async (req, res) => {
  const { title, deadline } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const deadlineISO = parseDeadline(deadline);
  try {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title, deadline) VALUES ($1, $2) RETURNING id, title, completed, created_at, deadline',
      [title.trim(), deadlineISO]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const { title, completed, deadline } = req.body;
  const updates = [];
  const values = [];
  let i = 1;
  if (typeof title === 'string' && title.trim()) {
    updates.push(`title = $${i++}`);
    values.push(title.trim());
  }
  if (typeof completed === 'boolean') {
    updates.push(`completed = $${i++}`);
    values.push(completed);
  }
  if (deadline !== undefined) {
    updates.push(`deadline = $${i++}`);
    values.push(parseDeadline(deadline));
  }
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }
  values.push(id);
  try {
    const { rows } = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${i} RETURNING id, title, completed, created_at, deadline`,
      values
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
