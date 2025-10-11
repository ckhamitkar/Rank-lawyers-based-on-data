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

Notes about the ranker behavior
--------------------------------

- The `rank_lawyers` function accepts an optional JSON `config_file` that specifies weights for numeric columns (for example: `{ "description_length": 1.0 }`).
- If no config file is provided, or if the specified config file is missing or invalid, the ranker falls back to a sensible default weight set (by default it weights `description_length` by `1.0`). This makes it easy to call the ranker with just a CSV during testing or quick runs.


## Tests

To run the tests:

```pytest


The tests/ directory contains unit tests checking scraping correctness, ranking logic, data cleaning, etc. Ensure new modules/features include tests.


Added tests
-----------

Two additional tests were added to verify the ranker's behavior:

- `tests/test_ranker_extra.py::test_ranker_defaults_no_config` ensures that when no config file is provided the ranker uses the default weighting (preferring larger `description_length`).
- `tests/test_ranker_extra.py::test_ranker_with_config_file` verifies that providing a JSON config file alters ranking according to the provided weights.

Run the full test suite with:

```powershell
python -m pytest -q
```
