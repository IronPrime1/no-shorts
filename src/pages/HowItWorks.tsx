
import React from 'react';
import Header from '@/components/Header';
import InstructionStep from '@/components/InstructionStep';
import { Shield, Settings, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <div className="space-y-8">
          <div className="text-center space-y-2 animate-slide-down">
            <h1 className="text-2xl font-medium">How It Works</h1>
            <p className="text-muted-foreground">
              Learn how No Shorts Zone keeps your YouTube feed clean
            </p>
          </div>
          
          <div className="space-y-4">
            <InstructionStep 
              number={1}
              title="Enable Accessibility Service"
              description="Allow No Shorts Zone to detect and modify YouTube's interface"
              animationDelay="animation-delay-150"
            />
            
            <InstructionStep 
              number={2}
              title="Set Your Preferences"
              description="Choose blocking options and performance settings"
              animationDelay="animation-delay-300"
            />
            
            <InstructionStep 
              number={3}
              title="Launch YouTube"
              description="Open YouTube from our app or directly from your home screen"
              animationDelay="animation-delay-500"
            />
            
            <InstructionStep 
              number={4}
              title="Enjoy Shorts-Free Experience"
              description="The app will automatically detect and block Shorts content"
              animationDelay="animation-delay-700"
            />
          </div>
          
          <div className="neo-card p-6 animate-slide-up animation-delay-700">
            <div className="space-y-4">
              <h3 className="font-medium">How Blocking Works</h3>
              
              <p className="text-sm text-muted-foreground">
                No Shorts Zone uses Android's Accessibility Service to analyze YouTube's interface 
                and identify Shorts content. When detected, it overlays or hides these elements without
                interfering with normal video browsing.
              </p>
              
              <p className="text-sm text-muted-foreground">
                The service only runs when YouTube is open and uses minimal resources to ensure 
                smooth performance and battery efficiency.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center animate-fade-in animation-delay-700">
            <Button 
              variant="outline" 
              className="w-full max-w-xs"
              onClick={() => navigate('/settings')}
            >
              Configure Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
