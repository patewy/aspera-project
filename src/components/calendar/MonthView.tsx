import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from 'date-fns';
import { CalendarEvent } from '@/types/calendar';
import { CalendarDay } from './CalendarDay';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onDeleteEvent: (eventId: string) => void;
}

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const MonthView = ({
  currentDate,
  events,
  selectedDate,
  onDateSelect,
  onDeleteEvent,
}: MonthViewProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Week day headers */}
      <div className="calendar-grid border-b border-border">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 calendar-grid overflow-hidden">
        {days.map((day) => (
          <CalendarDay
            key={day.toISOString()}
            date={day}
            currentMonth={currentDate}
            events={events}
            isSelected={selectedDate ? day.toDateString() === selectedDate.toDateString() : false}
            onClick={onDateSelect}
            onDeleteEvent={onDeleteEvent}
          />
        ))}
      </div>
    </div>
  );
};
