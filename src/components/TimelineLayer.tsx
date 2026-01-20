import { TimelineEvent, EventCategory } from "@/data/timelineData";
import { TimelineEventBlock } from "./TimelineEventBlock";

interface TimelineLayerProps {
  layerKey: EventCategory;
  layer: { name: string; events: TimelineEvent[] };
  startTime: Date;
  totalDuration: number;
  zoom: number;
  currentTime: Date;
}

// Map layer keys to CSS variable names
const layerColorVars: Record<string, string> = {
  politics: '--event-politics',
  science: '--event-science',
  culture: '--event-culture',
  technology: '--event-technology',
};

export const TimelineLayer = ({
  layerKey,
  layer,
  startTime,
  totalDuration,
  zoom,
  currentTime,
}: TimelineLayerProps) => {
  const currentTimeMs = currentTime.getTime();
  const colorVar = layerColorVars[layerKey] || '--event-politics';
  
  // Separate events by type for layered rendering
  const eras = layer.events.filter(e => e.type === 'era');
  const periods = layer.events.filter(e => e.type === 'period');
  const moments = layer.events.filter(e => e.type === 'moment');
  
  // Count active events
  const activeCount = layer.events.filter(event => {
    const endTime = event.end || event.start;
    return currentTimeMs >= event.start.getTime() && currentTimeMs <= endTime.getTime();
  }).length;
  
  return (
    <div className="relative border-b border-[hsl(var(--timeline-grid))/50] timeline-track group">
      {/* Layer Label */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-32 bg-[hsl(var(--timeline-bg))] border-r border-[hsl(var(--timeline-grid))] flex items-center justify-between px-4 z-10 transition-colors group-hover:bg-[hsl(var(--timeline-bg))/80]"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-2 h-2 rounded-full transition-transform group-hover:scale-125"
            style={{ backgroundColor: `hsl(var(${colorVar}))` }}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
            {layer.name}
          </span>
        </div>
        {/* Active count indicator */}
        {activeCount > 0 && (
          <div 
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white animate-scale-in"
            style={{ backgroundColor: `hsl(var(${colorVar}))` }}
          >
            {activeCount}
          </div>
        )}
      </div>

      {/* Events Container */}
      <div className="relative h-24 ml-32" style={{ width: `calc(100% - 8rem)` }}>
        {/* Layer background gradient */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{ 
            background: `linear-gradient(90deg, hsl(var(${colorVar})) 0%, transparent 30%)` 
          }}
        />
        
        {/* Render in order: eras (background), periods, moments (foreground) */}
        {eras.map((event) => {
          const endTime = event.end || event.start;
          const isActive = currentTimeMs >= event.start.getTime() && currentTimeMs <= endTime.getTime();
          return (
            <TimelineEventBlock
              key={event.id}
              event={event}
              startTime={startTime}
              totalDuration={totalDuration}
              zoom={zoom}
              colorVar={colorVar}
              isActive={isActive}
            />
          );
        })}
        
        {periods.map((event) => {
          const endTime = event.end || event.start;
          const isActive = currentTimeMs >= event.start.getTime() && currentTimeMs <= endTime.getTime();
          return (
            <TimelineEventBlock
              key={event.id}
              event={event}
              startTime={startTime}
              totalDuration={totalDuration}
              zoom={zoom}
              colorVar={colorVar}
              isActive={isActive}
            />
          );
        })}
        
        {moments.map((event) => {
          // Moments are "active" for a window around their time
          const momentWindow = 86400000 * 30; // 30 days window for visibility
          const isActive = Math.abs(currentTimeMs - event.start.getTime()) < momentWindow;
          return (
            <TimelineEventBlock
              key={event.id}
              event={event}
              startTime={startTime}
              totalDuration={totalDuration}
              zoom={zoom}
              colorVar={colorVar}
              isActive={isActive}
            />
          );
        })}
      </div>
    </div>
  );
};
