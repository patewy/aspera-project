import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordFormProps {
  onNavigate: (page: "login" | "register") => void;
}

export const ForgotPasswordForm = ({ onNavigate }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = "Email обязателен";
    } else if (!validateEmail(email)) {
      newErrors.email = "Неверный формат email";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Forgot password:", { email });
      setIsSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full p-12 relative">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h2 className="text-4xl font-bold mb-4 text-[hsl(var(--notebook-text))]">Восстановление</h2>
        <p className="text-[hsl(var(--notebook-text-muted))] mb-8 text-base">
          Введите email для восстановления пароля
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-2 ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full text-lg py-6"
              disabled={isSubmitted}
            >
              {isSubmitted ? "Отправлено" : "Отправить инструкции"}
            </Button>

            {isSubmitted && (
              <p className="text-green-600 text-center text-sm">
                Инструкции отправлены на ваш email
              </p>
            )}
          </div>
        </form>
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
