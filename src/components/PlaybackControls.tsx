import { Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut, Gauge } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { formatCurrentTime } from "@/utils/timelineUtils";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  currentTime: Date;
  onSeek: (time: Date) => void;
  startTime: Date;
  endTime: Date;
}

const speedPresets = [0.25, 0.5, 1, 2, 4];

export const PlaybackControls = ({
  isPlaying,
  onPlayPause,
  speed,
  onSpeedChange,
  zoom,
  onZoomChange,
  currentTime,
  onSeek,
  startTime,
  endTime,
}: PlaybackControlsProps) => {
  return (
    <div className="border-t border-border glass-surface px-6 py-4">
      <div className="flex items-center gap-6">
        {/* Transport Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSeek(startTime)}
            className="h-9 w-9 control-btn text-muted-foreground hover:text-foreground"
            title="Go to start (Home)"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onPlayPause}
            className="h-12 w-12 play-btn text-background rounded-full"
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSeek(endTime)}
            className="h-9 w-9 control-btn text-muted-foreground hover:text-foreground"
            title="Go to end (End)"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Time Display */}
        <div className="flex flex-col gap-0.5">
          <div className="mono text-sm font-semibold min-w-[180px] text-foreground">
            {formatCurrentTime(currentTime, zoom)}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Current Time
          </div>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/30">
          <Gauge className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-1">
            {speedPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => onSpeedChange(preset)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  speed === preset 
                    ? 'bg-[hsl(var(--accent))] text-background' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {preset}×
              </button>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Zoom Control */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onZoomChange(Math.max(1, zoom / 2))}
            className="h-8 w-8 control-btn text-muted-foreground hover:text-foreground"
            title="Zoom out (-)"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <div className="w-32">
            <Slider
              value={[Math.log2(zoom)]}
              onValueChange={([value]) => onZoomChange(Math.pow(2, value))}
              min={0}
              max={16}
              step={0.1}
              className="cursor-pointer"
            />
          </div>
          
          <span className="mono text-xs w-16 text-center font-medium text-foreground">
            {zoom >= 1000 ? `${(zoom / 1000).toFixed(1)}k` : zoom.toFixed(0)}×
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onZoomChange(Math.min(65536, zoom * 2))}
            className="h-8 w-8 control-btn text-muted-foreground hover:text-foreground"
            title="Zoom in (+)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
