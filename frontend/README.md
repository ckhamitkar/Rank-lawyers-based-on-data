# Lawyer Ranking Frontend

A cross-platform (web, iOS, Android) mobile application for viewing lawyer rankings and managing weight configurations. Built with React Native (Expo) and React Native Paper.

## Features

- **Rankings Screen**: View ranked lawyers with their scores and details
- **Configuration Screen**: Update weight values for different ranking criteria
- **Cross-Platform**: Runs on iOS, Android, and Web
- **Real-time Updates**: Pull-to-refresh functionality
- **Material Design**: Clean UI with React Native Paper components

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

Before running the app, make sure to configure the API endpoint:

1. Open `src/services/api.js`
2. Update the `API_BASE_URL` constant to point to your backend server:
```javascript
const API_BASE_URL = 'http://your-backend-url:5000';
```

For local development:
- **Web**: Use `http://localhost:5000`
- **iOS Simulator**: Use `http://localhost:5000`
- **Android Emulator**: Use `http://10.0.2.2:5000`
- **Physical Device**: Use your computer's IP address (e.g., `http://192.168.1.100:5000`)

## Running the Application

### Start the Backend API

First, ensure the backend API is running:
```bash
cd ..
python app.py
```

The backend should be available at `http://localhost:5000`.

### Start the Frontend

In a new terminal, navigate to the frontend directory and start Expo:

```bash
cd frontend
npm start
```

This will open the Expo Developer Tools in your browser.

### Platform-Specific Commands

**iOS Simulator:**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

**Web Browser:**
```bash
npm run web
```

## Project Structure

```
frontend/
├── App.js                      # Main app component with navigation
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── babel.config.js             # Babel configuration
├── src/
│   ├── screens/
│   │   ├── RankingsScreen.js  # Displays ranked lawyers
│   │   └── ConfigScreen.js    # Weight configuration
│   ├── services/
│   │   └── api.js             # API service for backend calls
│   ├── context/
│   │   └── AppContext.js      # Global state management
│   └── components/            # Reusable components (if any)
└── assets/                    # Images and icons
```

## API Endpoints

The frontend interacts with the following backend endpoints:

### GET /lawyers
Fetches the list of ranked lawyers.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "Name": "John Doe",
      "Firm": "Law Firm ABC",
      "score": 85.5,
      "Chambers Rank": 3,
      "Years PE": 10,
      ...
    }
  ]
}
```

### GET /config
Fetches the current weight configuration.

**Response:**
```json
{
  "success": true,
  "data": {
    "Chambers Rank": 1,
    "Years PE": 1,
    "Law360 News": 1,
    ...
  }
}
```

### PUT /config
Updates the weight configuration.

**Request Body:**
```json
{
  "Chambers Rank": 2,
  "Years PE": 1.5,
  "Law360 News": 1,
  ...
}
```

**Response:**
```json
{
  "success": true,
  "message": "Configuration updated successfully",
  "data": { ... }
}
```

## State Management

The app uses React Context API for global state management:

- `AppContext.js` provides:
  - `lawyers`: Array of ranked lawyer objects
  - `config`: Object with weight configurations
  - `loading`: Boolean for loading state
  - `error`: Error message if any
  - `loadLawyers()`: Function to fetch lawyers
  - `loadConfig()`: Function to fetch config
  - `saveConfig(newConfig)`: Function to update config

## Screens

### Rankings Screen
- Displays lawyers in ranked order
- Shows key metrics and scores
- Pull-to-refresh to reload data
- Clean card-based UI

### Config Screen
- Shows all weight configuration options
- Allows editing weight values
- Validates numeric input
- Save/Reset functionality
- Automatically refreshes rankings after save

## Styling

The app uses React Native Paper's Material Design components with a custom color scheme:

- Primary Color: `#6200ee` (Purple)
- Background: `#f5f5f5` (Light Gray)
- Cards: White with elevation

## Troubleshooting

### Cannot connect to backend

1. Ensure the backend is running (`python app.py`)
2. Check the API_BASE_URL in `src/services/api.js`
3. For Android emulator, use `10.0.2.2` instead of `localhost`
4. For physical devices, use your computer's local IP address

### Dependencies not installing

1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again

### Expo issues

1. Ensure you have the latest Expo CLI: `npm install -g expo-cli`
2. Clear Expo cache: `expo start -c`

## Development

To make changes to the app:

1. Edit files in the `src/` directory
2. The app will hot-reload automatically
3. Use React Native Debugger or Chrome DevTools for debugging

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

### Web
```bash
expo build:web
```

For more details, refer to the [Expo documentation](https://docs.expo.dev/).

## Technologies Used

- **React Native**: Cross-platform mobile framework
- **Expo**: Development and build toolchain
- **React Navigation**: Navigation library
- **React Native Paper**: Material Design components
- **Axios**: HTTP client for API calls
- **React Context API**: State management

## License

This project is part of the Lawyer Ranking system.
