import { Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut } from "lucide-react";
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
    <div className="border-t border-border bg-card px-6 py-4">
      <div className="flex items-center gap-6">
        {/* Transport Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSeek(startTime)}
            className="h-8 w-8"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onPlayPause}
            className="h-10 w-10 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSeek(endTime)}
            className="h-8 w-8"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Time Display */}
        <div className="mono text-sm font-medium min-w-[180px]">
          {formatCurrentTime(currentTime, zoom)}
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Speed</span>
          <div className="w-24">
            <Slider
              value={[speed]}
              onValueChange={([value]) => onSpeedChange(value)}
              min={0.25}
              max={4}
              step={0.25}
              className="cursor-pointer"
            />
          </div>
          <span className="mono text-xs w-8">{speed}×</span>
        </div>

        {/* Zoom Control */}
        <div className="flex items-center gap-3 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onZoomChange(Math.max(1, zoom / 2))}
            className="h-8 w-8"
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
          
          <span className="mono text-xs w-16 text-center">{zoom.toFixed(0)}×</span>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onZoomChange(Math.min(65536, zoom * 2))}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};