# PeriodO Labeling & Visualization Guide

How scholarly period definitions from PeriodO would appear in Chronoscope

---

## What PeriodO Gets You

### 1. **Multiple Scholarly Perspectives**

Instead of **one arbitrary definition**, you get **multiple authoritative views**:

#### Example: "Bronze Age" varies by region and scholar

```
Timeline view at 2500 BCE showing overlapping period definitions:

┌─────────────────────────────────────────────────────────────┐
│  Geographic Filter: [Eastern Mediterranean]                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                       │
│  Early Bronze (Levant)                                        │
│  3500-2250 BCE                                                │
│  Source: Archaeology of the land of the Bible                │
│                                                               │
│         ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                 │
│         Early Bronze Age (Crete)                             │
│         3100-2000 BCE                                         │
│         Source: Priniatikos Pyrgos Periodization             │
│                                                               │
│            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                   │
│            Early Bronze (Egypt)                               │
│            3000-2160 BCE                                      │
│            Source: UCLA Encyclopedia of Egyptology           │
│                                                               │
│  [Events shown as colored blocks on top of periods]          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**What this shows:**
- Same "era" has different dates in different regions
- Multiple scholarly sources coexist
- No single "correct" answer
- Scholarly rigor through citations

---

## 2. **Hierarchical Period Structures**

PeriodO includes parent-child relationships:

### Example: Minoan Periods in Crete

```
Visual hierarchy in timeline:

┌─────────────────────────────────────────────────────────────┐
│                   Bronze Age Crete                           │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  (Level 1)
│  3100 BCE ────────────────────────────────────> 1100 BCE    │
│                                                               │
│  At Zoom Level 10×:                                          │
│                                                               │
│  ┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐ │
│  │   Early Minoan   │ │  Middle Minoan   │ │ Late Minoan │ │  (Level 2)
│  │   3100-2100 BCE  │ │  2100-1600 BCE   │ │ 1600-1100   │ │
│  └──────────────────┘ └──────────────────┘ └─────────────┘ │
│                                                               │
│  At Zoom Level 100×:                                         │
│                                                               │
│  ┌─────┐ ┌─────┐ ┌─────┐                                    │
│  │ EM I│ │EM II│ │EM III│  ...                              │  (Level 3)
│  └─────┘ └─────┘ └─────┘                                    │
│  3100   2900    2600   2300                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Semantic Zoom:**
- Zoomed out → Show "Bronze Age Crete" (macro view)
- Medium zoom → Show "Early/Middle/Late Minoan" (meso view)
- Zoomed in → Show "EM I, EM II, EM III" (micro view)

---

## 3. **Geographic Specificity**

Periods are linked to specific places via Wikidata entities:

### Example: Simultaneous but Different Periods

```
Timeline at 1500 BCE showing different regions:

┌─────────────────────────────────────────────────────────────┐
│  Year: 1500 BCE                                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🌍 Egypt:                                                    │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                                   │
│     New Kingdom (1550-1077 BCE)                              │
│     • 18th Dynasty                                           │
│                                                               │
│  🌍 Greece:                                                   │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                                   │
│     Late Helladic / Mycenaean (1600-1100 BCE)               │
│     • Palace period                                          │
│                                                               │
│  🌍 Britain:                                                  │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                                   │
│     Middle Bronze Age (1500-1100 BCE)                        │
│     • Stone circles still in use                             │
│                                                               │
│  🌍 China:                                                    │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                                   │
│     Shang Dynasty (1600-1046 BCE)                           │
│     • Bronze casting technology                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**What this shows:**
- Avoid Euro-centric periodization
- Show what was happening simultaneously worldwide
- Each region has its own scholarly tradition
- Geographic filter lets users focus on areas of interest

---

## 4. **Full Scholarly Citations**

Every period includes its source:

### Example: Hover tooltip on a period

```
┌─────────────────────────────────────────────────────────────┐
│  User hovers on "Early Bronze" period                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📖 Early Bronze                                             │
│     3500-2250 BCE                                            │
│                                                               │
│     📍 Geographic Coverage:                                  │
│        Levant (Israel, Egypt, Jordan, Lebanon, Syria,       │
│        Cyprus, Turkey)                                       │
│                                                               │
│     📚 Source:                                               │
│        Mazar, A. (1990)                                      │
│        "Archaeology of the land of the Bible,                │
│         10,000-586 B.C.E"                                    │
│                                                               │
│     📝 Editorial Note:                                       │
│        See map as ill. 227, page 392.                        │
│                                                               │
│     🔗 Links:                                                │
│        [View in PeriodO] [WorldCat] [Wikidata]             │
│                                                               │
│     Related Events (12):                                     │
│        • Development of writing systems                      │
│        • Rise of city-states                                 │
│        • Early metallurgy                                    │
│        [View all...]                                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Scholarly Benefits:**
- Users can verify definitions
- Academic credibility
- Traceable to published sources
- Can cite your timeline in papers

---

## 5. **Multi-lingual Labels**

Periods keep their original language terminology:

### Example: Romanian archaeological periods

```
┌─────────────────────────────────────────────────────────────┐
│  Language: [Română ▼]                                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                                │
│  Cultura geto-dacica clasica                                 │
│  175 a. Chr. - 106 p. Chr.                                   │
│                                                               │
│  [Switch to English]                                         │
│                                                               │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                                │
│  Classical Geto-Dacian culture                               │
│  175 BCE - 106 CE                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Benefits:**
- Respect original scholarly terminology
- International accessibility
- Avoid anglicization of terms
- Show local archaeological traditions

---

## How You Would Label Events with PeriodO

### Strategy 1: Events Linked to Periods

**Data Structure:**
```typescript
{
  id: "evt_001",
  title: "Construction of Knossos Palace",
  description: "Major palace complex built at Knossos, Crete",
  start: new Date("-1900-01-01"),
  end: new Date("-1700-01-01"),
  category: "Architecture",
  
  // Link to PeriodO period
  periodId: "p0mn2ndx7vw",  // "Early Minoan" period
  
  // Location
  location: {
    name: "Knossos, Crete",
    wikidataId: "Q173342"
  }
}
```

**Visual Display:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Period Layer (20% opacity, background):                     │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                    │
│  Early Minoan (3100-2100 BCE)                                │
│                                                               │
│  Event Layer (100% opacity, foreground):                     │
│       █████████████████                                      │
│       Construction of Knossos Palace                         │
│       1900-1700 BCE                                          │
│                                                               │
│  User clicks event → Shows:                                  │
│    "This event occurred during the Early Minoan period"     │
│    [Link to period definition]                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Strategy 2: Period-Aware Search

**Search Query:** "What happened during the Late Bronze Age in Greece?"

**Results:**
```
┌─────────────────────────────────────────────────────────────┐
│  🔍 Search: "Late Bronze Age Greece"                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Found period: Late Helladic (1600-1100 BCE)                │
│  Source: Sandy Pylos: an archaeological history              │
│                                                               │
│  ✓ 47 events during this period:                            │
│                                                               │
│  📍 1600 BCE - Rise of Mycenaean civilization               │
│  📍 1450 BCE - Minoan palaces destroyed                     │
│  📍 1400 BCE - Linear B script developed                    │
│  📍 1250 BCE - Trojan War (traditional date)                │
│  📍 1200 BCE - Sea Peoples invasions                        │
│  📍 1100 BCE - Bronze Age collapse                          │
│                                                               │
│  [Show on timeline]                                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Strategy 3: Auto-suggest Periods

**When adding new event:**
```
┌─────────────────────────────────────────────────────────────┐
│  Add New Event                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Title: Battle of Kadesh                                     │
│  Date: 1274 BCE                                              │
│  Location: Syria ▼                                           │
│                                                               │
│  💡 Suggested Periods:                                       │
│                                                               │
│     ○ Late Bronze (Levant, 1550-1200 BCE)                   │
│       Source: Archaeology of the land of the Bible          │
│                                                               │
│     ○ New Kingdom (Egypt, 1550-1077 BCE)                    │
│       Source: UCLA Encyclopedia of Egyptology               │
│                                                               │
│     ○ Late Hittite Empire (Anatolia, 1344-1180 BCE)        │
│       Source: The Hittites and their contemporaries         │
│                                                               │
│  [Select period] [Skip]                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Visual Design Examples

### Minimal View (Zoomed Out)

```
┌─────────────────────────────────────────────────────────────┐
│  3000 BCE ──────────────────────────────────── 2000 BCE     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░             │
│  Early Bronze Age                                            │
│                                                               │
│  ██  ██   ███  █    ████  █  ██                             │
│  [Individual events as small blocks]                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Detailed View (Zoomed In)

```
┌─────────────────────────────────────────────────────────────┐
│  1274 BCE                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Period Context:                                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░             │
│  Late Bronze Age (Levant) - 1550-1200 BCE                   │
│                                                               │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░             │
│  19th Dynasty (Egypt) - 1292-1189 BCE                        │
│                                                               │
│  Event:                                                      │
│  ████████████                                                │
│  Battle of Kadesh                                            │
│  Egyptian-Hittite conflict                                   │
│                                                               │
│  🔗 Related Periods: Late Bronze, 19th Dynasty              │
│  📍 Location: Syria                                          │
│  👥 Participants: Ramesses II, Muwatalli II                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Scholarly Comparison View

```
┌─────────────────────────────────────────────────────────────┐
│  Compare Periodizations: "Bronze Age"                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Levant (Mazar 1990):                                        │
│  ▓▓▓▓▓▓Early▓▓▓▓▓▓│▓▓Middle▓▓│▓▓▓▓Late▓▓▓▓                 │
│  3500───────2250───1925──1550────1200                        │
│                                                               │
│  Crete (Priniatikos):                                        │
│     ▓▓▓▓▓Early▓▓▓▓│▓▓Middle▓▓│▓▓▓Late▓▓▓                    │
│     3100────────2100────1600──1100                           │
│                                                               │
│  Bulgaria (Archaeological):                                  │
│        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                                     │
│        5500─────────3900                                     │
│                                                               │
│  💡 Notice: Bulgaria's "Bronze Age" starts 2000 years       │
│     earlier than the Levant!                                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## What PeriodO Doesn't Give You

**You still need to create:**

1. **Individual Events** - PeriodO has periods, not specific events
   - Example: "Battle of Kadesh" (you add this)
   - But: "Late Bronze Age" (PeriodO provides this)

2. **Event Descriptions** - Rich narrative content
   - PeriodO: "New Kingdom (1550-1077 BCE)"
   - You add: Individual pharaohs, battles, monuments, etc.

3. **Relationships** - Causal connections between events
   - PeriodO: Period boundaries and hierarchies
   - You add: "This event caused..." or "Led to..."

4. **Media** - Images, maps, videos
   - PeriodO: Text definitions only
   - You add: Visual content

---

## Recommended Labeling Strategy

### Hybrid Approach: Periods + Events

**Three-Layer System:**

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Layer 1: PeriodO Periods (Background, 15% opacity)         │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░             │
│  Scholarly period definitions                                │
│  Toggle: [Europe] [Near East] [Asia] [Americas]            │
│                                                               │
│  Layer 2: Your Curated Events (Foreground, 100% opacity)    │
│  ████  ████  ██████  ███  ██████                            │
│  Specific historical events with details                     │
│  Toggle: [Politics] [Science] [Culture] [Economy]          │
│                                                               │
│  Layer 3: Playback Head & UI                                │
│  ───────────────|────────────────                           │
│                 ↑                                            │
│            Current time                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Example Timeline State

**User viewing 1274 BCE in Near East:**

- **Background:** 3 semi-transparent period bands showing:
  - Late Bronze (Levant)
  - New Kingdom (Egypt)  
  - Late Hittite Empire (Anatolia)

- **Foreground:** Specific events as colored blocks:
  - Battle of Kadesh (red, military)
  - Construction of Abu Simbel (blue, architecture)
  - Trade treaty with Cyprus (green, economics)

- **Hover:** Shows both event details AND relevant period context

- **Citation:** Event cites modern source, period cites PeriodO source

---

## Summary: The PeriodO Value Proposition

### What You Get:
✅ 9,001 scholarly period definitions  
✅ 272 authoritative sources with citations  
✅ Geographic specificity (Wikidata linked)  
✅ Hierarchical period structures  
✅ Multi-lingual support  
✅ No manual periodization needed  
✅ Instant scholarly credibility  
✅ Free, open data (public domain)  

### What You Build:
🔨 Individual historical events (~30,000)  
🔨 Event descriptions and narratives  
🔨 Relationships between events  
🔨 Visual design and UX  
🔨 Search and filtering  
🔨 Interactive features  

### The Result:
🎯 A scholarly timeline tool that shows both:
- **The framework** (PeriodO periods = scholarly consensus on eras)
- **The details** (Your events = specific things that happened)

**It's like having a map with both:**
- Country boundaries (PeriodO) ← The context
- Cities and roads (Your events) ← The details

Both are essential. PeriodO saves you from reinventing the periodization wheel and gives you academic legitimacy.
