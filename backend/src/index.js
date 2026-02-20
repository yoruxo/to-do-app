import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/tasks', tasksRouter);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Task manager API running at http://localhost:${PORT}`);
});
