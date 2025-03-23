
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronRight, Youtube, XSquare } from 'lucide-react';
import Header from '@/components/Header';
import StatusCard from '@/components/StatusCard';
import FeatureToggle from '@/components/FeatureToggle';
import { loadSettings, saveSettings } from '@/lib/settings';

const Index = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isAutoStart, setIsAutoStart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings
    const loadStoredSettings = async () => {
      const settings = await loadSettings();
      setIsActive(settings.isActive);
      setIsAutoStart(settings.isAutoStart);
      setIsLoading(false);
    };
    
    loadStoredSettings();
  }, []);

  const handleToggleBlocking = async (value: boolean) => {
    setIsActive(value);
    await saveSettings({ isActive: value, isAutoStart });
    
    if (value) {
      toast.success("YouTube Shorts blocking activated", {
        description: "Shorts will now be hidden from your feed"
      });
    } else {
      toast.info("YouTube Shorts blocking deactivated", {
        description: "Shorts will now be visible in your feed"
      });
    }
  };

  const handleToggleAutoStart = async (value: boolean) => {
    setIsAutoStart(value);
    await saveSettings({ isActive, isAutoStart: value });
    
    if (value) {
      toast.success("Auto-start enabled", {
        description: "Blocking will start automatically when YouTube opens"
      });
    } else {
      toast.info("Auto-start disabled", {
        description: "You'll need to manually start blocking"
      });
    }
  };

  const handleLaunchYouTube = () => {
    // This function would normally launch YouTube via Intent
    // For demo purposes, we'll just show a toast
    toast.info("Opening YouTube", {
      description: "Launching YouTube with Shorts blocking active"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-soft">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <div className="space-y-8">
          <StatusCard isActive={isActive} className="animation-delay-150" />
          
          <div className="space-y-4">
            <FeatureToggle 
              title="Block YouTube Shorts" 
              description="Hide all Shorts content from your YouTube feed"
              isEnabled={isActive}
              onToggleChange={handleToggleBlocking}
              animationDelay="animation-delay-300"
            />
            
            <FeatureToggle 
              title="Auto-start when YouTube opens" 
              description="Automatically enable blocking when YouTube app launches"
              isEnabled={isAutoStart}
              onToggleChange={handleToggleAutoStart}
              animationDelay="animation-delay-500"
            />
          </div>
          
          <div className="space-y-4 animate-slide-up animation-delay-700">
            <Button 
              variant="outline" 
              className="w-full justify-between group" 
              onClick={() => navigate('/how-it-works')}
            >
              How It Works
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              className="w-full justify-between gap-2 bg-red-600 hover:bg-red-700"
              onClick={handleLaunchYouTube}
            >
              <Youtube className="h-4 w-4" />
              Open YouTube with Blocking
              <span className="flex-1" />
              <XSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
