import { Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ProfileCard = () => {
  const navigate = useNavigate();
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  const handleLogout = () => {
    console.log("Выход...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear();
    
    // Это заставит React переинициализироваться и useAuth увидит, что токена нет
    window.location.replace("/auth"); 
  };
  const goToProfile = () => {
    navigate("/profile"); // или "/my-profile", "/account" и т.д.
  };

  return (
    <div className="h-full bg-card border border-border rounded-[0.75rem] p-4 flex flex-col animate-fade-in">
      {/* Top: Avatar and header */}
      <div className="flex-shrink-0">
        <div className="relative rounded-xl overflow-hidden diagonal-stripes bg-muted/30 h-32">
          {/* Кликабельная иконка профиля */}
          <div className="absolute bottom-4 left-4">
            <button
              onClick={goToProfile}
              onMouseEnter={() => setIsAvatarHovered(true)}
              onMouseLeave={() => setIsAvatarHovered(false)}
              className="w-16 h-16 rounded-full bg-card flex items-center justify-center ring-2 ring-offset-2 ring-offset-card transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50"
              style={{
                border: isAvatarHovered ? '2px solid var(--primary)' : '2px solid var(--accent-green)',
              }}
              aria-label="Перейти в профиль"
            >
              <User 
                className={`w-8 h-8 transition-all duration-300 ${
                  isAvatarHovered ? 'text-primary scale-110' : 'text-accent-green'
                }`}
              />
              
              {/* Индикатор при наведении */}
              {isAvatarHovered && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Middle: Empty space */}
      <div className="flex-1" />
      
      {/* Bottom: Buttons */}
      <div className="flex-shrink-0 flex flex-col gap-2">
        <Button 
          variant="secondary" 
          className="w-full justify-start gap-3 rounded-full bg-secondary hover:bg-accent"
          onClick={() => navigate("/settings")} // можно сделать и кнопку настроек кликабельной
        >
          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
          <span className="text-foreground">settings</span>
        </Button>

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