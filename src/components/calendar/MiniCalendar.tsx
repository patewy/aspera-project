import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MiniCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const MiniCalendar = ({ selectedDate, onDateSelect }: MiniCalendarProps) => {
  const [viewDate, setViewDate] = useState(new Date());

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium capitalize">
          {format(viewDate, 'LLLL yyyy', { locale: ru })}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setViewDate(subMonths(viewDate, 1))}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewDate(addMonths(viewDate, 1))}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-muted-foreground font-medium py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, viewDate);
          const isCurrentDay = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={cn(
                'w-8 h-8 text-xs rounded-full flex items-center justify-center transition-colors',
                !isCurrentMonth && 'text-muted-foreground/50',
                isCurrentMonth && !isCurrentDay && !isSelected && 'hover:bg-accent',
                isCurrentDay && 'bg-primary text-primary-foreground',
                isSelected && !isCurrentDay && 'bg-accent'
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};
