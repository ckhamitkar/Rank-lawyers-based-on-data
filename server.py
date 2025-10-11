from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import os
import uvicorn
from ranker import rank_lawyers

app = FastAPI(title="Lawyer Ranking API")

# Enable CORS so Vite dev server (localhost:5173) can call /api endpoints
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the frontend static files from the frontend directory (Vite dev handles this differently in dev)
if os.path.isdir('frontend/dist'):
    app.mount('/', StaticFiles(directory='frontend/dist', html=True), name='frontend')


@app.get('/api/ranked')
def get_ranked(config: Optional[str] = None):
    """
    Return the ranked lawyers as JSON. If `config` is provided it is treated as
    a path to a JSON weights file; otherwise ranking uses default weights.
    """
    csv_path = os.path.join(os.getcwd(), 'lawyer_data.csv')
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail='lawyer_data.csv not found')

    ranked = rank_lawyers(csv_path, config)
    return JSONResponse(content=ranked)


from fastapi.responses import FileResponse


@app.get('/ranked_lawyer_data.csv')
def get_ranked_csv():
    """Serve the generated CSV file if present."""
    frontend_path = os.path.join(os.getcwd(), 'frontend', 'public', 'ranked_lawyer_data.csv')
    root_path = os.path.join(os.getcwd(), 'ranked_lawyer_data.csv')

    if os.path.exists(frontend_path):
        return FileResponse(frontend_path, media_type='text/csv')
    if os.path.exists(root_path):
        return FileResponse(root_path, media_type='text/csv')

    raise HTTPException(status_code=404, detail='ranked_lawyer_data.csv not found')


if __name__ == '__main__':
    uvicorn.run('server:app', host='127.0.0.1', port=8000, reload=True)
