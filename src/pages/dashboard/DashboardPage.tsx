import ProfileCard from "@/components/dashboard/ProfileCard";
import CalendarCard from "@/components/dashboard/CalendarCard";
import PlaceholderCard from "@/components/dashboard/PlaceholderCard";
import NotebookCard from "@/components/dashboard/NotebookCard";
import CommunityCard from "@/components/dashboard/CommunityCard";

const Index = () => {
  return (
    // Убираем min-h-screen, используем фиксированную высоту viewport
    <div className="h-screen bg-background overflow-hidden p-2 md:p-3 lg:p-4">
      {/* Мобильная версия (stack layout) - теперь без скролла */}
      <div className="flex flex-col h-full gap-2 md:hidden">
        <div className="flex-1 min-h-0"> {/* Добавляем min-h-0 для правильного flex-скейла */}
          <ProfileCard />
        </div>
        
        <div className="flex-1 min-h-0">
          <CalendarCard />
        </div>
        
        <div className="flex-1 min-h-0">
          <PlaceholderCard />
        </div>
        
        <div className="flex-1 min-h-0">
          <NotebookCard />
        </div>
        
        <div className="flex-1 min-h-0">
          <CommunityCard />
        </div>
      </div>
      
      {/* Десктопная версия (grid layout) - занимает всю высоту и ширину */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-3 lg:gap-4 h-full">
        {/* Profile Card - адаптивная ширина */}
        <div className="md:col-span-3 lg:col-span-2 h-full">
          <div className="h-full">
            <ProfileCard />
          </div>
        </div>
        
        {/* Основная область - занимает оставшееся пространство */}
        <div className="md:col-span-9 lg:col-span-10 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 h-full">
            {/* Верхний ряд - равная высота */}
            <div className="h-full">
              <CalendarCard />
            </div>
            
            <div className="h-full">
              <PlaceholderCard />
            </div>
            
            {/* Нижний ряд - равная высота */}
            <div className="h-full">
              <NotebookCard />
            </div>
            
            <div className="h-full">
              <CommunityCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;