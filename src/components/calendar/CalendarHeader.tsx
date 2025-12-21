import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types/calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onAddEvent: () => void;
}

export const CalendarHeader = ({
  currentDate,
  viewMode,
  onPrevious,
  onNext,
  onToday,
  onViewModeChange,
  onAddEvent,
}: CalendarHeaderProps) => {
  const formatTitle = () => {
    if (viewMode === 'month') {
      return format(currentDate, 'LLLL yyyy', { locale: ru });
    }
    if (viewMode === 'week') {
      return format(currentDate, "'Неделя' w, LLLL yyyy", { locale: ru });
    }
    return format(currentDate, 'd MMMM yyyy', { locale: ru });
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold capitalize tracking-tight">
          {formatTitle()}
        </h1>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="h-8 w-8 hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="h-8 w-8 hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="h-8 px-3 text-sm font-medium border-border hover:bg-accent"
        >
          Сегодня
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-secondary rounded-lg p-1">
          {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === mode
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {mode === 'month' ? 'Месяц' : mode === 'week' ? 'Неделя' : 'День'}
            </button>
          ))}
        </div>

        <Button
          onClick={onAddEvent}
          size="sm"
          className="h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-1" />
          Событие
        </Button>
      </div>
    </header>
  );
};
