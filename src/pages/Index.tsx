
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronRight, Youtube, XSquare } from 'lucide-react';
import Header from '@/components/Header';
import StatusCard from '@/components/StatusCard';
import FeatureToggle from '@/components/FeatureToggle';
import { loadSettings, saveSettings } from '@/lib/settings';
import { useNativeBridge } from '@/lib/native-bridge';

const Index = () => {
  const navigate = useNavigate();
  const nativeBridge = useNativeBridge();
  const [isActive, setIsActive] = useState(false);
  const [isAutoStart, setIsAutoStart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Load settings and check permission status
    const initialize = async () => {
      try {
        // Load saved settings
        const settings = await loadSettings();
        setIsActive(settings.isActive);
        setIsAutoStart(settings.isAutoStart);
        
        // Check if we have accessibility permission
        const permissionGranted = await nativeBridge.checkAccessibilityPermission();
        setHasPermission(permissionGranted);
        
        // If permission is granted and service should be active, start it
        if (permissionGranted && settings.isActive) {
          await nativeBridge.startBlockingService();
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Initialization error:', error);
        setIsLoading(false);
      }
    };
    
    initialize();
  }, [nativeBridge]);

  const handleToggleBlocking = async (value: boolean) => {
    try {
      // Check permission first
      if (value && !hasPermission) {
        toast.info("Permission required", {
          description: "Please grant accessibility permission to block Shorts"
        });
        
        const granted = await nativeBridge.requestAccessibilityPermission();
        if (!granted) {
          toast.error("Permission denied", {
            description: "Accessibility permission is required to block Shorts"
          });
          return;
        }
        setHasPermission(true);
      }
      
      // Toggle the service based on the new value
      if (value) {
        const success = await nativeBridge.startBlockingService();
        if (success) {
          setIsActive(true);
          await saveSettings({ isActive: true, isAutoStart });
          toast.success("YouTube Shorts blocking activated", {
            description: "Shorts will now be hidden from your feed"
          });
        } else {
          toast.error("Failed to start blocking service", {
            description: "Please try again or check app permissions"
          });
        }
      } else {
        const success = await nativeBridge.stopBlockingService();
        if (success) {
          setIsActive(false);
          await saveSettings({ isActive: false, isAutoStart });
          toast.info("YouTube Shorts blocking deactivated", {
            description: "Shorts will now be visible in your feed"
          });
        } else {
          toast.error("Failed to stop blocking service", {
            description: "Please try again"
          });
        }
      }
    } catch (error) {
      console.error('Error toggling blocking:', error);
      toast.error("An error occurred", {
        description: "Failed to toggle blocking service"
      });
    }
  };

  const handleToggleAutoStart = async (value: boolean) => {
    try {
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
    } catch (error) {
      console.error('Error toggling auto-start:', error);
      toast.error("An error occurred", {
        description: "Failed to update auto-start setting"
      });
    }
  };

  const handleLaunchYouTube = async () => {
    try {
      // If active but no permission, request it
      if (isActive && !hasPermission) {
        const granted = await nativeBridge.requestAccessibilityPermission();
        if (!granted) {
          toast.error("Permission denied", {
            description: "Accessibility permission is required to block Shorts"
          });
          return;
        }
        setHasPermission(true);
      }
      
      // If active and has permission, ensure service is running
      if (isActive && hasPermission) {
        await nativeBridge.startBlockingService();
      }
      
      // Open YouTube
      await nativeBridge.openYouTube();
      
      toast.info("Opening YouTube", {
        description: isActive ? "Launching YouTube with Shorts blocking active" : "Launching YouTube"
      });
    } catch (error) {
      console.error('Error launching YouTube:', error);
      toast.error("Failed to open YouTube", {
        description: "Please check if YouTube is installed"
      });
    }
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
              description={hasPermission ? "Hide all Shorts content from your YouTube feed" : "Requires accessibility permission"}
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
            
            {isActive && !hasPermission && (
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => nativeBridge.requestAccessibilityPermission()}
              >
                Grant Accessibility Permission
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
