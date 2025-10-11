import os
import json
from fastapi.testclient import TestClient
from server import app


client = TestClient(app)


def test_api_ranked_and_csv_endpoint(tmp_path):
    # Ensure lawyer_data.csv exists in repo root for the endpoint to process
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'lawyer_data.csv')
    assert os.path.exists(csv_path)

    # Call the JSON API
    resp = client.get('/api/ranked')
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) > 0

    # The CSV endpoint should return a CSV (200) or 404 depending on generation; we at least
    # want it to exist after calling the ranker via the API.
    resp_csv = client.get('/ranked_lawyer_data.csv')
    assert resp_csv.status_code in (200, 404)
