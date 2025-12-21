import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "@/hooks/useAuth"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api/apiClient"; 

interface LoginFormProps {
  onNavigate: (page: "register" | "forgot") => void;
  onSuccess?: () => void;
}

export const LoginForm = ({ onNavigate, onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string }>({});
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const newErrors: { password?: string } = {};

    // Единственная проверка — только пароль
    if (!password) {
      newErrors.password = "Пароль обязателен";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('🟡 Начинаю отправку запроса на вход...');
      setIsLoading(true);

      try {
        console.log('🟡 Отправляю запрос к /auth/login...');
        const response = await api.post("/auth/login", { 
          username: email,  // email отправляется как username
          password 
        });

        console.log('✅ API Ответ получен:', response.data);
        
        if (response.data.token) {
          console.log('🎯 Токен получен (поле token):', response.data.token.substring(0, 20) + '...');
          
          // Сохраняем в localStorage
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("authToken", response.data.token);
          
          console.log('💾 Токен сохранен:', localStorage.getItem('authToken') ? 'Да' : 'Нет');
          
          // Обновляем хук авторизации
          login(response.data.token);
          
          // Сообщение об успехе
          setMessage({ text: "Вход успешен!", type: 'success' });
          
          // Редирект
          setTimeout(() => {
            if (onSuccess) {
              onSuccess();
            } else {
              navigate("/dashboard", { replace: true });
            }
          }, 300);
          
        } else {
          console.log('❌ Токен не найден в ответе API. Поля ответа:', Object.keys(response.data));
          setMessage({ text: "Ошибка сервера: нет токена", type: 'error' });
        }
        
      } catch (error: any) {
        console.log('❌ Ошибка API:', error);
        const errorMessage = error.response?.data?.message || "Неверный логин или пароль. Попробуйте снова.";
        setMessage({ text: errorMessage, type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Тестовый вход
  const handleTestLogin = () => {
    console.log("Тестовый вход с test@example.com");
    
    const testToken = "test_jwt_" + Date.now();
    const testUser = {
      email: "test@example.com",
      name: "Тестовый пользователь",
      token: testToken
    };
    
    localStorage.setItem("authToken", testToken);
    localStorage.setItem("user", JSON.stringify(testUser));
    
    login(testToken);
    
    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full p-12 relative">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h2 className="text-4xl font-bold mb-8 text-[hsl(var(--notebook-text))]">Вход</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-base">Email или логин</Label>
              <Input
                id="email"
                type="text"  
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-base">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-2 ${errors.password ? "border-destructive" : ""}`}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full text-lg py-6"
              disabled={isLoading}
            >
              {isLoading ? "Проверка..." : "Войти"}
            </Button>
          </div>
        </form>
        
        {/* Кнопка тестового входа */}
        <div className="mt-6 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleTestLogin}
            className="w-full"
          >
            🔧 Тестовый вход (test@example.com)
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Используйте если API не работает
          </p>
        </div>
        
        {message && (
          <p className={`mt-4 text-center text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 text-sm">
        <button
          onClick={() => onNavigate("forgot")}
          className="text-[hsl(var(--notebook-text-muted))] hover:text-[hsl(var(--notebook-text))] transition-colors"
        >
          Забыли пароль?
        </button>
        <button
          onClick={() => onNavigate("register")}
          className="text-[hsl(var(--notebook-text-muted))] hover:text-[hsl(var(--notebook-text))] transition-colors"
        >
          Регистрация
        </button>
      </div>
    </div>
  );
};