# Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                            │
│                     (React Native + Expo)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │  Rankings Screen │              │   Config Screen  │         │
│  │                  │              │                  │         │
│  │ • List lawyers   │              │ • Edit weights   │         │
│  │ • Show scores    │              │ • Save config    │         │
│  │ • Pull-refresh   │              │ • Reset values   │         │
│  └────────┬─────────┘              └────────┬─────────┘         │
│           │                                 │                    │
│           └─────────────┬───────────────────┘                    │
│                         │                                        │
│                    ┌────▼────┐                                   │
│                    │ Context │                                   │
│                    │  (State)│                                   │
│                    └────┬────┘                                   │
│                         │                                        │
│                    ┌────▼────┐                                   │
│                    │   API   │                                   │
│                    │ Service │                                   │
│                    └────┬────┘                                   │
└─────────────────────────┼────────────────────────────────────────┘
                          │
                          │ HTTP/JSON
                          │
┌─────────────────────────▼────────────────────────────────────────┐
│                       Backend Layer                              │
│                      (Flask REST API)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  GET /lawyers    │  │   GET /config    │  │ PUT /config  │  │
│  │                  │  │                  │  │              │  │
│  │ Returns ranked   │  │ Returns current  │  │ Updates the  │  │
│  │ list of lawyers  │  │ weight config    │  │ weights      │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘  │
│           │                     │                    │           │
│           └─────────────────────┼────────────────────┘           │
│                                 │                                │
│                         ┌───────▼────────┐                       │
│                         │   app.py       │                       │
│                         │  (Flask App)   │                       │
│                         └───────┬────────┘                       │
└─────────────────────────────────┼────────────────────────────────┘
                                  │
                                  │ Import
                                  │
┌─────────────────────────────────▼────────────────────────────────┐
│                      Business Logic Layer                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │  ranker.py   │     │ scraper.py   │     │   main.py    │    │
│  │              │     │              │     │              │    │
│  │ Ranks lawyers│     │ Scrapes data │     │ Orchestrates │    │
│  │ by weighted  │     │ from web     │     │ workflow     │    │
│  │ criteria     │     │ sources      │     │              │    │
│  └──────┬───────┘     └──────┬───────┘     └──────────────┘    │
│         │                    │                                   │
│         └────────────────────┘                                   │
│                    │                                             │
└────────────────────┼──────────────────────────────────────────────┘
                     │
                     │ Read/Write
                     │
┌────────────────────▼──────────────────────────────────────────────┐
│                        Data Layer                                 │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────┐              ┌──────────────────┐          │
│  │  lawyer_data.csv │              │   config.json    │          │
│  │                  │              │                  │          │
│  │ • Name           │              │ • Weights for    │          │
│  │ • Firm           │              │   each criterion │          │
│  │ • Chambers Rank  │              │                  │          │
│  │ • Years PE       │              │                  │          │
│  │ • Law360 News    │              │                  │          │
│  │ • etc.           │              │                  │          │
│  └──────────────────┘              └──────────────────┘          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Viewing Rankings

```
User opens app
    ↓
Rankings Screen loads
    ↓
Context.loadLawyers() called
    ↓
API Service: GET /lawyers
    ↓
Flask: rank_lawyers(csv, config)
    ↓
ranker.py reads CSV and config
    ↓
Calculate scores & sort
    ↓
Return JSON response
    ↓
Context updates state
    ↓
Screen re-renders with data
```

### Updating Configuration

```
User edits weights
    ↓
User clicks Save
    ↓
Context.saveConfig(newConfig)
    ↓
API Service: PUT /config
    ↓
Flask validates data
    ↓
Write to config.json
    ↓
Return success response
    ↓
Context.loadLawyers() (auto-refresh)
    ↓
API Service: GET /lawyers
    ↓
Rankings recalculated with new weights
    ↓
Context updates state
    ↓
Both screens update
```

## Component Hierarchy

```
App
├── NavigationContainer
│   └── BottomTabNavigator
│       ├── Rankings Tab
│       │   └── RankingsScreen
│       │       ├── Appbar
│       │       └── ScrollView
│       │           └── Card (for each lawyer)
│       │               ├── Chip (rank)
│       │               ├── Title (name)
│       │               ├── Paragraph (firm)
│       │               └── Details
│       └── Config Tab
│           └── ConfigScreen
│               ├── Appbar
│               ├── ScrollView
│               │   ├── Info Card
│               │   └── TextInput (for each weight)
│               ├── Buttons (Save/Reset)
│               └── Snackbar
└── AppProvider (Context)
    └── All children have access to:
        • lawyers[]
        • config{}
        • loading
        • error
        • loadLawyers()
        • loadConfig()
        • saveConfig()
```

## Technology Stack

### Frontend
- **React Native** - Cross-platform framework
- **Expo** - Build & development toolchain  
- **React Navigation** - Navigation library
- **React Native Paper** - Material Design UI
- **Axios** - HTTP client
- **React Context API** - State management

### Backend
- **Flask** - Lightweight web framework
- **Flask-CORS** - Cross-origin support
- **Python** - Core language

### Data Processing
- **Python CSV module** - CSV parsing
- **JSON** - Configuration storage

## Platform Coverage

```
┌─────────────────────────────────────────────────┐
│               Single Codebase                    │
└─────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
    ┌─────┐      ┌─────┐      ┌─────┐
    │ Web │      │ iOS │      │ And │
    └─────┘      └─────┘      └─────┘
```

All platforms share:
- Same UI components
- Same business logic
- Same API integration
- Same state management

## API Contract

### Request/Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

### Endpoints

| Method | Endpoint   | Purpose                  | Auth |
|--------|-----------|--------------------------|------|
| GET    | /lawyers  | Get ranked lawyers       | No   |
| GET    | /config   | Get weight configuration | No   |
| PUT    | /config   | Update configuration     | No   |

## Security Layers (for Production)

```
┌──────────────────────────────────────────┐
│         HTTPS/TLS Encryption             │
├──────────────────────────────────────────┤
│      Authentication (JWT/OAuth)          │
├──────────────────────────────────────────┤
│         Authorization/RBAC               │
├──────────────────────────────────────────┤
│         Input Validation                 │
├──────────────────────────────────────────┤
│          Rate Limiting                   │
├──────────────────────────────────────────┤
│        CORS Configuration                │
└──────────────────────────────────────────┘
```

*Note: Current implementation is for development. Add these layers for production.*
