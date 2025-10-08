import { getTimePosition } from "@/utils/timelineUtils";

interface PlaybackHeadProps {
  currentTime: Date;
  startTime: Date;
  totalDuration: number;
  zoom: number;
}

export const PlaybackHead = ({
  currentTime,
  startTime,
  totalDuration,
  zoom,
}: PlaybackHeadProps) => {
  const position = getTimePosition(currentTime, startTime, totalDuration);

  return (
    <>
      {/* Vertical line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-[hsl(var(--playhead))] pointer-events-none z-20"
        style={{
          left: `${position}%`,
          boxShadow: "0 0 10px hsl(var(--playhead)), 0 0 20px hsl(var(--playhead))",
        }}
      />
      
      {/* Top marker */}
      <div
        className="absolute top-0 w-4 h-4 pointer-events-none z-20"
        style={{
          left: `calc(${position}% - 8px)`,
        }}
      >
        <div className="w-full h-full bg-[hsl(var(--playhead))] transform rotate-45" style={{
          boxShadow: "0 0 10px hsl(var(--playhead))",
        }}/>
      </div>
    </>
  );
};