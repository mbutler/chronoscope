import { TimelineEvent, getChildEvents, getRelatedEvents } from "@/data/timelineData";
import { ScrollArea } from "./ui/scroll-area";
import { Calendar, Clock, MapPin, Users, Tag, Link as LinkIcon, ChevronRight, Layers } from "lucide-react";

interface EventInfoPanelProps {
  events: TimelineEvent[];
  currentTime: Date;
}

// Map layer keys to CSS variable names
const categoryColors: Record<string, string> = {
  politics: '--event-politics',
  science: '--event-science',
  culture: '--event-culture',
  technology: '--event-technology',
};

const eventTypeLabels: Record<string, string> = {
  moment: 'Moment',
  period: 'Period',
  era: 'Era',
};

const importanceLabels: Record<string, string> = {
  minor: 'Minor',
  standard: 'Notable',
  major: 'Major',
  landmark: 'Landmark',
};

export const EventInfoPanel = ({ events, currentTime }: EventInfoPanelProps) => {
  return (
    <div className="w-[420px] border-l border-border glass-surface flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
          <h2 className="font-display text-sm uppercase tracking-wide">Active Events</h2>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="mono text-xs">
              {currentTime.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="mono text-xs">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Events List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No events at this time</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Scrub through the timeline to discover historical events
              </p>
            </div>
          ) : (
            events.map((event, index) => {
              const primaryCategory = event.categories[0];
              const colorVar = categoryColors[primaryCategory] || '--event-politics';
              const childEvents = getChildEvents(event.id);
              const relatedEvents = getRelatedEvents(event.id);
              const endDate = event.end || event.start;
              
              return (
                <div
                  key={event.id}
                  className="event-card border border-border rounded-lg p-4 bg-card/50 opacity-0 animate-slide-up-fade"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    borderLeftColor: `hsl(var(${colorVar}))`,
                  }}
                >
                  {/* Header row with category and type */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {event.categories.map((cat) => (
                        <div 
                          key={cat}
                          className="flex items-center gap-1"
                        >
                          <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: `hsl(var(${categoryColors[cat]}))` }}
                          />
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            {cat}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        event.importance === 'landmark' ? 'bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))]' :
                        event.importance === 'major' ? 'bg-muted text-foreground' :
                        'bg-muted/50 text-muted-foreground'
                      }`}>
                        {importanceLabels[event.importance]}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60">
                        {eventTypeLabels[event.type]}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-sm leading-tight mb-2 text-foreground">
                    {event.title}
                  </h3>

                  {/* Date range */}
                  <div className="mono text-[10px] text-muted-foreground mb-3 flex items-center gap-1">
                    <span>
                      {event.type === 'moment' 
                        ? event.start.toLocaleString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : event.start.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      }
                    </span>
                    {event.type !== 'moment' && (
                      <>
                        <span className="text-muted-foreground/50">→</span>
                        <span>{endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {event.description}
                  </p>

                  {/* Metadata grid */}
                  <div className="space-y-2 text-[11px]">
                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span>{event.location.name}</span>
                      </div>
                    )}

                    {/* Key Figures */}
                    {event.keyFigures && event.keyFigures.length > 0 && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Users className="h-3 w-3 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          {event.keyFigures.join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Tag className="h-3 w-3 flex-shrink-0 mt-0.5 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {event.tags.map((tag) => (
                            <span 
                              key={tag}
                              className="px-1.5 py-0.5 bg-muted/50 rounded text-[10px] text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Wiki Link */}
                    {event.wikiUrl && (
                      <a 
                        href={event.wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[hsl(var(--accent))] hover:underline"
                      >
                        <LinkIcon className="h-3 w-3" />
                        <span>Wikipedia</span>
                        <ChevronRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {/* Child Events */}
                  {childEvents.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                        <Layers className="h-3 w-3" />
                        <span>Sub-events ({childEvents.length})</span>
                      </div>
                      <div className="space-y-1">
                        {childEvents.slice(0, 3).map((child) => (
                          <div 
                            key={child.id}
                            className="text-[11px] text-muted-foreground flex items-center gap-2"
                          >
                            <div 
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: `hsl(var(${colorVar}))` }}
                            />
                            <span>{child.title}</span>
                            <span className="text-muted-foreground/50">
                              ({child.start.getFullYear()})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Events */}
                  {relatedEvents.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                        Related Events
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {relatedEvents.slice(0, 4).map((related) => (
                          <span 
                            key={related.id}
                            className="px-2 py-1 bg-muted/30 rounded text-[10px] text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            {related.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Duration indicator */}
                  {event.type !== 'moment' && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground/60">Duration</span>
                        <span className="mono text-muted-foreground">
                          {formatDuration(event.start, endDate)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Footer Info */}
      <div className="border-t border-border px-6 py-3 bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{events.length}</span>
            {' '}{events.length === 1 ? "event" : "events"} active
          </div>
          <div className="flex items-center gap-1">
            {Object.entries(categoryColors).map(([cat, colorVar]) => {
              const count = events.filter(e => e.categories.includes(cat as any)).length;
              if (count === 0) return null;
              return (
                <div 
                  key={cat}
                  className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-medium text-white"
                  style={{ backgroundColor: `hsl(var(${colorVar}))` }}
                  title={`${count} ${cat} event${count > 1 ? 's' : ''}`}
                >
                  {count}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

function formatDuration(start: Date, end: Date): string {
  const ms = end.getTime() - start.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days % 30;
  
  if (years > 0 && months > 0) {
    return `${years}y ${months}mo`;
  } else if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
}
