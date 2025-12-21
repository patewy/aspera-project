import ProfileCard from "@/components/dashboard/ProfileCard";
import CalendarCard from "@/components/dashboard/CalendarCard";
import PlaceholderCard from "@/components/dashboard/PlaceholderCard";
import NotebookCard from "@/components/dashboard/NotebookCard";
import CommunityCard from "@/components/dashboard/CommunityCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Мобильная версия (stack layout) */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="w-full">
          <ProfileCard />
        </div>
        
        <div className="w-full">
          <CalendarCard />
        </div>
        
        <div className="w-full">
          <PlaceholderCard />
        </div>
        
        <div className="w-full">
          <NotebookCard />
        </div>
        
        <div className="w-full">
          <CommunityCard />
        </div>
      </div>
      
      {/* Десктопная версия (grid layout) */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-4 lg:gap-6 min-h-[calc(100vh-2rem)]">
        {/* Profile Card - 3 колонки из 12 на десктопе */}
        <div className="md:col-span-3 xl:col-span-2 h-full">
          <div className="h-full">
            <ProfileCard />
          </div>
        </div>
        
        {/* Основная область - 9 колонок из 12 */}
        <div className="md:col-span-9 xl:col-span-10 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 h-full">
            {/* Верхний ряд */}
            <div className="h-full min-h-[400px] lg:min-h-[500px]">
              <CalendarCard />
            </div>
            
            <div className="h-full min-h-[400px] lg:min-h-[500px]">
              <PlaceholderCard />
            </div>
            
            {/* Нижний ряд */}
            <div className="h-full min-h-[400px] lg:min-h-[500px]">
              <NotebookCard />
            </div>
            
            <div className="h-full min-h-[400px] lg:min-h-[500px]">
              <CommunityCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;