import { Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom"; // ← Правильный импорт для Vite/React

const ProfileCard = () => {
  const navigate = useNavigate(); // ← хук для навигации

  const handleLogout = () => {
    // Очищаем JWT-токен
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // если есть
    localStorage.clear(); 

    // Перенаправляем на страницу входа
    navigate("/auth"); // ← замени на свой путь: /auth, /signin, /entry и т.д.
  };

  return (
    <div className="h-full bg-card border border-border rounded-[0.75rem] p-4 flex flex-col animate-fade-in">
      {/* Top: Avatar and header */}
      <div className="flex-shrink-0">
        <div className="relative rounded-xl overflow-hidden diagonal-stripes bg-muted/30 h-32">
          <div className="absolute bottom-4 left-4">
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center ring-2 ring-accent-green ring-offset-2 ring-offset-card">
              <User className="w-8 h-8 text-accent-green" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Middle: Empty space */}
      <div className="flex-1" />
      
      {/* Bottom: Buttons */}
      <div className="flex-shrink-0 flex flex-col gap-2">
        {/* Кнопка настроек */}
        <Button 
          variant="secondary" 
          className="w-full justify-start gap-3 rounded-full bg-secondary hover:bg-accent"
        >
          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
          <span className="text-foreground">settings</span>
        </Button>

        {/* Кнопка выхода */}
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Выход</span>
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;