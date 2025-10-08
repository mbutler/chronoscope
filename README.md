# Chronoscope

An interactive historical timeline visualization tool featuring video-editing-style playback controls, dynamic zoom levels, and scholarly period definitions.

## Overview

Chronoscope displays historical events across multiple thematic layers with smooth playback animation, variable speed control, and extensive zoom capabilities. The current demo spans 125 years (1900-2025) with 35 sample events across Politics, Science, Culture, and Technology.

## Technical Documentation

### [SCALING_ANALYSIS.md](./SCALING_ANALYSIS.md)
**Comprehensive technical report for scaling to cosmic timescales with millions of events**

This 70-page analysis explores the ambitious vision of scaling Chronoscope from minutes to the age of the universe (13.8 billion years) with millions of events. Covers:

- Current architecture limitations and bottlenecks
- Custom time representation systems (BigInt-based)
- Canvas/WebGL rendering strategies
- Spatial-temporal indexing (R-trees)
- Level-of-Detail (LOD) systems
- Backend API architecture
- 16-week phased implementation roadmap
- Performance targets and risk assessment

**Use this if:** You want to build a massive-scale timeline spanning billions of years.

### [HUMAN_HISTORY_ANALYSIS.md](./HUMAN_HISTORY_ANALYSIS.md)
**Focused analysis for a scholarly human history timeline (300,000 years)**

This analysis explores a more achievable scope using the existing architecture with moderate optimizations. Covers:

- **PeriodO Integration:** Using 9,001 scholarly period definitions from [perio.do](https://perio.do/)
- **Feasible Event Count:** 25,000-50,000 curated events with current tech stack
- **JavaScript Date Support:** Native Date objects work perfectly for human history
- **8-10 week implementation timeline** with Canvas rendering
- **Scholarly credibility** through authoritative period definitions
- No custom time system or backend required

**Use this if:** You want a high-quality, scholarly timeline of human history that can be built in 2-3 months.

## PeriodO Dataset

The `/data/periodo-dataset.json` file contains:
- **9,001 period definitions** from 272 scholarly sources
- Global coverage (Near East, Europe, Americas, Asia, Africa, Oceania)
- Hierarchical period structures with precise dates
- Citations and bibliographic references
- Multi-lingual support

### [PERIODO_VISUAL_GUIDE.md](./PERIODO_VISUAL_GUIDE.md)
**Visual guide to using PeriodO for timeline labeling**

This guide shows exactly how PeriodO periods would appear in the timeline:
- Visual mockups of period layers
- Examples of competing scholarly definitions
- How to link events to periods
- Multi-lingual labeling strategies
- What PeriodO provides vs. what you build

**Key insight:** PeriodO gives you the **framework** (scholarly period definitions as background context), you add the **details** (specific historical events as foreground).

## Current Features

- ✅ Multi-layer timeline visualization
- ✅ Play/pause with variable speed control (0.25×-4×)
- ✅ Dynamic zoom (1×-65,536×) with adaptive time scales
- ✅ Click-to-seek timeline navigation
- ✅ Real-time active event tracking
- ✅ Event information panel

## Tech Stack

- **React 18** + TypeScript
- **Vite** build tool
- **Tailwind CSS** styling
- **Radix UI** + shadcn/ui components
- **date-fns** date manipulation

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Documentation Index

### Planning & Strategy
- [SCALING_ANALYSIS.md](./SCALING_ANALYSIS.md) - Cosmic-scale timeline architecture (billions of years, millions of events)
- [HUMAN_HISTORY_ANALYSIS.md](./HUMAN_HISTORY_ANALYSIS.md) - Human history timeline (300,000 years, 30K events)
- [CATEGORY_FRAMEWORKS.md](./CATEGORY_FRAMEWORKS.md) - Novel categorization systems (avoiding Euro-centrism)

### Implementation Guides
- [PERIODO_VISUAL_GUIDE.md](./PERIODO_VISUAL_GUIDE.md) - How to use PeriodO for scholarly period definitions
- [DATA_ACQUISITION.md](./DATA_ACQUISITION.md) - **How to collect 30,000+ events from Wikidata, Wikipedia, and more**

## Next Steps

Choose your adventure:

1. **Go Big:** Follow the [SCALING_ANALYSIS.md](./SCALING_ANALYSIS.md) for cosmic-scale timelines
2. **Stay Scholarly:** Follow the [HUMAN_HISTORY_ANALYSIS.md](./HUMAN_HISTORY_ANALYSIS.md) for authoritative human history
3. **Get Data:** Follow the [DATA_ACQUISITION.md](./DATA_ACQUISITION.md) to collect events at scale

Both paths are technically feasible—it's a question of scope and timeline.
