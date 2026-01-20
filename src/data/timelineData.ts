// ═══════════════════════════════════════════════════════════════════════════
// CHRONOSCOPE DATA
// Re-exports types and provides events from scraped presets
// ═══════════════════════════════════════════════════════════════════════════

// Re-export types for convenience
export * from "./types";

import type { TimelineEvent, EventCategory, TimelineLayerData } from "./types";

// Import scraped events from preset
// Switch presets by changing this import:
import { broad_modern_history_events } from "./presets/broad-modern-history";

// ═══════════════════════════════════════════════════════════════════════════
// ACTIVE EVENTS
// ═══════════════════════════════════════════════════════════════════════════

export const allEvents: TimelineEvent[] = broad_modern_history_events;

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get events for a specific category, including cross-category events
 */
export function getEventsForCategory(category: EventCategory): TimelineEvent[] {
  return allEvents.filter(event => event.categories.includes(category));
}

/**
 * Get all unique tags across all events
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  allEvents.forEach(event => {
    event.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Get all unique key figures across all events
 */
export function getAllKeyFigures(): string[] {
  const figures = new Set<string>();
  allEvents.forEach(event => {
    event.keyFigures?.forEach(figure => figures.add(figure));
  });
  return Array.from(figures).sort();
}

/**
 * Get child events for a parent event
 */
export function getChildEvents(parentId: string): TimelineEvent[] {
  return allEvents.filter(event => event.parentId === parentId);
}

/**
 * Get related events for an event
 */
export function getRelatedEvents(eventId: string): TimelineEvent[] {
  const event = allEvents.find(e => e.id === eventId);
  if (!event?.relatedIds) return [];
  return allEvents.filter(e => event.relatedIds!.includes(e.id));
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYER DATA (for layer-based rendering)
// ═══════════════════════════════════════════════════════════════════════════

export const timelineData: Record<EventCategory, TimelineLayerData> = {
  politics: {
    name: "Politics",
    events: getEventsForCategory("politics"),
  },
  science: {
    name: "Science",
    events: getEventsForCategory("science"),
  },
  culture: {
    name: "Culture",
    events: getEventsForCategory("culture"),
  },
  technology: {
    name: "Technology",
    events: getEventsForCategory("technology"),
  },
};
