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
- **REST API backend** for programmatic access to rankings and configuration
- **Cross-platform mobile/web frontend** built with React Native (Expo) for iOS, Android, and Web

---

## Architecture / Components

Here’s how this project is structured:

| Component | Purpose |
|---|---|
| `scraper.py` | Contains modules/functions to scrape data from target sources (e.g. Justia, state-specific directories). |
| `ranker.py` | Implements logic to score and rank lawyers based on scraped data. |
| `main.py` | Orchestrates the workflow: scraping → ranking → output. |
| `app.py` | **Flask REST API backend** providing endpoints for fetching lawyers and managing config. |
| `frontend/` | **React Native (Expo) frontend** for cross-platform mobile and web application. |
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

## Usage

Here is how to run the tool:

### Command-Line Interface

```bash
python main.py
```

By default, this runs the full workflow: scrape data, process it, compute rankings, and produce output.

You can also use/run specific modules:

To scrape from a single source:

```bash
python scraper.py --source justia
```

To rank using specific criteria:

```bash
python ranker.py --weights review_score:0.5, case_volume:0.3, geography:0.2
```

### REST API Backend

Start the Flask API server:

```bash
python app.py
```

The API will be available at `http://localhost:5000` with the following endpoints:

- `GET /lawyers` - Retrieve ranked lawyers
- `GET /config` - Get current weight configuration
- `PUT /config` - Update weight configuration

Example API calls:

```bash
# Get ranked lawyers
curl http://localhost:5000/lawyers

# Get configuration
curl http://localhost:5000/config

# Update configuration
curl -X PUT http://localhost:5000/config \
  -H "Content-Type: application/json" \
  -d '{"Chambers Rank": 2, "Years PE": 1.5}'
```

### Cross-Platform Frontend

The project includes a React Native (Expo) frontend for iOS, Android, and Web.

See the [Frontend README](frontend/README.md) for detailed setup and usage instructions.

Quick start:

```bash
cd frontend
npm install
npm start
```

This will open the Expo Developer Tools where you can run the app on:
- iOS Simulator
- Android Emulator
- Web Browser
- Physical Device (via Expo Go app)



(Output format options, flags, etc., should be explained here.)

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

To run the tests:

```pytest


The tests/ directory contains unit tests checking scraping correctness, ranking logic, data cleaning, etc. Ensure new modules/features include tests.
