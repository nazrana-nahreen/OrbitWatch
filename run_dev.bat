@echo off
echo ==========================================================
echo    Starting OrbitWatch AI (Backend + Frontend)
echo ==========================================================

start "OrbitWatch Backend (FastAPI)" cmd /k "set PYTHONPATH=. && backend\.venv\Scripts\uvicorn backend.app.main:app --reload --port 8000"
start "OrbitWatch Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo [OK] Backend: http://localhost:8000 (Swagger: /docs)
echo [OK] Frontend: http://localhost:5173
