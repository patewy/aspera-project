import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { X } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDeleteEvent: (eventId: string) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);

const eventColorClasses: Record<CalendarEvent['color'], string> = {
  red: 'bg-event-red',
  orange: 'bg-event-orange',
  yellow: 'bg-event-yellow',
  green: 'bg-event-green',
  blue: 'bg-event-blue',
  purple: 'bg-event-purple',
  pink: 'bg-event-pink',
};

export const DayView = ({ currentDate, events, onDeleteEvent }: DayViewProps) => {
  const dayEvents = events.filter((event) => {
    const eventStart = startOfDay(event.startDate);
    const eventEnd = endOfDay(event.endDate);
    return isWithinInterval(currentDate, { start: eventStart, end: eventEnd });
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border">
        <div className="text-center">
          <div className="text-xs font-medium text-muted-foreground uppercase">
            {format(currentDate, 'EEEE', { locale: ru })}
          </div>
          <div className="text-3xl font-semibold">
            {format(currentDate, 'd')}
          </div>
        </div>
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex">
          {/* Time column */}
          <div className="w-20 flex-shrink-0">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-16 flex items-start justify-end pr-3 -mt-2"
              >
                <span className="text-xs text-muted-foreground">
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Main area */}
          <div className="flex-1 relative border-l border-border">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b border-border/50"
              />
            ))}
            
            {/* Events overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {dayEvents.map((event) => {
                if (event.isAllDay || !event.startTime) {
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        'group absolute left-2 right-4 top-2 px-3 py-2 text-sm font-medium rounded-lg pointer-events-auto cursor-pointer text-primary-foreground shadow-sm flex items-center justify-between',
                        eventColorClasses[event.color]
                      )}
                    >
                      <span>{event.title}</span>
                      <span
                        onClick={() => onDeleteEvent(event.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/20 rounded p-0.5 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </span>
                    </div>
                  );
                }
                
                const [startHour, startMin] = event.startTime.split(':').map(Number);
                const [endHour, endMin] = (event.endTime || event.startTime).split(':').map(Number);
                const startOffset = startHour * 64 + (startMin / 60) * 64;
                const endOffset = endHour * 64 + (endMin / 60) * 64;
                const duration = Math.max(32, endOffset - startOffset);
                
                return (
                  <div
                    key={event.id}
                    className={cn(
                      'group absolute left-2 right-4 px-3 py-2 text-sm font-medium rounded-lg pointer-events-auto cursor-pointer text-primary-foreground shadow-sm',
                      eventColorClasses[event.color]
                    )}
                    style={{
                      top: `${startOffset}px`,
                      height: `${duration - 4}px`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold truncate">{event.title}</div>
                      <span
                        onClick={() => onDeleteEvent(event.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/20 rounded p-0.5 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="text-xs opacity-90">
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
