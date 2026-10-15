# OrbitWatch AI Development Server Launcher (PowerShell)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting OrbitWatch AI (Backend + Frontend)   " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Start Backend FastAPI
$backend = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "`$env:PYTHONPATH='.'; .\backend\.venv\Scripts\uvicorn backend.app.main:app --reload --port 8000" -PassThru
Write-Host "[✓] Backend started at http://localhost:8000 (Swagger: /docs)" -ForegroundColor Green

# Start Frontend Vite
$frontend = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -PassThru
Write-Host "[✓] Frontend started at http://localhost:5173" -ForegroundColor Green

Write-Host "`nOrbitWatch AI is running! Press Ctrl+C in their respective windows to stop." -ForegroundColor White
