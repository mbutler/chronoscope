import { useEffect, useMemo, useRef, useState } from "react";
import { TimelineLayer } from "./TimelineLayer";
import { PlaybackHead } from "./PlaybackHead";
import { PlaybackControls } from "./PlaybackControls";
import { EventInfoPanel } from "./EventInfoPanel";
import { timelineData, TimelineEvent } from "@/data/timelineData";
import { getTimelineScale, formatCurrentTime, getTimePosition } from "@/utils/timelineUtils";

export const Timeline = () => {
  const startTime = useMemo(() => new Date("1900-01-01T00:00:00"), []);
  const endTime = useMemo(() => new Date("2025-12-31T23:59:59"), []);
  const startTimeMs = startTime.getTime();
  const endTimeMs = endTime.getTime();
  const totalDuration = endTimeMs - startTimeMs;

  const [currentTime, setCurrentTime] = useState(startTime);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [activeEvents, setActiveEvents] = useState<TimelineEvent[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying) return;

    let animationFrameId: number | null = null;
    let lastTimestamp: number | null = null;

    const tick = (timestamp: number) => {
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const deltaMs = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      setCurrentTime((prev) => {
        const scale = getTimelineScale(zoom);
        // Match previous behavior (~0.1 scale unit per 50ms => 2 units/second)
        // timeline_ms_per_real_ms = scale.intervalMs / 500
        const advanceMs = deltaMs * speed * (scale.intervalMs / 500);
        const next = new Date(prev.getTime() + advanceMs);

        if (next.getTime() >= endTimeMs) {
          // Stop at end
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          // Also reflect stopped state
          setIsPlaying(false);
          return new Date(endTimeMs);
        }
        return next;
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, speed, zoom, endTimeMs]);

  useEffect(() => {
    // Find all events that are active at current time
    const events: TimelineEvent[] = [];
    const currentTimeMs = currentTime.getTime();
    Object.values(timelineData).forEach((layer) => {
      layer.events.forEach((event) => {
        // Check if current time is within the event duration
        if (currentTimeMs >= event.start.getTime() && currentTimeMs <= event.end.getTime()) {
          events.push(event);
        }
      });
    });
    setActiveEvents(events);
  }, [currentTime]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const scrollLeft = timelineRef.current.scrollLeft;
    
    // Account for the label margin (8rem = 128px)
    const labelWidth = 128;
    const adjustedX = x - labelWidth;
    
    // Only process clicks in the timeline area (not on labels)
    if (adjustedX < 0) return;
    
    // Calculate the actual timeline width accounting for zoom and label
    const timelineWidth = rect.width - labelWidth;
    const totalTimelineWidth = timelineWidth * zoom;
    
    // Calculate the percentage position on the timeline
    const percentage = (adjustedX + scrollLeft) / totalTimelineWidth;
    
    // Clamp percentage between 0 and 1
    const clampedPercentage = Math.max(0, Math.min(1, percentage));
    
    // Convert to time
    const newTimeMs = startTimeMs + clampedPercentage * totalDuration;
    const newTime = new Date(Math.max(startTimeMs, Math.min(endTimeMs, newTimeMs)));
    setCurrentTime(newTime);
  };

  const scale = getTimelineScale(zoom);
  const numIntervals = Math.ceil(totalDuration / scale.intervalMs) + 1;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">HISTORICAL TIMELINE</h1>
        <div className="mono text-sm text-muted-foreground">
          {formatCurrentTime(currentTime, zoom)}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Timeline Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Timeline Container */}
          <div
            ref={timelineRef}
            className="flex-1 relative overflow-x-auto overflow-y-auto bg-[hsl(var(--timeline-bg))]"
            onClick={handleTimelineClick}
            style={{ cursor: "pointer" }}
          >
            {/* Time Grid */}
            <div className="absolute top-0 left-32 h-12 border-b border-[hsl(var(--timeline-grid))] flex" style={{ width: `calc(${100 * zoom}% - 8rem)` }}>
              {Array.from({ length: numIntervals }, (_, i) => {
                const intervalTime = new Date(startTime.getTime() + i * scale.intervalMs);
                const isMajor = i % scale.majorInterval === 0;
                return (
                  <div
                    key={i}
                    className={`flex-shrink-0 border-r px-2 py-1 ${
                      isMajor ? 'border-[hsl(var(--timeline-grid))]' : 'border-[hsl(var(--timeline-grid))]/30'
                    }`}
                    style={{ width: `${(scale.intervalMs / totalDuration) * 100 * zoom}%` }}
                  >
                    {isMajor && (
                      <span className="mono text-xs text-muted-foreground whitespace-nowrap">
                        {scale.format(intervalTime)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Layers */}
            <div className="mt-12 relative" style={{ width: `${100 * zoom}%` }}>
              {Object.entries(timelineData).map(([key, layer]) => (
                <TimelineLayer
                  key={key}
                  layer={layer}
                  startTime={startTime}
                  totalDuration={totalDuration}
                  zoom={zoom}
                  currentTime={currentTime}
                />
              ))}
              
              {/* Playback Head */}
              <div className="absolute left-32 right-0 top-0 bottom-0">
                <PlaybackHead
                  currentTime={currentTime}
                  startTime={startTime}
                  totalDuration={totalDuration}
                  zoom={zoom}
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <PlaybackControls
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            speed={speed}
            onSpeedChange={setSpeed}
            zoom={zoom}
            onZoomChange={setZoom}
            currentTime={currentTime}
            onSeek={(time) => setCurrentTime(time)}
            startTime={startTime}
            endTime={endTime}
          />
        </div>

        {/* Info Panel */}
        <EventInfoPanel events={activeEvents} currentTime={currentTime} />
      </div>
    </div>
  );
};