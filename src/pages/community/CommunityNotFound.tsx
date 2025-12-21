import { Link } from "react-router-dom";

const CommunityNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Страница сообщества не найдена</p>
        <Link to="/community" className="text-primary hover:underline">
          Вернуться в сообщество
        </Link>
      </div>
    </div>
  );
};

export default CommunityNotFound; // 👈 ИЗМЕНИТЕ ЭКСПОРТ