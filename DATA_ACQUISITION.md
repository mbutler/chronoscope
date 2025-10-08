# Data Acquisition Strategies for Historical Events

How to collect 30,000+ high-quality historical events with dates, descriptions, images, and citations.

---

## TL;DR - Best Sources

🥇 **#1: Wikidata** - Structured, queryable, multilingual, has images  
🥈 **#2: Wikipedia + DBpedia** - Rich descriptions, already curated  
🥉 **#3: Museum/Library APIs** - High-quality, specialized content  
🏅 **#4: Academic Datasets** - Most scholarly, but smaller  

---

## Source 1: Wikidata (RECOMMENDED)

### What is Wikidata?

**Wikidata** is the structured data backbone of Wikipedia. It's a free, open knowledge base that:
- Has **~100 million items** (including historical events)
- Structured data (not prose like Wikipedia)
- Multilingual (labels in 300+ languages)
- Has dates, locations, images, references
- Queryable via SPARQL (like SQL for knowledge graphs)
- **Public domain** (CC0 license)

**URL:** https://www.wikidata.org  
**Query Service:** https://query.wikidata.org

### What Historical Data Does Wikidata Have?

**Event Types in Wikidata:**
- Battles and wars (with precise dates, locations, participants)
- Political events (elections, treaties, revolutions)
- Scientific discoveries and inventions
- Cultural events (art movements, publications)
- Natural disasters
- Expeditions and explorations
- Births and deaths of notable people
- Construction of buildings and monuments

**Structured Properties:**
- **Point in time** (P585) - exact date
- **Start time** (P580) - event begins
- **End time** (P582) - event ends
- **Location** (P276) - where it happened
- **Participants** (P710) - who was involved
- **Described by source** (P1343) - citations
- **Image** (P18) - photos/illustrations
- **Commons category** (P373) - more images

### How to Query Wikidata

**SPARQL Query Service:** https://query.wikidata.org/

#### Example 1: Get 1000 Battles with Dates and Locations

```sparql
SELECT ?battle ?battleLabel ?date ?locationLabel ?image
WHERE {
  ?battle wdt:P31 wd:Q178561 .          # instance of: battle
  ?battle wdt:P585 ?date .               # point in time
  OPTIONAL { ?battle wdt:P276 ?location . }  # location
  OPTIONAL { ?battle wdt:P18 ?image . }      # image
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 1000
```

**Try it live:** [Click to run query](https://query.wikidata.org/#SELECT%20%3Fbattle%20%3FbattleLabel%20%3Fdate%20%3FlocationLabel%20%3Fimage%0AWHERE%20%7B%0A%20%20%3Fbattle%20wdt%3AP31%20wd%3AQ178561%20.%0A%20%20%3Fbattle%20wdt%3AP585%20%3Fdate%20.%0A%20%20OPTIONAL%20%7B%20%3Fbattle%20wdt%3AP276%20%3Flocation%20.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fbattle%20wdt%3AP18%20%3Fimage%20.%20%7D%0A%20%20%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%7D%0A%7D%0ALIMIT%201000)

#### Example 2: Get Scientific Discoveries by Date Range

```sparql
SELECT ?discovery ?discoveryLabel ?date ?discovererLabel ?description
WHERE {
  ?discovery wdt:P31 wd:Q41298 .         # instance of: scientific discovery
  ?discovery wdt:P585 ?date .            # point in time
  OPTIONAL { ?discovery wdt:P61 ?discoverer . }  # discoverer
  
  FILTER(YEAR(?date) >= 1800 && YEAR(?date) <= 1900)
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?date
```

#### Example 3: Get Events in Specific Location

```sparql
SELECT ?event ?eventLabel ?date ?typeLabel ?image
WHERE {
  ?event wdt:P276 wd:Q90 .               # location: Paris
  ?event wdt:P31 ?type .                 # type of event
  ?event wdt:P585 ?date .                # date
  OPTIONAL { ?event wdt:P18 ?image . }
  
  FILTER(YEAR(?date) >= 1700 && YEAR(?date) <= 1900)
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?date
```

#### Example 4: Get Events by Category/Type

Useful event types in Wikidata:

```sparql
# Wars: wd:Q198
# Battles: wd:Q178561
# Revolutions: wd:Q10931
# Treaties: wd:Q93288
# Scientific discoveries: wd:Q41298
# Inventions: wd:Q205650
# Expeditions: wd:Q2401485
# Natural disasters: wd:Q3839081
# Epidemics: wd:Q3241045
# Architectural structures: wd:Q811979
# Publications: wd:Q732577
# Assassinations: wd:Q3882219
# Elections: wd:Q40231

SELECT ?event ?eventLabel ?date ?locationLabel
WHERE {
  VALUES ?type { wd:Q178561 wd:Q198 wd:Q10931 }  # battles, wars, revolutions
  
  ?event wdt:P31 ?type .
  ?event wdt:P585 ?date .
  OPTIONAL { ?event wdt:P276 ?location . }
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?date
LIMIT 5000
```

### Getting Rich Descriptions

Wikidata has IDs, but for descriptions go to Wikipedia:

```typescript
// Workflow:
// 1. Get Wikidata ID from SPARQL query (e.g., Q82664)
// 2. Get Wikipedia page title from Wikidata
// 3. Fetch Wikipedia content

const wikidataId = "Q82664"; // Battle of Waterloo

// Get Wikipedia page from Wikidata ID
const response = await fetch(
  `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`
);
const data = await response.json();
const wikipediaTitle = data.entities[wikidataId].sitelinks.enwiki.title;

// Get Wikipedia content
const wikiResponse = await fetch(
  `https://en.wikipedia.org/api/rest_v1/page/summary/${wikipediaTitle}`
);
const wikiData = await wikiResponse.json();

console.log(wikiData.extract); // First paragraph summary
console.log(wikiData.thumbnail.source); // Image URL
```

### Wikidata Advantages

✅ **Structured data** - Easy to parse  
✅ **Queryable** - SPARQL is powerful  
✅ **Multilingual** - 300+ languages  
✅ **Images included** - Links to Wikimedia Commons  
✅ **Free/Open** - CC0, no restrictions  
✅ **Huge scale** - Millions of events  
✅ **Good coverage** - Global, not just Europe  
✅ **Active community** - Constantly updated  

### Wikidata Challenges

⚠️ **Data quality varies** - Community-edited  
⚠️ **Not all events have dates** - Need to filter  
⚠️ **Descriptions minimal** - Need to get from Wikipedia  
⚠️ **Learning curve** - SPARQL takes time to learn  
⚠️ **Coverage gaps** - Better for post-1500 CE  

---

## Source 2: Wikipedia + DBpedia

### Wikipedia REST API

**Base URL:** `https://en.wikipedia.org/api/rest_v1/`

#### Get Page Summary (Best for Events)

```bash
# Get summary with image
curl "https://en.wikipedia.org/api/rest_v1/page/summary/Battle_of_Waterloo"
```

**Response includes:**
- Title
- Extract (first paragraph)
- Thumbnail image
- Full page URL
- Coordinates (if available)
- Links to other languages

#### Get Full Page Content

```bash
# Get full HTML content
curl "https://en.wikipedia.org/api/rest_v1/page/html/Battle_of_Waterloo"

# Get mobile-formatted content
curl "https://en.wikipedia.org/api/rest_v1/page/mobile-sections/Battle_of_Waterloo"
```

### Wikipedia Categories as Event Lists

Wikipedia organizes pages by category. Useful categories:

**Military History:**
- `Category:Battles_by_year`
- `Category:Wars_by_year`
- `Category:Military_history_by_year`

**Political History:**
- `Category:Political_events_by_year`
- `Category:Revolutions_by_year`
- `Category:Treaties_by_year`

**Scientific History:**
- `Category:Science_by_year`
- `Category:Inventions_by_year`

**Cultural History:**
- `Category:Culture_by_year`
- `Category:Art_by_year`

**Get all pages in a category:**

```bash
curl "https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Battles_of_1815&cmlimit=500&format=json"
```

### DBpedia

**DBpedia** = Structured extraction of Wikipedia data

**SPARQL Endpoint:** http://dbpedia.org/sparql

**Example Query:**

```sparql
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbr: <http://dbpedia.org/resource/>

SELECT ?event ?label ?date ?abstract
WHERE {
  ?event rdf:type dbo:MilitaryConflict .
  ?event rdfs:label ?label .
  ?event dbo:abstract ?abstract .
  ?event dbo:date ?date .
  
  FILTER (LANG(?label) = 'en')
  FILTER (LANG(?abstract) = 'en')
  FILTER (YEAR(?date) >= 1800 && YEAR(?date) <= 1900)
}
ORDER BY ?date
LIMIT 1000
```

**DBpedia Advantages:**
✅ More detailed than Wikidata (full Wikipedia text)  
✅ SPARQL queries like Wikidata  
✅ Good for descriptions  

**DBpedia Disadvantages:**
⚠️ Less structured than Wikidata  
⚠️ Updates slower (quarterly dumps)  
⚠️ More complex ontology  

---

## Source 3: Wikimedia Commons (Images)

**Wikimedia Commons** = 100+ million free media files

### Get Images from Wikidata

Wikidata includes image URLs:

```sparql
SELECT ?event ?eventLabel ?image
WHERE {
  ?event wdt:P31 wd:Q178561 .      # battles
  ?event wdt:P18 ?image .          # has image
  ?event wdt:P585 ?date .
  
  FILTER(YEAR(?date) >= 1800)
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
```

### Commons API

```bash
# Search for images
curl "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=Battle+of+Waterloo&srnamespace=6&format=json"

# Get image info
curl "https://commons.wikimedia.org/w/api.php?action=query&titles=File:Battle_of_Waterloo_1815.PNG&prop=imageinfo&iiprop=url|size|mime&format=json"
```

### Image Categories

Commons organizes by category:

- `Category:Battles_by_year`
- `Category:Historical_events_by_year`
- `Category:Maps_of_history`
- `Category:Portraits_by_year`

---

## Source 4: Museum & Library APIs

### Library of Congress

**Chronicling America** (Historical US Newspapers)  
**API:** https://chroniclingamerica.loc.gov/about/api/

```bash
# Search newspapers by date
curl "https://chroniclingamerica.loc.gov/search/pages/results/?format=json&dateFilterType=yearRange&date1=1865&date2=1865&sequence=0"
```

**American Memory Collection**  
Historical documents, photos, maps

### Europeana

**European cultural heritage collections**  
**API:** https://pro.europeana.eu/page/apis

```javascript
// Search for items
fetch(`https://api.europeana.eu/record/v2/search.json?wskey=${API_KEY}&query=battle&qf=YEAR:1815`)
```

**Coverage:**
- 50+ million items
- Art, books, music, videos
- Multiple languages
- Good European history coverage

### Smithsonian Open Access

**14 million records**  
**API:** https://api.si.edu/openaccess/api/v1.0/

```bash
curl "https://api.si.edu/openaccess/api/v1.0/search?q=history&api_key=${API_KEY}"
```

### Getty Museum

**Art and cultural heritage**  
**API:** https://data.getty.edu/

**Good for:**
- Art history events
- Artist biographies
- Cultural context

### British Museum

**2 million objects**  
**API:** https://github.com/BritishMuseumDH/CollectionOnline

### Metropolitan Museum of Art

**470,000+ artworks**  
**API:** https://metmuseum.github.io/

```bash
curl "https://collectionapi.metmuseum.org/public/collection/v1/search?q=Napoleon&hasImages=true"
```

---

## Source 5: Academic Datasets

### Seshat: Global History Databank

**URL:** http://seshatdatabank.info/

**What it is:**
- Academic project collecting data on historical societies
- Coded variables (warfare, agriculture, technology, etc.)
- Time series data
- 414 polities, 10,000 BCE - 1900 CE

**Data Format:**
- CSV downloads
- Structured variables
- Academic citations

**Good for:**
- Comparative history
- Long-term trends
- Social complexity measures

### Correlates of War (COW)

**URL:** https://correlatesofwar.org/

**What it is:**
- Wars and conflicts dataset
- 1816 - present
- Battle deaths, participants, outcomes

**Data Format:**
- CSV files
- Well-documented

### ACLED (Armed Conflict Location & Event Data)

**URL:** https://acleddata.com/

**What it is:**
- Real-time conflict data
- 1997 - present
- Global coverage
- Detailed location data

### CLIWOC (Climatological Database for the World's Oceans)

**Ship logbook data:**
- Weather observations
- Naval expeditions
- 1750-1850

### Paleoclimate Datasets

**NOAA Paleoclimatology**  
**URL:** https://www.ncei.noaa.gov/products/paleoclimatology

- Tree rings
- Ice cores
- Climate reconstructions
- Last 10,000+ years

Good for environmental history context.

---

## Source 6: Specialized Historical Databases

### Pleiades (Ancient World Geography)

**URL:** https://pleiades.stoa.org/

**What it is:**
- Gazetteer of ancient places
- Geographic coordinates
- Time periods
- Linked data

**Good for:**
- Ancient history events
- Geographic context
- Place names (ancient → modern)

### Pelagios (Ancient World Linked Data)

**URL:** https://pelagios.org/

**Network of ancient world data:**
- Places
- Texts
- Inscriptions
- Maps

### Digital Atlas of Roman and Medieval Civilizations

**URL:** https://darmc.harvard.edu/

**Harvard project:**
- Ancient geography
- Trade routes
- Settlement patterns

### China Historical GIS

**URL:** http://www.fas.harvard.edu/~chgis/

**Chinese historical geography:**
- 221 BCE - 1911 CE
- Administrative boundaries
- Settlement data

### ORBIS: The Stanford Geospatial Network Model of the Roman World

**URL:** http://orbis.stanford.edu/

**Travel times and costs:**
- Roman Empire
- Routes and networks
- Economic data

---

## Source 7: Historical Newspapers & Archives

### Newspapers

**Chronicling America** (US, 1789-1963)  
**British Newspaper Archive** (UK, 1700s-2000s)  
**Trove** (Australian newspapers)  
**Delpher** (Dutch newspapers)  

### Digital Archives

**Internet Archive:**
- https://archive.org
- Books, texts, documents
- Full-text search

**HathiTrust Digital Library:**
- https://www.hathitrust.org/
- 17+ million volumes
- Academic materials

---

## Practical Data Collection Strategy

### Phase 1: Bootstrap with Wikidata (Week 1-2)

**Goal:** Collect 10,000 events quickly

**Approach:**

```typescript
// 1. Query Wikidata for major event types
const eventTypes = [
  'Q178561', // Battle
  'Q198',    // War
  'Q10931',  // Revolution
  'Q41298',  // Scientific discovery
  'Q205650', // Invention
  'Q3839081', // Natural disaster
  'Q811979', // Architectural structure
];

// 2. For each type, get events with dates
const events = [];
for (const type of eventTypes) {
  const query = `
    SELECT ?event ?eventLabel ?date ?locationLabel ?image
    WHERE {
      ?event wdt:P31 wd:${type} .
      ?event wdt:P585 ?date .
      OPTIONAL { ?event wdt:P276 ?location . }
      OPTIONAL { ?event wdt:P18 ?image . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `;
  
  const results = await sparqlQuery(query);
  events.push(...results);
}

// 3. Enrich with Wikipedia descriptions
for (const event of events) {
  const wikipediaData = await getWikipediaSummary(event.wikidataId);
  event.description = wikipediaData.extract;
  event.thumbnail = wikipediaData.thumbnail?.source;
}

// 4. Save to JSON
fs.writeFileSync('events_batch_1.json', JSON.stringify(events, null, 2));
```

**Expected Output:**
- 10,000-15,000 events
- Dates, locations, descriptions
- Images for ~30-50%
- Global coverage

### Phase 2: Add Specialized Sources (Week 3-4)

**Goal:** Fill gaps, add detail

**Approach:**

1. **Ancient History** → Pleiades + Seshat
2. **Art/Culture** → Museum APIs (Met, Getty)
3. **Scientific History** → Wikidata + manual curation
4. **Non-Western** → Regional Wikipedia editions + academic sources

### Phase 3: Manual Curation (Week 5-8)

**Goal:** Quality over quantity

**Approach:**

1. **Review automated data** for errors
2. **Add importance scores** (1-100)
3. **Link events** to PeriodO periods
4. **Add relationships** (causes, effects)
5. **Verify dates** against scholarly sources
6. **Balance geographic coverage**

### Phase 4: Community Contribution (Ongoing)

**Goal:** Crowdsource additional events

**Approach:**

1. **Build submission form** for contributors
2. **Require citations** for all submissions
3. **Peer review** before acceptance
4. **Wikipedia-style** editing model

---

## Data Quality Checklist

### Required Fields

✅ **Title** (short, clear)  
✅ **Start date** (year minimum, ideally month/day)  
✅ **End date** (or same as start for point events)  
✅ **Category** (from your taxonomy)  
✅ **Description** (minimum 50 words)  

### Recommended Fields

📋 **Location** (coordinates + place name)  
📋 **Participants** (people, organizations)  
📋 **Image** (with proper attribution)  
📋 **Sources** (at least 1 citation)  
📋 **Importance** (1-100 score for filtering)  

### Quality Criteria

**Geographic Balance:**
- Not >50% from any single continent
- Include events from all major world regions
- Prioritize non-European events to counter bias

**Temporal Balance:**
- More events for recent periods (more records available)
- But ensure prehistoric/ancient representation
- Aim for exponential distribution (more recent = more events)

**Category Balance:**
- No category >30% of total events
- Ensure representation across all 10 categories
- Military events shouldn't dominate

**Citation Quality:**
- Academic sources preferred
- Multiple sources for controversial events
- Original language sources when possible

---

## Legal & Ethical Considerations

### Licensing

**Safe (Can use freely):**
✅ Wikidata (CC0 - public domain)  
✅ Wikipedia (CC BY-SA - with attribution)  
✅ Wikimedia Commons (mostly CC licenses)  
✅ Public domain sources (pre-1928 in US)  
✅ Most government sources (US federal = public domain)  

**Need Permission:**
⚠️ Contemporary news articles (copyrighted)  
⚠️ Academic publications (fair use only)  
⚠️ Commercial databases  
⚠️ Photos (unless explicit CC license)  

### Attribution

**Must attribute:**
- Wikipedia content (link back to page)
- Photographer (for images)
- Data sources (in UI or about page)

**Example attribution:**
```
"Battle of Waterloo" data from Wikidata (CC0)
Description from Wikipedia (CC BY-SA)
Image: "Battle of Waterloo 1815.PNG" by William Sadler (public domain)
```

### Ethical Considerations

**Representation:**
- Don't just copy Western sources
- Seek indigenous perspectives
- Include marginalized histories
- Challenge colonial narratives

**Sensitivity:**
- Content warnings for violence, genocide, etc.
- Respect cultural sensitivities
- Avoid sensationalism
- Present multiple perspectives on controversial events

---

## Sample Data Pipeline

### Complete End-to-End Example

```typescript
// data-pipeline.ts

import { WikidataService } from './services/wikidata';
import { WikipediaService } from './services/wikipedia';
import { PeriodOService } from './services/periodo';

interface RawEvent {
  wikidataId: string;
  label: string;
  date: Date;
  locationId?: string;
  imageUrl?: string;
}

interface EnrichedEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  category: string;
  location?: {
    name: string;
    coordinates: [number, number];
  };
  image?: {
    url: string;
    attribution: string;
  };
  sources: string[];
  periodId?: string;
  importance: number;
}

async function collectEvents(): Promise<EnrichedEvent[]> {
  const enrichedEvents: EnrichedEvent[] = [];
  
  // Step 1: Query Wikidata for battles
  console.log('Fetching battles from Wikidata...');
  const rawEvents = await WikidataService.queryBattles({
    startYear: -500,
    endYear: 1900,
    limit: 1000,
  });
  
  console.log(`Found ${rawEvents.length} battles`);
  
  // Step 2: Enrich each event
  for (const event of rawEvents) {
    try {
      // Get Wikipedia description
      const wikiData = await WikipediaService.getSummary(event.wikidataId);
      
      // Find matching PeriodO period
      const period = PeriodOService.findPeriodForDate(
        event.date,
        event.locationId
      );
      
      // Calculate importance score
      const importance = calculateImportance(event, wikiData);
      
      // Build enriched event
      const enriched: EnrichedEvent = {
        id: `evt_${event.wikidataId}`,
        title: event.label,
        description: wikiData.extract,
        start: event.date,
        end: event.date, // Point event
        category: 'conflict',
        location: event.location,
        image: event.imageUrl ? {
          url: event.imageUrl,
          attribution: wikiData.imageAttribution,
        } : undefined,
        sources: [
          `https://www.wikidata.org/wiki/${event.wikidataId}`,
          wikiData.wikipediaUrl,
        ],
        periodId: period?.id,
        importance,
      };
      
      enrichedEvents.push(enriched);
      
      // Rate limiting
      await sleep(100);
      
    } catch (error) {
      console.error(`Failed to enrich ${event.wikidataId}:`, error);
    }
  }
  
  return enrichedEvents;
}

function calculateImportance(
  event: RawEvent,
  wikiData: any
): number {
  let score = 50; // Base score
  
  // More Wikipedia views = more important
  if (wikiData.views > 100000) score += 20;
  else if (wikiData.views > 10000) score += 10;
  
  // Longer article = more important
  if (wikiData.length > 10000) score += 10;
  
  // Has image = more important
  if (event.imageUrl) score += 5;
  
  // More references = more important
  if (wikiData.references > 50) score += 15;
  
  return Math.min(100, score);
}

// Run pipeline
collectEvents()
  .then(events => {
    console.log(`Collected ${events.length} enriched events`);
    fs.writeFileSync(
      'data/events/battles.json',
      JSON.stringify(events, null, 2)
    );
  })
  .catch(console.error);
```

---

## Recommended Tools

### Data Collection

**Wikidata SDK (JavaScript/TypeScript):**
```bash
npm install wikidata-sdk
```

**SPARQL Client:**
```bash
npm install sparql-http-client
```

**Wikipedia API Client:**
```bash
npm install wikipedia
```

### Data Processing

**CSV Parser:**
```bash
npm install csv-parser
```

**Date Parsing:**
```bash
npm install date-fns
```

**Data Validation:**
```bash
npm install zod
```

### Batch Processing

**Queue Management:**
```bash
npm install bull  # Redis-based queue
```

**Rate Limiting:**
```bash
npm install bottleneck
```

---

## Estimated Timeline & Event Counts

### Conservative Approach (Quality Focus)

**Week 1-2:** Wikidata queries → **5,000 events**  
**Week 3-4:** Museum APIs + specialized sources → **+2,000 events**  
**Week 5-8:** Manual curation + gap filling → **+3,000 events**  
**Total after 2 months:** **~10,000 curated events**

### Aggressive Approach (Quantity Focus)

**Week 1:** Automated Wikidata scraping → **15,000 events**  
**Week 2:** Automated Wikipedia enrichment → **+10,000 events**  
**Week 3-4:** Batch processing specialized sources → **+10,000 events**  
**Week 5-6:** Quality filtering (remove duplicates/errors) → **25,000 remaining**  
**Week 7-8:** Categorization and linking → **ready**  
**Total after 2 months:** **~25,000 events**

### Community Approach (Long-term)

**Months 1-2:** Bootstrap with 10,000 automated events  
**Month 3:** Launch with submission system  
**Months 4-12:** Community contributions → **+5,000 events/month**  
**Total after 1 year:** **~60,000+ events**

---

## Recommended First Steps

### This Week:

1. **Set up Wikidata SPARQL access**
   - Create account (optional but helpful)
   - Test queries in web interface
   - Get familiar with query syntax

2. **Query 100 test events**
   - Run battle query for 19th century
   - Export to JSON
   - Examine data quality

3. **Test Wikipedia enrichment**
   - Take 10 Wikidata IDs
   - Fetch Wikipedia summaries
   - Check image availability

4. **Define your data schema**
   - Decide required vs. optional fields
   - Create TypeScript interfaces
   - Set up validation

### Next Week:

1. **Build data pipeline**
   - Automate Wikidata → Wikipedia flow
   - Handle rate limiting
   - Error handling and retries

2. **Collect first 1,000 events**
   - Focus on one category (e.g., battles)
   - Ensure quality
   - Test with current UI

3. **Evaluate results**
   - Data quality assessment
   - Coverage gaps
   - Performance with 1K events

---

## Conclusion

**Best Strategy for You:**

🎯 **Start with Wikidata** (fastest, most structured)  
🎯 **Enrich with Wikipedia** (get descriptions)  
🎯 **Add images from Commons** (visual appeal)  
🎯 **Fill gaps with museum APIs** (cultural depth)  
🎯 **Manual curation** (quality control)  
🎯 **Community contributions** (long-term growth)  

**Expected Result:**
- **25,000-30,000 high-quality events** in 2-3 months
- Dates, descriptions, images, citations
- Global coverage (not Euro-centric)
- Linked to PeriodO periods
- Ready for scholarly use

This is **absolutely achievable** and gives you publication-worthy data.
