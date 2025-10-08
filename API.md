# API Documentation

## Base URL

```
http://localhost:5000
```

## Endpoints

### Get Ranked Lawyers

Retrieves a list of lawyers ranked by their calculated scores.

**Endpoint:** `GET /lawyers`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "Name": "Matthew Abbott",
      "Firm": "Paul Weiss",
      "Chambers Rank": "2",
      "Years PE": "11",
      "Chambers PE Rank": "2",
      "LinkedIn Presence": "0",
      "Law360 News": "86",
      "Law360 Cases": "118",
      "Google News": "0",
      "Speaking Engagements (2024/2025)": "0",
      "Thought Pieces (2025)": "11",
      "Firm PR Pieces": "3",
      "PE Brand Rank": "3",
      "PE Practice Band Rank": "2",
      "score": 238.0
    },
    ...
  ]
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - No lawyers found
- `500 Internal Server Error` - Server error

---

### Get Configuration

Retrieves the current weight configuration used for ranking.

**Endpoint:** `GET /config`

**Response:**

```json
{
  "success": true,
  "data": {
    "Chambers Rank": 1,
    "Years PE": 1,
    "Chambers PE Rank": 1,
    "LinkedIn Presence": 1,
    "Law360 News": 1,
    "Law360 Cases": 1,
    "Google News": 1,
    "Speaking Engagements (2024/2025)": 1,
    "Thought Pieces (2025)": 1,
    "Firm PR Pieces": 1,
    "PE Brand Rank": 1,
    "PE Practice Band Rank": 1
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Config file not found"
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Config file not found
- `500 Internal Server Error` - Server error

---

### Update Configuration

Updates the weight configuration used for ranking lawyers.

**Endpoint:** `PUT /config`

**Request Body:**

```json
{
  "Chambers Rank": 2,
  "Years PE": 1.5,
  "Law360 News": 1.2,
  "LinkedIn Presence": 0.8
}
```

**Response:**

```json
{
  "success": true,
  "message": "Configuration updated successfully",
  "data": {
    "Chambers Rank": 2,
    "Years PE": 1.5,
    "Law360 News": 1.2,
    "LinkedIn Presence": 0.8
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Invalid value for Chambers Rank: must be a number"
}
```

**Status Codes:**
- `200 OK` - Configuration updated successfully
- `400 Bad Request` - Invalid input (non-numeric values)
- `500 Internal Server Error` - Server error

---

## CORS

The API has CORS enabled for all origins, allowing the frontend to communicate with it from any domain.

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Examples

### Using cURL

```bash
# Get lawyers
curl http://localhost:5000/lawyers

# Get config
curl http://localhost:5000/config

# Update config
curl -X PUT http://localhost:5000/config \
  -H "Content-Type: application/json" \
  -d '{
    "Chambers Rank": 2,
    "Years PE": 1.5,
    "Law360 News": 1.2
  }'
```

### Using JavaScript (fetch)

```javascript
// Get lawyers
fetch('http://localhost:5000/lawyers')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Lawyers:', data.data);
    }
  });

// Update config
fetch('http://localhost:5000/config', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    'Chambers Rank': 2,
    'Years PE': 1.5,
  }),
})
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Config updated:', data.data);
    }
  });
```

### Using Python (requests)

```python
import requests

# Get lawyers
response = requests.get('http://localhost:5000/lawyers')
if response.json()['success']:
    lawyers = response.json()['data']
    print(f"Found {len(lawyers)} lawyers")

# Update config
new_config = {
    'Chambers Rank': 2,
    'Years PE': 1.5,
}
response = requests.put('http://localhost:5000/config', json=new_config)
if response.json()['success']:
    print('Configuration updated successfully')
```

## Running the API

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Start the server:
```bash
python app.py
```

3. The API will be available at `http://localhost:5000`

## Production Deployment

For production deployment, use a production WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Or use uWSGI:

```bash
pip install uwsgi
uwsgi --http 0.0.0.0:5000 --wsgi-file app.py --callable app --processes 4 --threads 2
```
