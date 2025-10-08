# Frontend - Lawyer Ranker

React Native application for the Lawyer Ranker system.

## Prerequisites

- Node.js 16+ and npm
- Expo CLI (`npm install -g expo-cli`)
- For iOS: macOS with Xcode
- For Android: Android Studio with Android SDK

## Installation

```bash
cd frontend
npm install
```

## Running the App

### Development Mode

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── LawyerCard.js
│   │   └── WeightSlider.js
│   ├── screens/         # Screen components
│   │   ├── RankingsScreen.js
│   │   └── ConfigScreen.js
│   ├── services/        # API and services
│   │   └── api.js
│   └── __tests__/       # Test files
│       ├── LawyerCard.test.js
│       ├── WeightSlider.test.js
│       ├── RankingsScreen.test.js
│       ├── ConfigScreen.test.js
│       └── integration.test.js
├── e2e/                 # End-to-end tests
│   ├── README.md
│   └── app.test.e2e.js
├── App.js               # Main app entry point
├── package.json
└── babel.config.js
```

## Testing Strategy

### Unit Tests
- Component rendering and props
- State management
- User interactions

### Integration Tests
- API mocking
- Screen flows
- State persistence

### E2E Tests (Scaffold)
- Complete user journeys
- Cross-platform testing
- Performance testing

See `/e2e/README.md` for E2E test setup instructions.

## API Configuration

The app connects to the Flask backend at `http://localhost:5000` by default.

To change the API URL, set the `REACT_APP_API_URL` environment variable:

```bash
export REACT_APP_API_URL=http://your-backend-url:5000
npm start
```

## Components

### LawyerCard
Displays individual lawyer information with rank and score.

### WeightSlider
Adjustable weight control for configuration metrics.

### RankingsScreen
Main screen showing ranked lawyers list with pull-to-refresh.

### ConfigScreen
Configuration screen for adjusting ranking weights.

## Build for Production

```bash
# Build for production
expo build:android
expo build:ios
expo build:web
```

## Troubleshooting

### Tests Failing
- Ensure all dependencies are installed: `npm install`
- Clear cache: `npm test -- --clearCache`
- Check that mock setups are correct

### App Not Starting
- Clear Expo cache: `expo start -c`
- Reset Metro bundler: `npx react-native start --reset-cache`

## Contributing

When adding new features:
1. Create component files in appropriate directories
2. Add corresponding test files in `__tests__/`
3. Update this README if new setup is required
