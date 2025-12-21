import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { X } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  selectedDate: Date;
}

const colors: CalendarEvent['color'][] = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
];

const colorClasses: Record<CalendarEvent['color'], string> = {
  red: 'bg-event-red',
  orange: 'bg-event-orange',
  yellow: 'bg-event-yellow',
  green: 'bg-event-green',
  blue: 'bg-event-blue',
  purple: 'bg-event-purple',
  pink: 'bg-event-pink',
};

export const EventModal = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
}: EventModalProps) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState<CalendarEvent['color']>('blue');
  const [duration, setDuration] = useState(1);
  const [isMultiDay, setIsMultiDay] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const endDate = isMultiDay ? addDays(selectedDate, duration - 1) : selectedDate;

    onSave({
      title: title.trim(),
      startDate: selectedDate,
      endDate,
      startTime: isMultiDay ? undefined : startTime,
      endTime: isMultiDay ? undefined : endTime,
      color,
      isAllDay: isMultiDay,
    });

    setTitle('');
    setStartTime('09:00');
    setEndTime('10:00');
    setColor('blue');
    setDuration(1);
    setIsMultiDay(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-xl shadow-lg w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Новое событие</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Input
              placeholder="Название события"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg bg-secondary border-0 focus-visible:ring-1"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="capitalize">
              {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: ru })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isMultiDay}
                onChange={(e) => setIsMultiDay(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-secondary"
              />
              <span className="text-sm">На несколько дней</span>
            </label>
          </div>

          {isMultiDay ? (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Количество дней
              </label>
              <Input
                type="number"
                min={1}
                max={30}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                className="bg-secondary border-0"
              />
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">
                  Начало
                </label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-secondary border-0"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">
                  Конец
                </label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-secondary border-0"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">
              Цвет
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'w-8 h-8 rounded-full transition-transform',
                    colorClasses[c],
                    color === c && 'ring-2 ring-foreground ring-offset-2 ring-offset-card scale-110'
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Отмена
            </Button>
            <Button type="submit">
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
