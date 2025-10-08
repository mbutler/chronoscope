export type ZoomLevel = 'year' | 'month' | 'day' | 'hour';

export interface TimelineScale {
  unit: ZoomLevel;
  intervalMs: number;
  format: (date: Date) => string;
  majorInterval: number; // How many units per major gridline
}

export const getTimelineScale = (zoom: number): TimelineScale => {
  if (zoom >= 50000) {
    return {
      unit: 'hour',
      intervalMs: 3600000, // 1 hour
      format: (date: Date) => date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric',
        hour12: false 
      }),
      majorInterval: 6, // Major gridline every 6 hours
    };
  } else if (zoom >= 2000) {
    return {
      unit: 'day',
      intervalMs: 86400000, // 1 day
      format: (date: Date) => date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      majorInterval: 7, // Major gridline every week
    };
  } else if (zoom >= 50) {
    return {
      unit: 'month',
      intervalMs: 2629746000, // ~1 month
      format: (date: Date) => date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      }),
      majorInterval: 12, // Major gridline every year
    };
  } else {
    return {
      unit: 'year',
      intervalMs: 31556952000, // 1 year
      format: (date: Date) => date.getFullYear().toString(),
      majorInterval: 10, // Major gridline every 10 years
    };
  }
};

export const formatCurrentTime = (date: Date, zoom: number): string => {
  if (zoom >= 50000) {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } else if (zoom >= 2000) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } else if (zoom >= 50) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  } else {
    return date.getFullYear().toString();
  }
};

export const getTimePosition = (
  time: Date,
  startTime: Date,
  totalDuration: number
): number => {
  const elapsed = time.getTime() - startTime.getTime();
  return (elapsed / totalDuration) * 100;
};

export const getTimeFromPosition = (
  position: number,
  startTime: Date,
  totalDuration: number
): Date => {
  const elapsed = (position / 100) * totalDuration;
  return new Date(startTime.getTime() + elapsed);
};