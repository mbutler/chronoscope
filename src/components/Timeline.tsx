import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { TimelineLayer } from "./TimelineLayer";
import { PlaybackHead } from "./PlaybackHead";
import { PlaybackControls } from "./PlaybackControls";
import { EventInfoPanel } from "./EventInfoPanel";
import { timelineData, TimelineEvent, EventCategory, allEvents } from "@/data/timelineData";
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
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [showTimeTooltip, setShowTimeTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoverTime, setHoverTime] = useState<Date | null>(null);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const wasPlayingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'j':
          e.preventDefault();
          setCurrentTime(prev => {
            const scale = getTimelineScale(zoom);
            const newTime = new Date(prev.getTime() - scale.intervalMs * 5);
            return new Date(Math.max(startTimeMs, newTime.getTime()));
          });
          break;
        case 'l':
          e.preventDefault();
          setCurrentTime(prev => {
            const scale = getTimelineScale(zoom);
            const newTime = new Date(prev.getTime() + scale.intervalMs * 5);
            return new Date(Math.min(endTimeMs, newTime.getTime()));
          });
          break;
        case 'arrowleft':
          e.preventDefault();
          setCurrentTime(prev => {
            const scale = getTimelineScale(zoom);
            const newTime = new Date(prev.getTime() - scale.intervalMs);
            return new Date(Math.max(startTimeMs, newTime.getTime()));
          });
          break;
        case 'arrowright':
          e.preventDefault();
          setCurrentTime(prev => {
            const scale = getTimelineScale(zoom);
            const newTime = new Date(prev.getTime() + scale.intervalMs);
            return new Date(Math.min(endTimeMs, newTime.getTime()));
          });
          break;
        case 'home':
          e.preventDefault();
          setCurrentTime(startTime);
          break;
        case 'end':
          e.preventDefault();
          setCurrentTime(endTime);
          break;
        case '=':
        case '+':
          e.preventDefault();
          setZoom(prev => Math.min(65536, prev * 2));
          break;
        case '-':
          e.preventDefault();
          setZoom(prev => Math.max(1, prev / 2));
          break;
        case '1':
          setSpeed(0.5);
          break;
        case '2':
          setSpeed(1);
          break;
        case '3':
          setSpeed(2);
          break;
        case '4':
          setSpeed(4);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoom, startTimeMs, endTimeMs, startTime, endTime]);

  // Playback loop
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
        const advanceMs = deltaMs * speed * (scale.intervalMs / 500);
        const next = new Date(prev.getTime() + advanceMs);

        if (next.getTime() >= endTimeMs) {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
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

  // Update active events - handle all event types
  useEffect(() => {
    const currentTimeMs = currentTime.getTime();
    const momentWindow = 86400000 * 30; // 30 days for moment detection
    
    const events = allEvents.filter(event => {
      if (event.type === 'moment') {
        // Moments are "active" within a window around their time
        return Math.abs(currentTimeMs - event.start.getTime()) < momentWindow;
      } else {
        // Periods and eras check if current time is within range
        const endTime = event.end || event.start;
        return currentTimeMs >= event.start.getTime() && currentTimeMs <= endTime.getTime();
      }
    });
    
    // Sort by importance (landmark first) then by start date
    events.sort((a, b) => {
      const importanceOrder = { landmark: 0, major: 1, standard: 2, minor: 3 };
      const impDiff = importanceOrder[a.importance] - importanceOrder[b.importance];
      if (impDiff !== 0) return impDiff;
      return a.start.getTime() - b.start.getTime();
    });
    
    setActiveEvents(events);
  }, [currentTime]);

  const seekFromClientX = useCallback((clientX: number) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const scrollLeft = timelineRef.current.scrollLeft;
    const labelWidth = 128;
    const adjustedX = x - labelWidth;
    const timelineWidth = rect.width - labelWidth;
    const totalTimelineWidth = timelineWidth * zoom;
    const percentage = (adjustedX + scrollLeft) / totalTimelineWidth;
    const clampedPercentage = Math.max(0, Math.min(1, percentage));
    const newTimeMs = startTimeMs + clampedPercentage * totalDuration;
    return new Date(Math.max(startTimeMs, Math.min(endTimeMs, newTimeMs)));
  }, [zoom, startTimeMs, totalDuration, endTimeMs]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const newTime = seekFromClientX(e.clientX);
    if (newTime) setCurrentTime(newTime);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const labelWidth = 128;
    
    if (x < labelWidth) {
      setShowTimeTooltip(false);
      return;
    }

    const time = seekFromClientX(e.clientX);
    if (time) {
      setHoverTime(time);
      setTooltipPosition({ x: e.clientX, y: rect.top - 10 });
      setShowTimeTooltip(true);
    }
  }, [seekFromClientX]);

  const handleMouseLeave = useCallback(() => {
    setShowTimeTooltip(false);
  }, []);

  const onScrubPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    wasPlayingRef.current = isPlaying;
    if (isPlaying) setIsPlaying(false);
    setIsScrubbing(true);
    const newTime = seekFromClientX(e.clientX);
    if (newTime) setCurrentTime(newTime);

    const handleMove = (ev: PointerEvent) => {
      ev.preventDefault();
      const time = seekFromClientX(ev.clientX);
      if (time) setCurrentTime(time);
    };
    const handleUp = (ev: PointerEvent) => {
      ev.preventDefault();
      setIsScrubbing(false);
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
      if (wasPlayingRef.current) setIsPlaying(true);
    };
    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
  };

  const scale = getTimelineScale(zoom);
  const numIntervals = Math.ceil(totalDuration / scale.intervalMs) + 1;
  const progress = ((currentTime.getTime() - startTimeMs) / totalDuration) * 100;

  // Get layer keys for rendering
  const layerKeys: EventCategory[] = ['politics', 'science', 'culture', 'technology'];

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col h-screen bg-background ${isScrubbing ? 'scrubbing' : ''}`}
    >
      {/* Header */}
      <header className="relative border-b border-border px-6 py-4 flex items-center justify-between glass-surface">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
          <h1 className="font-display text-xl tracking-tight">CHRONOSCOPE</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="mono text-sm text-muted-foreground">
            {formatCurrentTime(currentTime, zoom)}
          </div>
          <div className="text-xs text-muted-foreground/60 hidden md:block">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Space</kbd> play · 
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] ml-1">←→</kbd> seek · 
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] ml-1">+/-</kbd> zoom
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-muted/30">
          <div 
            className="h-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(35_90%_60%)] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
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
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: isScrubbing ? "ew-resize" : "crosshair" }}
          >
            {/* Time Grid */}
            <div 
              className="sticky top-0 z-20 bg-[hsl(var(--timeline-bg))]"
            >
              <div 
                className="h-12 border-b border-[hsl(var(--timeline-grid))] flex ml-32"
                style={{ width: `calc(${100 * zoom}% - 8rem)` }}
              >
                {Array.from({ length: numIntervals }, (_, i) => {
                  const intervalTime = new Date(startTime.getTime() + i * scale.intervalMs);
                  const isMajor = i % scale.majorInterval === 0;
                  return (
                    <div
                      key={i}
                      className={`flex-shrink-0 border-r px-2 py-1 ${
                        isMajor 
                          ? 'border-[hsl(var(--timeline-grid))]' 
                          : 'border-[hsl(var(--timeline-grid))]/20'
                      }`}
                      style={{ width: `${(scale.intervalMs / totalDuration) * 100 * zoom}%` }}
                    >
                      {isMajor && (
                        <span className="mono text-[10px] text-muted-foreground whitespace-nowrap font-medium">
                          {scale.format(intervalTime)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layers */}
            <div className="relative" style={{ width: `${100 * zoom}%` }}>
              {layerKeys.map((key) => (
                <TimelineLayer
                  key={key}
                  layerKey={key}
                  layer={timelineData[key]}
                  startTime={startTime}
                  totalDuration={totalDuration}
                  zoom={zoom}
                  currentTime={currentTime}
                />
              ))}
              
              {/* Playback Head */}
              <div className="absolute left-32 right-0 top-0 bottom-0 pointer-events-none">
                <PlaybackHead
                  currentTime={currentTime}
                  startTime={startTime}
                  totalDuration={totalDuration}
                  zoom={zoom}
                  isPlaying={isPlaying}
                />
              </div>
              
              {/* Scrub Handle */}
              <div className="absolute left-32 right-0 top-0 bottom-0">
                {(() => {
                  const headPosition = getTimePosition(currentTime, startTime, totalDuration);
                  return (
                    <div
                      className="absolute top-0 bottom-0 w-6 z-30 cursor-ew-resize touch-none hover:bg-[hsl(var(--accent))]/5 transition-colors"
                      style={{ left: `calc(${headPosition}% - 12px)` }}
                      onPointerDown={onScrubPointerDown}
                    />
                  );
                })()}
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

      {/* Time Tooltip */}
      {showTimeTooltip && hoverTime && !isScrubbing && (
        <div 
          className="fixed z-50 time-tooltip animate-scale-in"
          style={{ 
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {formatCurrentTime(hoverTime, zoom)}
        </div>
      )}
    </div>
  );
};
