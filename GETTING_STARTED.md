# Getting Started Guide

This guide will help you set up and run the Lawyer Ranking System with the full-stack application.

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher (for frontend)
- npm or yarn (for frontend)

## Quick Start

### 1. Backend Setup

First, set up the Python backend:

```bash
# Clone the repository
git clone https://github.com/ckhamitkar/Rank-lawyers-based-on-data.git
cd Rank-lawyers-based-on-data

# (Optional) Create a virtual environment
python3 -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
python app.py
```

The backend API will be available at `http://localhost:5000`

### 2. Frontend Setup

In a new terminal, set up the React Native frontend:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Expo
npm start
```

This will open the Expo Developer Tools in your browser.

### 3. Running the App

From the Expo Developer Tools, you can:

- Press `w` to run on web browser
- Press `i` to run on iOS simulator (macOS only)
- Press `a` to run on Android emulator
- Scan QR code with Expo Go app on your phone

## Configuration

### Backend Configuration

The backend uses `config.json` to define weights for ranking criteria. You can edit this file directly or use the API/frontend to update it.

Example `config.json`:

```json
{
  "Chambers Rank": 1,
  "Years PE": 1,
  "Law360 News": 1.2,
  "LinkedIn Presence": 0.8
}
```

### Frontend Configuration

Update the API endpoint in `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000';
```

For mobile devices, replace `localhost` with your computer's IP address:

```javascript
const API_BASE_URL = 'http://192.168.1.100:5000';  // Example
```

## Features

### Rankings Screen

- View all lawyers ranked by score
- Pull-to-refresh to reload data
- See detailed metrics for each lawyer

### Config Screen

- Adjust weights for different ranking criteria
- Real-time validation
- Automatically refreshes rankings after save

## Troubleshooting

### Backend Issues

**Error: Module not found**
```bash
pip install -r requirements.txt
```

**Error: Port already in use**
```bash
# Change the port in app.py
app.run(debug=True, host='0.0.0.0', port=5001)
```

### Frontend Issues

**Cannot connect to backend**

1. Make sure the backend is running
2. Check the API_BASE_URL in `frontend/src/services/api.js`
3. For Android emulator, use `10.0.2.2` instead of `localhost`
4. For physical devices, use your computer's local IP

**Expo issues**
```bash
# Clear cache
expo start -c

# Or reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Customize the ranking criteria in `config.json`
- Add more data sources in `scraper.py`
- Extend the API with additional endpoints
- Customize the frontend UI and add new features

## Support

For issues or questions, please open an issue on GitHub.
