# Task Manager

A full-stack task manager built with **React** (frontend), **Node.js** (backend), and **PostgreSQL** (database).

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** (installed and running)
- A database named `taskmanager` (or set `PGDATABASE` in `.env`)

## Quick start

### 1. Database

Create a database (if you haven’t):

```bash
# In psql or pgAdmin:
CREATE DATABASE taskmanager;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set PGPASSWORD (and other vars if needed)
npm install
npm run db:init
npm run dev
```

The API runs at **http://localhost:3001**.

### 3. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:5173**. Vite proxies `/api` to the backend.

## Project structure

```
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── db/        # PostgreSQL pool + init script
│   │   ├── routes/    # Task CRUD routes
│   │   └── index.js   # Server entry
│   └── .env.example
├── frontend/          # React (Vite)
│   └── src/
│       ├── components/
│       └── App.jsx
└── README.md
```

## API

| Method | Path           | Description        |
|--------|----------------|--------------------|
| GET    | /api/tasks     | List all tasks     |
| POST   | /api/tasks     | Create a task      |
| PATCH  | /api/tasks/:id | Update a task      |
| DELETE | /api/tasks/:id | Delete a task      |

## Environment (backend)

Copy `backend/.env.example` to `backend/.env` and set:

- `PORT` – API port (default `3001`)
- `PGUSER`, `PGHOST`, `PGDATABASE`, `PGPASSWORD`, `PGPORT` – PostgreSQL connection
