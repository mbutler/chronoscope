// ═══════════════════════════════════════════════════════════════════════════
// CHRONOSCOPE DATA TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type EventType = 'moment' | 'period' | 'era';
export type EventImportance = 'minor' | 'standard' | 'major' | 'landmark';
export type EventCategory = 'politics' | 'science' | 'culture' | 'technology';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  
  // Temporal
  type: EventType;
  start: Date;
  end?: Date;
  
  // Classification  
  categories: EventCategory[];
  tags?: string[];
  importance: EventImportance;
  
  // Relationships
  parentId?: string;
  relatedIds?: string[];
  
  // Rich content
  imageUrl?: string;
  wikiUrl?: string;
  location?: {
    name: string;
    coordinates?: [number, number];
  };
  keyFigures?: string[];
}

export interface TimelineLayerData {
  name: string;
  events: TimelineEvent[];
}
