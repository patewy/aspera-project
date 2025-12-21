import { Link } from "react-router-dom";

const AuthNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Страница не найдена</p>
        <Link to="/auth" className="text-primary hover:underline">
          Вернуться к авторизации
        </Link>
      </div>
    </div>
  );
};

export default AuthNotFound;