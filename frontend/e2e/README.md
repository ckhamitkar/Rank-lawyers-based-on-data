# E2E Testing Setup

This directory contains End-to-End (E2E) test setup and examples for the Lawyer Ranker app.

## Recommended E2E Testing Frameworks

### Option 1: Detox (Recommended for React Native)

Detox is a gray box end-to-end testing framework for mobile apps.

#### Setup

```bash
# Install Detox CLI
npm install -g detox-cli

# Install Detox dependencies
npm install --save-dev detox

# Initialize Detox configuration
detox init
```

#### Configuration

Add to `package.json`:

```json
"detox": {
  "configurations": {
    "ios.sim.debug": {
      "device": {
        "type": "iPhone 14"
      },
      "app": "ios.debug"
    },
    "android.emu.debug": {
      "device": {
        "avdName": "Pixel_5_API_31"
      },
      "app": "android.debug"
    }
  },
  "apps": {
    "ios.debug": {
      "type": "ios.app",
      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/LawyerRanker.app",
      "build": "xcodebuild -workspace ios/LawyerRanker.xcworkspace -scheme LawyerRanker -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build"
    },
    "android.debug": {
      "type": "android.apk",
      "binaryPath": "android/app/build/outputs/apk/debug/app-debug.apk",
      "build": "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug"
    }
  }
}
```

#### Running Tests

```bash
# Build the app
detox build --configuration ios.sim.debug

# Run tests
detox test --configuration ios.sim.debug
```

### Option 2: Cypress (For Web Version with Expo)

If you're running the app on web with Expo, you can use Cypress.

#### Setup

```bash
# Install Cypress
npm install --save-dev cypress

# Open Cypress for the first time
npx cypress open
```

#### Configuration

Create `cypress.config.js`:

```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:19006',
    supportFile: false,
  },
});
```

#### Running Tests

```bash
# Start the Expo web server
npm run web

# In another terminal, run Cypress
npx cypress open
```

## Sample E2E Test Scenarios

The following test scenarios should be covered:

1. **Complete User Flow**
   - Launch app
   - View lawyer rankings
   - Navigate to config screen
   - Adjust weights
   - Save configuration
   - Return to rankings and verify changes

2. **Error Handling**
   - Test behavior when backend is unavailable
   - Test invalid config values
   - Test network timeout scenarios

3. **Performance**
   - Test app launch time
   - Test screen transition animations
   - Test list scrolling performance

4. **Accessibility**
   - Verify screen readers can navigate the app
   - Test keyboard navigation
   - Verify color contrast

See the example test files in this directory for reference implementations.
