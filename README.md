# Task Manager

A full-stack task manager built with **React** (frontend), **Node.js** (backend), **PostgreSQL** (database), and **Electron** (desktop app).

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

The API runs at **http://localhost:3001**. Leave this running.

### 3. Run the app

**Option A – Desktop window (Electron)**

From the project root:

```bash
npm install
npm run dev
```

This starts the Vite dev server and opens the app in an **Electron window** (no browser). The backend must already be running (step 2).

**Option B – Browser only**

```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

## Building and packaging

- **Run the built app locally (no installer):**  
  `npm run build` then `npm start`. Backend must be running.

- **Create installer (.exe on Windows):**  
  `npm run dist`. Output is in the `release/` folder. The backend and PostgreSQL must be running on the machine where you use the app.

## Project structure

```
├── electron/          # Electron main process
│   └── main.js        # Window + load dev or built frontend
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
├── package.json       # Root: Electron + scripts
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
