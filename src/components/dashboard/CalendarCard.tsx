import { useMemo } from "react";
import BlockHeader from "./BlockHeader";

const CalendarCard = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const calendarData = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    const days: { day: number; isCurrentMonth: boolean; hasEvent?: string[] }[] = [];
    
    // Previous month days
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const events: string[] = [];
      if (i === 1) events.push("pink", "yellow", "green");
      if (i === 2) events.push("pink", "blue");
      if (i === 8) events.push("green");
      if (i === 18) events.push("blue");
      
      days.push({ day: i, isCurrentMonth: true, hasEvent: events.length > 0 ? events : undefined });
    }
    
    // Fill remaining days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    
    return days;
  }, [currentMonth, currentYear]);

  const eventColors: Record<string, string> = {
    pink: "bg-pink-400",
    yellow: "bg-yellow-400",
    green: "bg-green-400",
    blue: "bg-blue-400",
  };

  return (
    <div className="h-full bg-card border border-border rounded-[0.75rem] p-6 flex flex-col animate-fade-in-delay-1">
      <BlockHeader title="Календарь" to="/calendar" />
      
      <div className="grid grid-cols-7 gap-1 flex-1">
        {calendarData.slice(0, 42).map((item, index) => (
          <div
            key={index}
            className={`
              flex flex-col items-center justify-start p-1 rounded text-xs
              ${item.isCurrentMonth ? "text-foreground" : "text-muted-foreground/50"}
            `}
          >
            <span className="mb-0.5">{item.day}</span>
            {item.hasEvent && (
              <div className="flex flex-col gap-0.5 w-full">
                {item.hasEvent.map((color, i) => (
                  <div key={i} className={`h-0.5 w-full rounded ${eventColors[color]}`} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarCard;
