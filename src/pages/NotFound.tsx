
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="max-w-md w-full neo-card p-8 text-center space-y-6 animate-slide-up">
        <h1 className="text-5xl font-bold mb-2">404</h1>
        <div className="w-16 h-1 bg-primary/20 mx-auto rounded-full"></div>
        <p className="text-xl text-muted-foreground">
          The page you're looking for doesn't exist
        </p>
        
        <Button 
          onClick={() => navigate('/')}
          className="mt-4 gap-2"
        >
          <Home className="h-4 w-4" />
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
