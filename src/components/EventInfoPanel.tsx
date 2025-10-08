import { TimelineEvent } from "@/data/timelineData";
import { ScrollArea } from "./ui/scroll-area";

interface EventInfoPanelProps {
  events: TimelineEvent[];
  currentTime: Date;
}

export const EventInfoPanel = ({ events, currentTime }: EventInfoPanelProps) => {
  return (
    <div className="w-96 border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-sm font-bold uppercase tracking-wide">Current Events</h2>
        <div className="mono text-xs text-muted-foreground mt-1">
          {currentTime.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* Events List */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No events at this time
            </div>
          ) : (
            events.map((event, index) => (
              <div
                key={index}
                className="border border-border rounded-sm p-4 bg-background hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm leading-tight">{event.title}</h3>
                  <span className="mono text-xs text-muted-foreground whitespace-nowrap">
                    {event.start.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}–{event.end.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Info */}
      <div className="border-t border-border px-6 py-3 bg-muted/30">
        <div className="text-xs text-muted-foreground">
          {events.length} {events.length === 1 ? "event" : "events"} active
        </div>
      </div>
    </div>
  );
};