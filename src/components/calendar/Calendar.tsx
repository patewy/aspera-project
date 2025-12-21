import { useState } from 'react';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { CalendarEvent, ViewMode } from '@/types/calendar';
import { CalendarHeader } from './CalendarHeader';
import { Sidebar } from './Sidebar';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { EventModal } from './EventModal';
import { TopHeader } from '@/components/layout/TopHeader';

const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Созвон с командой',
    startDate: new Date(),
    endDate: new Date(),
    startTime: '10:00',
    endTime: '11:00',
    color: 'blue',
  },
  {
    id: '2',
    title: 'Отпуск',
    startDate: new Date(),
    endDate: new Date(Date.now() + 86400000 * 3),
    color: 'green',
    isAllDay: true,
  },
  {
    id: '3',
    title: 'Презентация проекта',
    startDate: new Date(Date.now() + 86400000),
    endDate: new Date(Date.now() + 86400000),
    startTime: '15:00',
    endTime: '16:30',
    color: 'purple',
  },
  {
    id: '4',
    title: 'Конференция',
    startDate: new Date(Date.now() + 86400000 * 2),
    endDate: new Date(Date.now() + 86400000 * 4),
    color: 'orange',
    isAllDay: true,
  },
];

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
  };

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents([...events, newEvent]);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  return (
    <div className="flex flex-col h-screen bg-background p-4">
      <TopHeader currentPage="Календарь" />
      
      <div className="flex flex-1 gap-4 overflow-hidden">
        <Sidebar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
        
        <main className="flex-1 flex flex-col overflow-hidden rounded-xl border border-border bg-card">
        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          onViewModeChange={setViewMode}
          onAddEvent={() => setIsModalOpen(true)}
        />
        
        {viewMode === 'month' && (
          <MonthView
            currentDate={currentDate}
            events={events}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onDeleteEvent={handleDeleteEvent}
          />
        )}
        
        {viewMode === 'week' && (
          <WeekView
            currentDate={currentDate}
            events={events}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onDeleteEvent={handleDeleteEvent}
          />
        )}
        
        {viewMode === 'day' && (
          <DayView
            currentDate={currentDate}
            events={events}
            onDeleteEvent={handleDeleteEvent}
          />
        )}
        </main>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEvent}
        selectedDate={selectedDate || new Date()}
      />
    </div>
  );
};
