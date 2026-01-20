import { TimelineEvent } from "@/data/timelineData";
import { getTimePosition } from "@/utils/timelineUtils";

interface TimelineEventBlockProps {
  event: TimelineEvent;
  startTime: Date;
  totalDuration: number;
  zoom: number;
  colorVar: string;
  isActive: boolean;
}

// Height multipliers based on importance
const importanceHeight: Record<string, { top: number; bottom: number }> = {
  minor: { top: 20, bottom: 20 },
  standard: { top: 14, bottom: 14 },
  major: { top: 8, bottom: 8 },
  landmark: { top: 4, bottom: 4 },
};

export const TimelineEventBlock = ({
  event,
  startTime,
  totalDuration,
  colorVar,
  isActive,
}: TimelineEventBlockProps) => {
  const startPercent = getTimePosition(event.start, startTime, totalDuration);
  const endDate = event.end || new Date(event.start.getTime() + 86400000); // Default 1 day for moments
  const duration = endDate.getTime() - event.start.getTime();
  const widthPercent = (duration / totalDuration) * 100;
  
  const heights = importanceHeight[event.importance] || importanceHeight.standard;
  const isMoment = event.type === 'moment';
  const isEra = event.type === 'era';

  // Moments render as diamond markers
  if (isMoment) {
    return (
      <div
        className={`event-block absolute cursor-pointer group ${isActive ? 'active z-20' : 'z-10'}`}
        style={{
          left: `${startPercent}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        title={`${event.title}\n${event.start.toLocaleDateString()}`}
      >
        {/* Diamond marker */}
        <div
          className={`relative transition-all duration-200 ${
            event.importance === 'landmark' ? 'w-5 h-5' :
            event.importance === 'major' ? 'w-4 h-4' : 'w-3 h-3'
          }`}
          style={{
            backgroundColor: `hsl(var(${colorVar}))`,
            transform: 'rotate(45deg)',
            boxShadow: isActive 
              ? `0 0 20px hsl(var(${colorVar})), 0 0 40px hsl(var(${colorVar}) / 0.5)` 
              : `0 0 8px hsl(var(${colorVar}) / 0.5)`,
            borderRadius: '2px',
          }}
        />
        
        {/* Vertical line for moments */}
        <div 
          className="absolute left-1/2 w-[1px] -translate-x-1/2 opacity-40 group-hover:opacity-70 transition-opacity"
          style={{
            backgroundColor: `hsl(var(${colorVar}))`,
            top: '-40px',
            height: '40px',
          }}
        />
        <div 
          className="absolute left-1/2 w-[1px] -translate-x-1/2 opacity-40 group-hover:opacity-70 transition-opacity"
          style={{
            backgroundColor: `hsl(var(${colorVar}))`,
            bottom: '-40px',
            height: '40px',
          }}
        />

        {/* Label on hover */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-all duration-200 ${
            isActive ? 'opacity-100 -top-8' : 'opacity-0 -top-6 group-hover:opacity-100 group-hover:-top-8'
          }`}
        >
          <span className="text-[10px] font-semibold text-white bg-black/70 px-2 py-0.5 rounded">
            {event.title}
          </span>
        </div>
      </div>
    );
  }

  // Eras render as subtle background bands
  if (isEra) {
    return (
      <div
        className={`event-block absolute cursor-pointer transition-all duration-300 ${
          isActive ? 'active' : ''
        }`}
        style={{
          left: `${startPercent}%`,
          width: `${widthPercent}%`,
          top: 0,
          bottom: 0,
          minWidth: "8px",
          backgroundColor: isActive 
            ? `hsl(var(${colorVar}) / 0.25)` 
            : `hsl(var(${colorVar}) / 0.12)`,
          borderLeft: `2px solid hsl(var(${colorVar}) / ${isActive ? 0.8 : 0.4})`,
          borderRight: `2px solid hsl(var(${colorVar}) / ${isActive ? 0.8 : 0.4})`,
        }}
        title={`${event.title}\n${event.start.getFullYear()}–${endDate.getFullYear()}`}
      >
        {/* Era label at top */}
        {widthPercent > 1 && (
          <div className="absolute top-1 left-2 right-2 overflow-hidden">
            <span 
              className={`text-[9px] uppercase tracking-wider font-semibold truncate block transition-colors ${
                isActive ? 'text-white/80' : 'text-white/40'
              }`}
            >
              {event.title}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Periods render as standard bars with importance-based height
  return (
    <div
      className={`event-block absolute rounded cursor-pointer border transition-all duration-200 ${
        isActive 
          ? 'active border-white/30 z-20' 
          : 'border-white/10 hover:border-white/20 z-10'
      }`}
      style={{
        left: `${startPercent}%`,
        width: `${widthPercent}%`,
        top: `${heights.top}px`,
        bottom: `${heights.bottom}px`,
        minWidth: "4px",
        backgroundColor: isActive 
          ? `hsl(var(${colorVar}))` 
          : `hsl(var(${colorVar}) / 0.65)`,
        boxShadow: isActive 
          ? `0 0 30px hsl(var(${colorVar}) / 0.5), 0 0 60px hsl(var(${colorVar}) / 0.3), inset 0 1px 0 hsl(0 0% 100% / 0.2)` 
          : 'inset 0 1px 0 hsl(0 0% 100% / 0.1)',
      }}
      title={`${event.title}\n${event.start.toLocaleDateString()} – ${endDate.toLocaleDateString()}`}
    >
      {/* Importance indicator for landmark events */}
      {event.importance === 'landmark' && (
        <div 
          className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-white/80"
          style={{ boxShadow: '0 0 6px white' }}
        />
      )}

      {/* Content */}
      {widthPercent > 2 && (
        <div className="px-2 py-1 h-full flex flex-col justify-center overflow-hidden">
          <span 
            className={`text-[11px] font-semibold truncate leading-tight ${
              isActive ? 'text-white' : 'text-white/90'
            }`}
          >
            {event.title}
          </span>
          {widthPercent > 4 && heights.top <= 10 && (
            <span className="text-[9px] text-white/60 truncate mt-0.5">
              {event.start.getFullYear()}–{endDate.getFullYear()}
            </span>
          )}
        </div>
      )}

      {/* Active indicator line at bottom */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/50 rounded-b" />
      )}
      
      {/* Category badges for cross-category events */}
      {event.categories.length > 1 && widthPercent > 3 && (
        <div className="absolute -bottom-1 right-1 flex gap-0.5">
          {event.categories.slice(1).map((cat) => (
            <div 
              key={cat}
              className="w-1.5 h-1.5 rounded-full opacity-70"
              style={{ backgroundColor: `hsl(var(--event-${cat}))` }}
              title={cat}
            />
          ))}
        </div>
      )}
    </div>
  );
};
