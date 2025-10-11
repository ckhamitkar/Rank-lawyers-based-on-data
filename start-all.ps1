$backend = "-NoExit -Command cd '$PSScriptRoot'; python -m uvicorn server:app --host 127.0.0.1 --port 8000"
$frontend = "-NoExit -Command cd '$PSScriptRoot\\frontend'; npm run dev"

Start-Process powershell -ArgumentList $backend
Start-Process powershell -ArgumentList $frontend

Write-Host "Started backend and frontend in new PowerShell windows."
