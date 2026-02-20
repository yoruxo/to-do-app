import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, completed, created_at FROM tasks ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, completed, created_at',
      [title.trim()]
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
  const { title, completed } = req.body;
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
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }
  values.push(id);
  try {
    const { rows } = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${i} RETURNING id, title, completed, created_at`,
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
