# Start the backend in a PowerShell window (keeps the window open)
cd "$PSScriptRoot"
python -m uvicorn server:app --host 127.0.0.1 --port 8000
