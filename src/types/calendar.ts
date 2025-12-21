export interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';
  isAllDay?: boolean;
}

export type ViewMode = 'month' | 'week' | 'day';
