# Frontend — React

The frontend is a [React](https://react.dev/) application built with [Vite](https://vitejs.dev/). It communicates with the FastAPI backend via HTTP requests.

---

## Folder Structure

```
frontend/
├── public/               # Static assets served as-is (favicons, images)
├── src/
│   ├── assets/           # Imported assets (SVGs, fonts, images used in components)
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level components (one per route)
│   ├── services/         # Functions that make API calls to the backend
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Global state management
│   ├── App.jsx           # Root component — routing and layout
│   └── main.jsx          # Application entry point
├── .env.example          # Template for environment variables
├── index.html            # Vite HTML entry point
├── package.json          # Node dependencies and scripts
└── README.md
```

---

## Prerequisites

- Node.js >= 18
- npm >= 9 (comes with Node.js)

---

## Installation

```bash
cd frontend
npm install
```

---

## Environment Variables

Copy the example file and fill in values:
```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (e.g. `http://localhost:8000`) |

All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser.

---

## Running Individually

```bash
cd frontend
npm run dev
```

The app will be available at http://localhost:5173 with hot module replacement enabled.

### Other scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production (output to `dist/`) |
| `npm run preview` | Preview the production build locally |

---

## Making API Calls

Add API functions to `src/services/`. Use the `VITE_API_BASE_URL` env variable as the base:

```js
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchPrediction(data) {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}
```
