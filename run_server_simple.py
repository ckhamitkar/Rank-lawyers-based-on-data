import uvicorn
from server import app

if __name__ == '__main__':
    # Start uvicorn directly without the reloader so the process stays in this terminal
    uvicorn.run(app, host='127.0.0.1', port=8000, log_level='debug')
