import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameDay,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { X } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
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

export const WeekView = ({
  currentDate,
  events,
  selectedDate,
  onDateSelect,
  onDeleteEvent,
}: WeekViewProps) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventsForDay = (day: Date) =>
    events.filter((event) => {
      const eventStart = startOfDay(event.startDate);
      const eventEnd = endOfDay(event.endDate);
      return isWithinInterval(day, { start: eventStart, end: eventEnd });
    });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header with dates */}
      <div className="flex border-b border-border">
        <div className="w-16 flex-shrink-0" />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="flex-1 py-3 text-center border-r border-border last:border-r-0"
          >
            <div className="text-xs font-medium text-muted-foreground uppercase">
              {format(day, 'EEE', { locale: ru })}
            </div>
            <button
              onClick={() => onDateSelect(day)}
              className={cn(
                'mt-1 w-8 h-8 mx-auto flex items-center justify-center text-lg font-medium rounded-full transition-colors',
                isToday(day) && 'bg-primary text-primary-foreground',
                !isToday(day) && 'hover:bg-accent',
                selectedDate && isSameDay(day, selectedDate) && !isToday(day) && 'bg-accent'
              )}
            >
              {format(day, 'd')}
            </button>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex">
          {/* Time column */}
          <div className="w-16 flex-shrink-0">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-12 flex items-start justify-end pr-2 -mt-2"
              >
                <span className="text-xs text-muted-foreground">
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="flex-1 border-r border-border last:border-r-0 relative"
            >
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-12 border-b border-border/50"
                />
              ))}
              
              {/* Events overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {getEventsForDay(day).map((event) => {
                  if (event.isAllDay || !event.startTime) {
                    const isStart = isSameDay(event.startDate, day);
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          'group absolute left-1 right-1 top-1 px-2 py-1 text-xs font-medium rounded pointer-events-auto cursor-pointer text-primary-foreground flex items-center justify-between',
                          eventColorClasses[event.color]
                        )}
                      >
                        <span className="truncate">{isStart ? event.title : ''}</span>
                        <span
                          onClick={() => onDeleteEvent(event.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/20 rounded p-0.5 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </div>
                    );
                  }
                  
                  const [startHour] = event.startTime.split(':').map(Number);
                  const [endHour] = (event.endTime || event.startTime).split(':').map(Number);
                  const duration = Math.max(1, endHour - startHour);
                  
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        'group absolute left-1 right-1 px-2 py-1 text-xs font-medium rounded pointer-events-auto cursor-pointer text-primary-foreground flex items-center justify-between',
                        eventColorClasses[event.color]
                      )}
                      style={{
                        top: `${startHour * 48}px`,
                        height: `${duration * 48 - 4}px`,
                      }}
                    >
                      <span className="truncate">{event.title}</span>
                      <span
                        onClick={() => onDeleteEvent(event.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/20 rounded p-0.5 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
