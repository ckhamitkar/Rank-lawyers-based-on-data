# Rank Lawyers Based On Data

A data-driven tool for ranking lawyers/law firms based on scraped metrics, allowing users to compare, sort, and evaluate lawyers using real-world data.

---

## Table of Contents

- [About](#about)  
- [Features](#features)  
- [Architecture / Components](#architecture--components)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Data Sources](#data-sources)  
- [Configuration & Customization](#configuration--customization)  
- [Tests](#tests)  
- [Contributing](#contributing)  
- [Roadmap](#roadmap)  
- [License](#license)  

---

## About

This project fetches, processes, and ranks lawyers (or law firms) based on data collected from online sources (e.g. directory sites). By combining quantitative metrics (such as reviews, cases handled, practice areas, etc.), the tool helps users make better-informed decisions when selecting legal representation.

---

## Features

- Web scraping of lawyer information (profiles, reviews, etc.)  
- Data cleaning and normalization  
- Scoring/ranking based on multiple attributes  
- Support for filtering by geography, practice area, review count, etc.  
- Output results in structured formats (HTML, CSV, etc.)  
- Modular design to allow addition of new data sources or ranking criteria  

---

## Architecture / Components

Here’s how this project is structured:

| Component | Purpose |
|---|---|
| `scraper.py` | Contains modules/functions to scrape data from target sources (e.g. Justia, state-specific directories). |
| `ranker.py` | Implements logic to score and rank lawyers based on scraped data. |
| `main.py` | Orchestrates the workflow: scraping → ranking → output. |
| `justia.html`, `justia_california.html` | Sample/raw HTML files or templates from one of the data sources. |
| `requirements.txt` | Python dependencies. |
| `tests/` | Unit tests to validate scraping and ranking logic. |

---

## Installation

1. Clone the repo  
   ```bash
   git clone https://github.com/ckhamitkar/Rank-lawyers-based-on-data.git
   cd Rank-lawyers-based-on-data

   
  (Optional but recommended) Create and activate a virtual environment

```python3 -m venv env
source env/bin/activate


## Install dependencies

```pip install -r requirements.txt
```

## Usage

### Running the Flask Backend API

Start the Flask API server to expose lawyer ranking endpoints:

```bash
python app.py
```

The API will be available at `http://localhost:5000` with the following endpoints:

**GET /lawyers** - Get ranked lawyers based on current configuration
```bash
curl http://localhost:5000/lawyers
```

**GET /config** - Get current ranking configuration (weights)
```bash
curl http://localhost:5000/config
```

**PUT /config** - Update ranking configuration
```bash
curl -X PUT http://localhost:5000/config \
  -H "Content-Type: application/json" \
  -d '{"Chambers Rank": 2, "Years PE": 1.5, "LinkedIn Presence": 1}'
```

**GET /health** - Health check endpoint
```bash
curl http://localhost:5000/health
```

### Running the Frontend Application

See `frontend/README.md` for detailed frontend setup and usage instructions.

**Quick start:**
```bash
cd frontend
npm install
npm start
```

This will start the Expo development server. You can then:
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Press `w` to run in web browser

### Running the Command Line Tool

You can also use the original command-line interface:

```bash
python main.py
```

By default, this runs the full workflow: scrape data, process it, compute rankings, and produce output.

You can also run specific modules:

**To scrape from a single source:**
```bash
python scraper.py
```

**To rank using the current config:**
```bash
python ranker.py
```

## Data Sources

This project currently supports (or is configured for) scraping data from:

Justia (national / state level)

[Add any others you use]

Data is retrieved from publicly available lawyer directories, review sites, etc. Be sure to check Terms of Service of these sites before scraping.

## Configuration & Customization

Ranking Criteria / Weights: Adjust via config file or commandline: which attributes (e.g. number of reviews, average rating, caseload, geography) count more.

Data Sources: Add or remove sources; extend scraper modules.

Filters: By state, by practice area, minimum review count, etc.

Output formats: CSV, HTML, perhaps JSON or dashboards.

## Tests

This project includes comprehensive automated tests for both backend and frontend.

### Backend Tests (Python/pytest)

The backend uses pytest for testing Flask API endpoints and core functionality.

**Run all backend tests:**
```bash
pytest
```

**Run with verbose output:**
```bash
pytest -v
```

**Run specific test file:**
```bash
pytest tests/test_backend.py
```

**Run with coverage:**
```bash
pytest --cov=. --cov-report=html
```

**Backend Test Coverage:**
- **API Endpoints:** Tests for `/lawyers` (GET), `/config` (GET/PUT), and `/health`
  - Successful requests with correct status codes and data structure
  - Error handling for missing files, invalid JSON, bad payloads
- **Configuration Updates:** Tests that config changes affect lawyer rankings
- **Edge Cases:** Empty files, invalid values, numeric validation
- **Integration:** End-to-end tests of config update → ranking recalculation flow

**Test Files:**
- `tests/test_backend.py` - Comprehensive Flask API tests (17 tests)
- `tests/test_ranker.py` - Ranker logic unit tests
- `tests/test_app.py` - Application integration tests

### Frontend Tests (JavaScript/Jest)

The frontend uses Jest and React Native Testing Library for component and integration testing.

**Setup (first time):**
```bash
cd frontend
npm install
```

**Run all frontend tests:**
```bash
cd frontend
npm test
```

**Run in watch mode (for development):**
```bash
cd frontend
npm run test:watch
```

**Generate coverage report:**
```bash
cd frontend
npm run test:coverage
```

**Frontend Test Coverage:**
- **Component Tests:**
  - `LawyerCard.test.js` - Lawyer card rendering, props, metrics display
  - `WeightSlider.test.js` - Slider controls, value changes, boundaries
- **Screen Tests:**
  - `RankingsScreen.test.js` - Lawyer list display, loading states, error handling
  - `ConfigScreen.test.js` - Config loading, weight adjustments, save functionality
- **Integration Tests:**
  - `integration.test.js` - Complete user flows with mocked APIs
  - Loading lawyers → changing config → seeing updated rankings
  - Error recovery and state management
- **API Mocking:** All tests use mocked API requests to simulate backend responses

**Test Files:**
- `frontend/src/__tests__/LawyerCard.test.js`
- `frontend/src/__tests__/WeightSlider.test.js`
- `frontend/src/__tests__/RankingsScreen.test.js`
- `frontend/src/__tests__/ConfigScreen.test.js`
- `frontend/src/__tests__/integration.test.js`

### End-to-End Tests (E2E)

E2E test scaffolding is provided for comprehensive system testing.

**Recommended Frameworks:**
- **Detox** (for React Native apps)
- **Cypress** (for web version with Expo)

**Setup and usage:**
See `frontend/e2e/README.md` for detailed E2E test setup instructions and examples.

**E2E Test Scenarios:**
- Complete user flow: launch → view rankings → adjust config → save → verify updated rankings
- Error handling: backend unavailable, network timeouts
- Performance: app launch time, scrolling, transitions
- Accessibility: screen readers, keyboard navigation

**Example E2E Test:**
- `frontend/e2e/app.test.e2e.js` - Detox test scaffold with example scenarios

### Running All Tests

**Backend only:**
```bash
pytest
```

**Frontend only:**
```bash
cd frontend && npm test
```

**Both backend and frontend:**
```bash
# Terminal 1 - Backend tests
pytest

# Terminal 2 - Frontend tests
cd frontend && npm test
```

### Continuous Integration

All tests are designed to run in CI/CD pipelines:
- Backend tests require Python 3.7+ and dependencies from `requirements.txt`
- Frontend tests require Node.js 16+ and dependencies from `frontend/package.json`
- No external services required (all use mocking)

### Test Philosophy

- **Comprehensive Coverage:** All major features have corresponding tests
- **Mocking:** External dependencies (APIs, files) are mocked for reliability
- **Fast Execution:** Tests run quickly to enable rapid development
- **Clear Assertions:** Tests clearly document expected behavior
- **Edge Cases:** Tests include error conditions and boundary cases
