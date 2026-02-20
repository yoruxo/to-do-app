import 'dotenv/config';
import pool from './pool.js';

const initSQL = `
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`;

async function init() {
  try {
    await pool.query(initSQL);
    console.log('Database initialized: tasks table ready.');
  } catch (err) {
    console.error('Database init failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

init();
