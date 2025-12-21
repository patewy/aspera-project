import { CalendarDays, Settings } from 'lucide-react';
import { MiniCalendar } from './MiniCalendar';

interface SidebarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export const Sidebar = ({ selectedDate, onDateSelect }: SidebarProps) => {
  return (
    <aside className="w-72 rounded-xl flex flex-col bg-card border border-border overflow-hidden">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Календарь</span>
        </div>
      </div>

      {/* Mini calendar */}
      <div className="p-6">
        <MiniCalendar selectedDate={selectedDate} onDateSelect={onDateSelect} />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings */}
      <div className="p-6 border-t border-border">
        <button className="flex items-center gap-3 w-full py-3 px-4 rounded-xl bg-secondary hover:bg-accent transition-colors text-foreground">
          <Settings className="h-5 w-5" />
          <span className="text-base font-medium">Настройки</span>
        </button>
      </div>
    </aside>
  );
};
