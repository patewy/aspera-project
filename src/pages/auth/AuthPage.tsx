import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookPage } from "@/components/auth/BookPage";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { LeftPageContent } from "@/components/auth/LeftPageContent";
import { LightRays } from "@/components/auth/LightRays";

type PageType = "login" | "register" | "forgot";

const AuthPage = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("login");
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"left" | "right">("right");
  const navigate = useNavigate();

  const handleNavigate = (page: PageType) => {
    if (page === currentPage || isFlipping) return;
    
    setFlipDirection(page === "login" ? "left" : "right");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsFlipping(false);
    }, 400);
  };

  const handleLoginSuccess = () => {
    navigate("/dashboard", { replace: true }); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/40 to-muted/60 p-8 relative overflow-hidden">
      <LightRays />
      <div className="relative w-full max-w-7xl h-[700px] z-10" style={{ perspective: "3000px" }}>
        <div className={`relative flex w-full h-full transition-all duration-700 ease-in-out ${
          isFlipping ? "scale-95 opacity-80" : "scale-100 opacity-100"
        }`} style={{
          filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.3)) drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
          transform: isFlipping 
            ? flipDirection === "right" ? 'rotateY(5deg)' : 'rotateY(-5deg)'
            : 'rotateY(0deg)',
        }}>
          <BookPage side="left" isDark={currentPage === "login"}>
            <LeftPageContent page={currentPage} />
          </BookPage>
          <div className="w-[3px] bg-gradient-to-b from-muted/50 via-muted to-muted/50 shadow-2xl z-20" />
          <BookPage side="right">
            {currentPage === "login" && (
              <LoginForm onNavigate={handleNavigate} onSuccess={handleLoginSuccess} />
            )}
            {currentPage === "register" && (
              <RegisterForm onNavigate={handleNavigate} />
            )}
            {currentPage === "forgot" && (
              <ForgotPasswordForm onNavigate={handleNavigate} />
            )}
          </BookPage>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;