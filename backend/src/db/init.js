import 'dotenv/config';
import pool from './pool.js';

const initSQL = `
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deadline TIMESTAMPTZ
  );
`;

async function init() {
  try {
    await pool.query(initSQL);
    try {
      await pool.query('ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ');
    } catch (alterErr) {
      if (alterErr.code !== '42701') throw alterErr;
    }
    console.log('Database initialized: tasks table ready.');
  } catch (err) {
    console.error('Database init failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

init();
