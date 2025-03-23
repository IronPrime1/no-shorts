
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Settings, Home, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="w-full sticky top-0 z-50 glass-morphism py-4 px-6 backdrop-blur-lg animate-fade-in">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isHomePage && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2 animate-slide-up"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className={cn(
            "text-xl font-medium tracking-tight transition-all duration-300",
            isHomePage ? "animate-slide-down" : "animate-slide-up animation-delay-75"
          )}>
            {isHomePage ? 'No Shorts Zone' : 'Settings'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {isHomePage ? (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/settings')}
              className="animate-fade-in animation-delay-300"
            >
              <Settings className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="animate-fade-in animation-delay-300"
            >
              <Home className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
