import { getTimePosition } from "@/utils/timelineUtils";

interface PlaybackHeadProps {
  currentTime: Date;
  startTime: Date;
  totalDuration: number;
  zoom: number;
  isPlaying: boolean;
}

export const PlaybackHead = ({
  currentTime,
  startTime,
  totalDuration,
  isPlaying,
}: PlaybackHeadProps) => {
  const position = getTimePosition(currentTime, startTime, totalDuration);

  return (
    <>
      {/* Main vertical line with glow */}
      <div
        className={`absolute top-0 bottom-0 w-[2px] playhead-line z-20 ${isPlaying ? 'animate-pulse-glow' : ''}`}
        style={{
          left: `${position}%`,
          transition: isPlaying ? 'none' : 'left 0.1s ease-out',
        }}
      />
      
      {/* Top marker - diamond shape */}
      <div
        className="absolute -top-1 w-4 h-4 z-20"
        style={{
          left: `calc(${position}% - 7px)`,
          transition: isPlaying ? 'none' : 'left 0.1s ease-out',
        }}
      >
        <div 
          className={`w-full h-full bg-[hsl(var(--playhead))] transform rotate-45 rounded-sm ${isPlaying ? 'animate-breathe' : ''}`}
          style={{
            boxShadow: "0 0 15px hsl(var(--playhead)), 0 0 30px hsl(var(--playhead) / 0.5)",
          }}
        />
      </div>

      {/* Bottom marker - subtle triangle */}
      <div
        className="absolute bottom-0 z-20"
        style={{
          left: `calc(${position}% - 6px)`,
          transition: isPlaying ? 'none' : 'left 0.1s ease-out',
        }}
      >
        <div 
          className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-[hsl(var(--playhead))]"
          style={{
            filter: "drop-shadow(0 0 6px hsl(var(--playhead)))",
          }}
        />
      </div>
    </>
  );
};
