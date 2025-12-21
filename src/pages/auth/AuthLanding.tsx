import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

const AuthLanding = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <Book className="w-20 h-20 mx-auto text-primary" strokeWidth={1.5} />
        <h1 className="text-5xl font-bold">Aspera</h1> 
        <p className="text-xl text-muted-foreground">Откройте новую страницу знаний</p>
        <Link to="/auth">
          <Button size="lg" className="mt-8">
            Войти в систему
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AuthLanding;