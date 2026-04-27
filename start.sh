#!/bin/bash
set -e

cleanup() {
    echo ""
    echo "Shutting down all services..."
    kill 0
    exit 0
}
trap cleanup SIGINT SIGTERM

echo "Starting frontend..."
(cd frontend && npm run dev) &

echo "Starting backend..."
(cd backend && uv run uvicorn app.main:app --reload --port 8000) &

echo ""
echo "All services started."
echo "  Frontend : http://localhost:5173"
echo "  Backend  : http://localhost:8000"
echo "  API Docs : http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services."

wait
