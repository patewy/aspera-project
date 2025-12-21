import { format, isToday, isSameMonth, isWithinInterval, startOfDay, endOfDay, isSameDay } from 'date-fns';
import { X } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
  events: CalendarEvent[];
  isSelected?: boolean;
  onClick: (date: Date) => void;
  onDeleteEvent?: (eventId: string) => void;
}

const eventColorClasses: Record<CalendarEvent['color'], string> = {
  red: 'bg-event-red',
  orange: 'bg-event-orange',
  yellow: 'bg-event-yellow',
  green: 'bg-event-green',
  blue: 'bg-event-blue',
  purple: 'bg-event-purple',
  pink: 'bg-event-pink',
};

export const CalendarDay = ({
  date,
  currentMonth,
  events,
  isSelected,
  onClick,
  onDeleteEvent,
}: CalendarDayProps) => {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isCurrentDay = isToday(date);
  
  const dayEvents = events.filter((event) => {
    const eventStart = startOfDay(event.startDate);
    const eventEnd = endOfDay(event.endDate);
    return isWithinInterval(date, { start: eventStart, end: eventEnd });
  });

  const handleDeleteClick = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    onDeleteEvent?.(eventId);
  };

  return (
    <button
      onClick={() => onClick(date)}
      className={cn(
        'relative flex flex-col items-start p-2 min-h-[100px] border-r border-b border-border transition-colors hover:bg-accent/50',
        !isCurrentMonth && 'opacity-40',
        isSelected && 'bg-accent/70'
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full',
          isCurrentDay && 'bg-primary text-primary-foreground',
          !isCurrentDay && isCurrentMonth && 'text-foreground',
          !isCurrentMonth && 'text-muted-foreground'
        )}
      >
        {format(date, 'd')}
      </span>

      <div className="flex flex-col gap-1 mt-1 w-full">
        {dayEvents.slice(0, 3).map((event) => {
          const isStart = isSameDay(event.startDate, date);
          const isEnd = isSameDay(event.endDate, date);
          const isMultiDay = !isSameDay(event.startDate, event.endDate);
          
          return (
            <div
              key={event.id}
              className={cn(
                'group relative px-2 py-0.5 text-xs font-medium truncate text-primary-foreground flex items-center justify-between',
                eventColorClasses[event.color],
                isMultiDay && !isStart && 'rounded-l-none -ml-2 pl-3',
                isMultiDay && !isEnd && 'rounded-r-none -mr-2 pr-3',
                !isMultiDay && 'rounded',
                isMultiDay && isStart && 'rounded-l',
                isMultiDay && isEnd && 'rounded-r'
              )}
            >
              <span className="truncate">{isStart ? event.title : ''}</span>
              {onDeleteEvent && (
                <span
                  onClick={(e) => handleDeleteClick(e, event.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:bg-background/20 rounded p-0.5 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </span>
              )}
            </div>
          );
        })}
        {dayEvents.length > 3 && (
          <span className="text-xs text-muted-foreground px-2">
            +{dayEvents.length - 3} ещё
          </span>
        )}
      </div>
    </button>
  );
};
