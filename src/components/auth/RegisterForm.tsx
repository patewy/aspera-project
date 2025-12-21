import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "../../api/apiClient";

interface RegisterFormProps {
  onNavigate: (page: "login" | "forgot") => void;
}

export const RegisterForm = ({ onNavigate }: RegisterFormProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; confirmPassword?: string }>({});
  
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    setMessage(null);
    const newErrors: { username?: string; email?: string; password?: string; confirmPassword?: string } = {};

    if (!username) {
      newErrors.username = "Логин обязателен";
    } else if (username.length < 3) {
      newErrors.username = "Логин должен содержать минимум 3 символа";
    }

    if (!email) {
      newErrors.email = "Email обязателен";
    } else if (!validateEmail(email)) {
      newErrors.email = "Неверный формат email";
    }

    if (!password) {
      newErrors.password = "Пароль обязателен";
    } else if (password.length < 8) {
      newErrors.password = "Пароль должен содержать минимум 8 символов";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Подтвердите пароль";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true); 

      try {
        const response = await api.post("/auth/register", {
          username, 
          email, 
          password 
        });

        setMessage({ text: response.data.message, type: 'success' });
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Ошибка соединения с сервером.";
        setMessage({ text: errorMessage, type: 'error' });
      } finally {
        setIsLoading(false); 
      }
    }
  };

  return (
    <div className="flex flex-col justify-between h-full p-12 relative">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h2 className="text-4xl font-bold mb-8 text-[hsl(var(--notebook-text))]">Регистрация</h2>

        {/* 🔧 ДОБАВЛЕН noValidate чтобы отключить дефолтную валидацию браузера */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">
            {/* Инпут для username */}
            <div>
              <Label htmlFor="username" className="text-base">Логин</Label>
              <Input
                id="username"
                type="text"
                placeholder="yourlogin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`mt-2 ${errors.username ? "border-destructive" : ""}`}
              />
              {errors.username && (
                <p className="text-sm text-destructive mt-1">{errors.username}</p>
              )}
            </div>
            
            {/* Инпут для email */}
            <div>
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-2 ${errors.email ? "border-destructive" : ""}`}
                // 🔧 ДОПОЛНИТЕЛЬНО: можно добавить pattern чтобы браузер не показывал свое сообщение
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                title="Введите корректный email адрес"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>
            
            {/* Инпут для password */}
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
            
            {/* Инпут для confirmPassword */}
            <div>
              <Label htmlFor="confirmPassword" className="text-base">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`mt-2 ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full text-lg py-6"
              disabled={isLoading}
            >
              {isLoading ? "Обработка..." : "Зарегистрироваться"}
            </Button>
          </div>
        </form>

        {/* Отображение сообщения */}
        {message && (
          <p className={`mt-4 text-center text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
      </div>

      <div className="flex justify-start items-center pt-4 text-sm">
        <button
          onClick={() => onNavigate("login")}
          className="text-[hsl(var(--notebook-text-muted))] hover:text-[hsl(var(--notebook-text))] transition-colors"
        >
          Назад ко входу
        </button>
      </div>
    </div>
  );
};