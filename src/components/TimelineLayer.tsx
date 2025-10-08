import { TimelineLayerData } from "@/data/timelineData";
import { TimelineEventBlock } from "./TimelineEventBlock";

interface TimelineLayerProps {
  layer: TimelineLayerData;
  startTime: Date;
  totalDuration: number;
  zoom: number;
  currentTime: Date;
}

export const TimelineLayer = ({
  layer,
  startTime,
  totalDuration,
  zoom,
  currentTime,
}: TimelineLayerProps) => {
  const currentTimeMs = currentTime.getTime();
  
  return (
    <div className="relative border-b border-[hsl(var(--timeline-grid))] bg-[hsl(var(--timeline-track))]">
      {/* Layer Label */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-[hsl(var(--timeline-bg))] border-r border-[hsl(var(--timeline-grid))] flex items-center px-4 z-10">
        <span className="text-sm font-medium uppercase tracking-wide">{layer.name}</span>
      </div>

      {/* Events Container */}
      <div className="relative h-20 ml-32" style={{ width: `calc(100% - 8rem)` }}>
        {layer.events.map((event, index) => {
          const isActive = currentTimeMs >= event.start.getTime() && currentTimeMs <= event.end.getTime();
          return (
            <TimelineEventBlock
              key={index}
              event={event}
              startTime={startTime}
              totalDuration={totalDuration}
              zoom={zoom}
              color={layer.color}
              isActive={isActive}
            />
          );
        })}
      </div>
    </div>
  );
};