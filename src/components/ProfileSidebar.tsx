import { Settings, User, Bell, Shield, CreditCard, HelpCircle, FileText, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom"; // Добавляем импорт

const menuItems = [
  { icon: User, label: "Профиль" },
  { icon: Settings, label: "Настройки" },
  { icon: Bell, label: "Уведомления" },
  { icon: Shield, label: "Безопасность" },
  { icon: CreditCard, label: "Оплата" },
  { icon: HelpCircle, label: "Помощь" },
];

const ProfileSidebar = () => {
  const navigate = useNavigate(); // Создаём хук навигации

  // Функция для перехода на страницу dashboard
  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <aside className="flex flex-col w-64 bg-sidebar border border-border rounded-[0.75rem] p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <Home className="w-4 h-4 text-muted-foreground" />
        <span 
          className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          onClick={goToDashboard} // Добавляем обработчик клика
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              goToDashboard();
            }
          }}
          role="button"
          tabIndex={0}
        >
          Dashboard
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground">Профиль</span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200 ${
              index === 0 ? "bg-sidebar-accent text-sidebar-foreground" : ""
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Quick Actions Grid */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-secondary rounded-lg hover:bg-muted transition-colors cursor-pointer"
            />
          ))}
        </div>
        <div className="flex items-center justify-center py-2">
          <div className="text-muted-foreground text-xs">∧</div>
        </div>
      </div>

      {/* User Agreement Button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm">Польз. соглашение</span>
        </Button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;