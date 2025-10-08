from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from typing import Optional
import os
import uvicorn
from ranker import rank_lawyers

app = FastAPI(title="Lawyer Ranking API")

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


if __name__ == '__main__':
    uvicorn.run('server:app', host='127.0.0.1', port=8000, reload=True)
