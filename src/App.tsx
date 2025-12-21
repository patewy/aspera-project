// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Импорты для auth
import AuthLanding from "./pages/auth/AuthLanding";
import AuthPage from "./pages/auth/AuthPage";
import AuthNotFound from "./pages/auth/AuthNotFound";

// Импорты для community (если нужно оставить)
import CommunityPage from "./pages/community/CommunityPage";
import CommunityNotFound from "./pages/community/CommunityNotFound";

// Импорты для dashboard (ваш главный интерфейс)
import DashboardPage from "./pages/dashboard/DashboardPage"; // создайте этот файл
import DashboardNotFound from "./pages/dashboard/DashboardNotFound"; // или используйте существующий

import CalendarPage from "./pages/calendar/CalendarPage"; // создайте этот файл
import CalendardNotFound from "./pages/calendar/CalendarNotFound";
import FolderPage from "./pages/folder/MainPage";
import MainNotFound from "./pages/folder/MainNotFound";
import ProfilePage from "./pages/profile/ProfilePage";
import ProfileNotFound from "./pages/profile/ProfileNotFound";
const queryClient = new QueryClient();


// Компонент для защиты маршрутов
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

// Компонент для перенаправления авторизованных пользователей
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />; // Изменено на /dashboard
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* 🔐 Публичные маршруты (только для неавторизованных) */}
          <Route 
            path="/welcome" 
            element={
              <PublicRoute>
                <AuthLanding />
              </PublicRoute>
            } 
          />
          <Route 
            path="/auth" 
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            } 
          />
          
          {/* 🏠 Защищенные маршруты (только для авторизованных) */}
          
          {/* Dashboard - основной интерфейс после авторизации */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Community - если еще нужно оставить */}
          <Route 
            path="/community" 
            element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <CalendarPage/>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/folder" 
            element={
              <ProtectedRoute>
                <FolderPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 🔄 Реддиректы */}
          <Route path="/" element={<Navigate to="/welcome" />} />
          
          {/* ❌ 404 страницы для конкретных разделов */}
          <Route path="/auth/*" element={<AuthNotFound />} />
          <Route path="/community/*" element={<CommunityNotFound />} />
          <Route path="/dashboard/*" element={<DashboardNotFound />} />
          <Route path="/calendar/*" element={<CalendardNotFound />} />
          <Route path="/folder/*" element={<MainNotFound />} />
          <Route path="/profile/*" element={<ProfileNotFound />} />

          
          {/* Глобальный 404 */}
          <Route path="*" element={<DashboardNotFound />} />
        </Routes>
      </BrowserRouter>
      
      {/* 🔔 Уведомления */}
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;