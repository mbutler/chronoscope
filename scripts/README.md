# Chronoscope Data Scraper

Fetches historical events from Wikidata and generates TypeScript data files for the timeline.

## Setup

```bash
cd scripts
pip install -r requirements.txt
```

## Usage

```bash
# List available presets
python scrape.py --list

# Run a specific preset
python scrape.py broad-modern-history
python scrape.py wwii-detailed
python scrape.py space-race

# Run all presets
python scrape.py --all
```

## Available Presets

| Preset | Description | Events |
|--------|-------------|--------|
| `broad-modern-history` | Major world events 1900-2025 | ~150 |
| `wwii-detailed` | WWII battles and operations | ~400 |
| `cold-war` | Cold War events and crises | ~250 |
| `space-race` | Space exploration milestones | ~200 |
| `tech-revolution` | Computing and digital tech | ~200 |
| `civil-rights` | Social justice movements | ~200 |

## Creating Custom Presets

Create a YAML file in `config/` with these options:

```yaml
name: my-preset
description: Description of the preset

# Time range
start_year: 1900
end_year: 2025

# Event limits
max_events: 200
min_sitelinks: 20  # Higher = more notable events only

# Categories to include
categories:
  - politics
  - science
  - culture
  - technology

# Optional: Wikidata classes to query (Q-ids)
wikidata_classes:
  - Q198     # war
  - Q178561  # battle

# Optional: Filter to events "part of" something (e.g., WWII)
part_of: Q362

# Event type thresholds
era_threshold_years: 10      # Events longer than this = "era"
period_threshold_days: 30    # Events longer than this = "period"

# Manual importance overrides
importance_boosts:
  Q43512: landmark  # Moon landing
```

## How It Works

1. **Queries Wikidata** using SPARQL for events matching your criteria
2. **Filters by sitelink count** (more Wikipedia languages = more notable)
3. **Infers importance** from sitelinks (150+ = landmark, 80+ = major, etc.)
4. **Determines event type** from duration (moment/period/era)
5. **Fetches key figures** associated with each event
6. **Generates TypeScript** data files in `src/data/presets/`

## Loading Presets in the App

After running a scrape, import the preset in your code:

```typescript
// src/data/timelineData.ts
import { broad_modern_history_events } from "./presets/broad-modern-history";

export const allEvents: TimelineEvent[] = broad_modern_history_events;
```

Or merge multiple presets:

```typescript
import { broad_modern_history_events } from "./presets/broad-modern-history";
import { space_race_events } from "./presets/space-race";

export const allEvents = [...broad_modern_history_events, ...space_race_events];
```
