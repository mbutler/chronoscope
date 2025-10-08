import { TimelineEvent } from "@/data/timelineData";
import { getTimePosition } from "@/utils/timelineUtils";

interface TimelineEventBlockProps {
  event: TimelineEvent;
  startTime: Date;
  totalDuration: number;
  zoom: number;
  color: string;
  isActive: boolean;
}

export const TimelineEventBlock = ({
  event,
  startTime,
  totalDuration,
  zoom,
  color,
  isActive,
}: TimelineEventBlockProps) => {
  // Calculate position as percentage of total timeline (0-100)
  const startPercent = getTimePosition(event.start, startTime, totalDuration);
  const duration = event.end.getTime() - event.start.getTime();
  const widthPercent = (duration / totalDuration) * 100;

  return (
    <div
      className="absolute top-2 bottom-2 rounded-sm cursor-pointer hover:opacity-80 border border-white/10"
      style={{
        left: `${startPercent}%`,
        width: `${widthPercent}%`,
        backgroundColor: isActive ? color : `${color}99`,
        minWidth: "2px",
        boxShadow: isActive ? `0 0 20px ${color}` : "none",
      }}
      title={event.title}
    >
      {widthPercent > 3 && (
        <div className="px-2 py-1 h-full flex items-center">
          <span className="text-xs font-medium truncate text-white">
            {event.title}
          </span>
        </div>
      )}
    </div>
  );
};