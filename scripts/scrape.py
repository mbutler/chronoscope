#!/usr/bin/env python3
"""
Chronoscope Wikipedia/Wikidata Scraper

Fetches historical events from Wikidata and generates TypeScript data files.

Usage:
    python scrape.py broad-modern-history
    python scrape.py --list
    python scrape.py --all
"""

import argparse
import json
import re
import time
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Optional

import requests
import yaml
from dateutil.parser import parse as parse_date

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

WIKIDATA_SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"
SCRIPT_DIR = Path(__file__).parent
CONFIG_DIR = SCRIPT_DIR / "config"
OUTPUT_DIR = SCRIPT_DIR.parent / "src" / "data" / "presets"

IMPORTANCE_THRESHOLDS = {
    "landmark": 100,
    "major": 50,
    "standard": 20,
    "minor": 0,
}


@dataclass
class ScrapedEvent:
    id: str
    title: str
    description: str
    start: datetime
    end: Optional[datetime]
    event_type: str
    categories: list[str]
    importance: str
    location_name: Optional[str] = None
    coordinates: Optional[tuple[float, float]] = None
    key_figures: list[str] = field(default_factory=list)
    wiki_url: Optional[str] = None
    wikidata_id: str = ""
    sitelink_count: int = 0
    tags: list[str] = field(default_factory=list)


@dataclass 
class ScrapeConfig:
    name: str
    description: str
    start_year: int
    end_year: int
    max_events: int = 200
    min_sitelinks: int = 20
    categories: list[str] = field(default_factory=lambda: ["politics", "science", "culture", "technology"])
    query_mode: str = "simple"
    event_types: list[str] = field(default_factory=list)  # Q-ids for types
    keywords: list[str] = field(default_factory=list)
    exclude_keywords: list[str] = field(default_factory=list)
    importance_boosts: dict[str, str] = field(default_factory=dict)
    era_threshold_years: int = 10
    period_threshold_days: int = 30


# ═══════════════════════════════════════════════════════════════════════════
# WIKIDATA QUERIES - SIMPLIFIED
# ═══════════════════════════════════════════════════════════════════════════

def build_simple_type_query(event_type_id: str, config: ScrapeConfig) -> str:
    """Simple query for a single event type"""
    return f"""
    SELECT ?event ?eventLabel ?eventDescription ?startDate ?endDate ?sitelinks
    WHERE {{
        ?event wdt:P31 wd:{event_type_id} .
        ?event wdt:P585 ?startDate .
        OPTIONAL {{ ?event wdt:P582 ?endDate . }}
        FILTER(YEAR(?startDate) >= {config.start_year} && YEAR(?startDate) <= {config.end_year})
        ?event wikibase:sitelinks ?sitelinks .
        FILTER(?sitelinks >= {config.min_sitelinks})
        SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    ORDER BY DESC(?sitelinks)
    LIMIT {config.max_events // max(1, len(config.event_types))}
    """


def build_keyword_query(keyword: str, config: ScrapeConfig) -> str:
    """Query by keyword in label"""
    return f"""
    SELECT ?event ?eventLabel ?eventDescription ?startDate ?endDate ?sitelinks
    WHERE {{
        ?event rdfs:label ?label .
        FILTER(LANG(?label) = "en")
        FILTER(CONTAINS(LCASE(?label), "{keyword.lower()}"))
        ?event wdt:P585 ?startDate .
        OPTIONAL {{ ?event wdt:P582 ?endDate . }}
        FILTER(YEAR(?startDate) >= {config.start_year} && YEAR(?startDate) <= {config.end_year})
        ?event wikibase:sitelinks ?sitelinks .
        FILTER(?sitelinks >= {config.min_sitelinks})
        SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    ORDER BY DESC(?sitelinks)
    LIMIT {config.max_events // max(1, len(config.keywords))}
    """


def query_wikidata(query: str, retries: int = 2) -> list[dict]:
    """Execute SPARQL query"""
    headers = {
        "User-Agent": "Chronoscope/1.0 (timeline visualization tool)",
        "Accept": "application/sparql-results+json"
    }
    
    for attempt in range(retries + 1):
        try:
            response = requests.get(
                WIKIDATA_SPARQL_ENDPOINT,
                params={"query": query, "format": "json"},
                headers=headers,
                timeout=60
            )
            response.raise_for_status()
            return response.json().get("results", {}).get("bindings", [])
        except Exception as e:
            if attempt < retries:
                print(f"    ⚠️  Retrying... ({e})")
                time.sleep(3)
            else:
                print(f"    ❌ Query failed: {e}")
                return []
    return []


# ═══════════════════════════════════════════════════════════════════════════
# PROCESSING
# ═══════════════════════════════════════════════════════════════════════════

def parse_wikidata_date(date_str: str) -> Optional[datetime]:
    if not date_str:
        return None
    try:
        date_str = re.sub(r'[TZ].*', '', date_str)
        if re.match(r"^\d{4}$", date_str):
            return datetime(int(date_str), 1, 1)
        if re.match(r"^\d{4}-\d{2}$", date_str):
            return datetime.strptime(date_str, "%Y-%m")
        return parse_date(date_str)
    except:
        return None


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:50]


def infer_categories(title: str, description: str, config: ScrapeConfig) -> list[str]:
    text = (title + " " + description).lower()
    
    hints = {
        "politics": ["war", "battle", "treaty", "revolution", "election", "president", 
                     "invasion", "attack", "assassination", "coup", "crisis", "conflict"],
        "science": ["discovery", "mission", "space", "apollo", "satellite", "research",
                    "telescope", "experiment", "dna", "vaccine", "nobel"],
        "technology": ["computer", "internet", "invention", "patent", "iphone", "software",
                       "digital", "transistor", "network"],
        "culture": ["film", "album", "concert", "festival", "art", "music", "olympic",
                    "movie", "book", "theater"],
    }
    
    matches = []
    for cat, keywords in hints.items():
        if cat in config.categories:
            if any(kw in text for kw in keywords):
                matches.append(cat)
    
    return matches if matches else [config.categories[0]]


def process_results(results: list[dict], config: ScrapeConfig) -> list[ScrapedEvent]:
    events: dict[str, ScrapedEvent] = {}
    seen_titles: set[str] = set()
    
    for row in results:
        event_uri = row.get("event", {}).get("value", "")
        wikidata_id = event_uri.split("/")[-1] if event_uri else ""
        
        if not wikidata_id or wikidata_id in events:
            continue
        
        title = row.get("eventLabel", {}).get("value", "")
        if not title or re.match(r'^Q\d+$', title):
            continue
        
        title_key = title.lower().strip()
        if title_key in seen_titles:
            continue
        seen_titles.add(title_key)
        
        description = row.get("eventDescription", {}).get("value", "")
        
        # Skip excluded
        text_lower = (title + " " + description).lower()
        if any(kw.lower() in text_lower for kw in config.exclude_keywords):
            continue
        
        start = parse_wikidata_date(row.get("startDate", {}).get("value", ""))
        end = parse_wikidata_date(row.get("endDate", {}).get("value", ""))
        
        if not start:
            continue
        
        sitelinks = int(row.get("sitelinks", {}).get("value", "0"))
        
        # Determine type
        if not end:
            event_type = "moment"
        elif (end - start).days >= config.era_threshold_years * 365:
            event_type = "era"
        elif (end - start).days >= config.period_threshold_days:
            event_type = "period"
        else:
            event_type = "moment"
        
        # Importance
        importance = config.importance_boosts.get(wikidata_id, None)
        if not importance:
            for imp, threshold in IMPORTANCE_THRESHOLDS.items():
                if sitelinks >= threshold:
                    importance = imp
                    break
            else:
                importance = "minor"
        
        categories = infer_categories(title, description, config)
        
        events[wikidata_id] = ScrapedEvent(
            id=slugify(title),
            title=title,
            description=description or f"Historical event: {title}",
            start=start,
            end=end,
            event_type=event_type,
            categories=categories,
            importance=importance,
            wiki_url=f"https://en.wikipedia.org/wiki/{title.replace(' ', '_')}",
            wikidata_id=wikidata_id,
            sitelink_count=sitelinks,
        )
    
    return list(events.values())


# ═══════════════════════════════════════════════════════════════════════════
# OUTPUT
# ═══════════════════════════════════════════════════════════════════════════

def escape_string(s: str) -> str:
    return (s or "").replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ").replace("\r", "")


def generate_typescript(events: list[ScrapedEvent], config: ScrapeConfig) -> str:
    importance_order = {"landmark": 0, "major": 1, "standard": 2, "minor": 3}
    events.sort(key=lambda e: (importance_order.get(e.importance, 3), e.start))
    events = events[:config.max_events]
    
    var_name = slugify(config.name).replace('-', '_') + "_events"
    
    lines = [
        "// " + "═" * 75,
        f"// {config.name.upper().replace('-', ' ')}",
        f"// {config.description}",
        f"// Generated: {datetime.now().isoformat()}",
        f"// Events: {len(events)}",
        "// " + "═" * 75,
        "",
        'import { TimelineEvent, EventCategory, EventType, EventImportance } from "../types";',
        "",
        f"export const {var_name}: TimelineEvent[] = [",
    ]
    
    for event in events:
        start_str = event.start.strftime('%Y-%m-%dT%H:%M:%S')
        end_str = event.end.strftime('%Y-%m-%dT%H:%M:%S') if event.end else None
        
        lines.append("  {")
        lines.append(f'    id: "{event.id}",')
        lines.append(f'    title: "{escape_string(event.title)}",')
        lines.append(f'    description: "{escape_string(event.description)}",')
        lines.append(f'    type: "{event.event_type}" as EventType,')
        lines.append(f'    start: new Date("{start_str}"),')
        if end_str:
            lines.append(f'    end: new Date("{end_str}"),')
        lines.append(f'    categories: {json.dumps(event.categories)} as EventCategory[],')
        lines.append(f'    importance: "{event.importance}" as EventImportance,')
        if event.wiki_url:
            lines.append(f'    wikiUrl: "{escape_string(event.wiki_url)}",')
        lines.append("  },")
    
    lines.append("];")
    return "\n".join(lines)


# ═══════════════════════════════════════════════════════════════════════════
# CONFIG & MAIN
# ═══════════════════════════════════════════════════════════════════════════

def load_config(name: str) -> Optional[ScrapeConfig]:
    config_path = CONFIG_DIR / f"{name}.yaml"
    if not config_path.exists():
        print(f"❌ Config not found: {config_path}")
        return None
    
    with open(config_path) as f:
        data = yaml.safe_load(f)
    
    return ScrapeConfig(
        name=data.get("name", name),
        description=data.get("description", ""),
        start_year=data.get("start_year", 1900),
        end_year=data.get("end_year", 2025),
        max_events=data.get("max_events", 200),
        min_sitelinks=data.get("min_sitelinks", 20),
        categories=data.get("categories", ["politics", "science", "culture", "technology"]),
        query_mode=data.get("query_mode", "simple"),
        event_types=data.get("event_types", []),
        keywords=data.get("keywords", []),
        exclude_keywords=data.get("exclude_keywords", []),
        importance_boosts=data.get("importance_boosts", {}),
        era_threshold_years=data.get("era_threshold_years", 10),
        period_threshold_days=data.get("period_threshold_days", 30),
    )


def list_configs() -> list[str]:
    if not CONFIG_DIR.exists():
        return []
    return sorted([p.stem for p in CONFIG_DIR.glob("*.yaml")])


def run_scrape(config_name: str) -> bool:
    print(f"\n{'═' * 60}")
    print(f"📚 SCRAPING: {config_name}")
    print(f"{'═' * 60}")
    
    config = load_config(config_name)
    if not config:
        return False
    
    print(f"  📋 {config.description}")
    print(f"  📅 {config.start_year} - {config.end_year}")
    print(f"  🎯 Max: {config.max_events} | Min sitelinks: {config.min_sitelinks}")
    
    all_results = []
    
    # Default event types if none specified
    default_types = [
        "Q178561",   # battle
        "Q198",      # war
        "Q8065",     # revolution
        "Q131569",   # treaty
        "Q2001676",  # terrorist attack
        "Q124757",   # coup
    ]
    
    if config.query_mode == "keyword" and config.keywords:
        for keyword in config.keywords:
            print(f"\n  🔍 Keyword: {keyword}")
            query = build_keyword_query(keyword, config)
            results = query_wikidata(query)
            print(f"    ✓ {len(results)} results")
            all_results.extend(results)
            time.sleep(1)  # Rate limit
    else:
        types = config.event_types if config.event_types else default_types
        for type_id in types:
            print(f"\n  🔍 Type: {type_id}")
            query = build_simple_type_query(type_id, config)
            results = query_wikidata(query)
            print(f"    ✓ {len(results)} results")
            all_results.extend(results)
            time.sleep(1)
    
    if not all_results:
        print("\n  ⚠️  No results found")
        return False
    
    print(f"\n  🔄 Processing {len(all_results)} raw results...")
    events = process_results(all_results, config)
    print(f"  ✓ {len(events)} unique events")
    
    if not events:
        print("  ⚠️  No valid events")
        return False
    
    print("  📝 Generating TypeScript...")
    output = generate_typescript(events, config)
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / f"{slugify(config.name)}.ts"
    
    with open(output_path, "w") as f:
        f.write(output)
    
    final_count = min(len(events), config.max_events)
    print(f"\n  ✅ {output_path}")
    print(f"  📊 {final_count} events")
    
    # Quick stats
    by_imp = {}
    for e in events[:config.max_events]:
        by_imp[e.importance] = by_imp.get(e.importance, 0) + 1
    print(f"  📈 {by_imp}")
    
    return True


def main():
    parser = argparse.ArgumentParser(description="Scrape Wikidata for timeline events")
    parser.add_argument("config", nargs="?", help="Config name")
    parser.add_argument("--list", action="store_true", help="List configs")
    parser.add_argument("--all", action="store_true", help="Run all")
    
    args = parser.parse_args()
    
    if args.list:
        print("\n📋 Configs:")
        for c in list_configs():
            cfg = load_config(c)
            print(f"  • {c}: {cfg.description if cfg else ''}")
        return
    
    if args.all:
        for c in list_configs():
            run_scrape(c)
        return
    
    if args.config:
        run_scrape(args.config)
    else:
        parser.print_help()
        print(f"\nConfigs: {', '.join(list_configs())}")


if __name__ == "__main__":
    main()
