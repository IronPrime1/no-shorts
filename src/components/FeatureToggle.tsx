
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { cn } from '@/lib/utils';

interface FeatureToggleProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggleChange: (enabled: boolean) => void;
  className?: string;
  animationDelay?: string;
}

const FeatureToggle: React.FC<FeatureToggleProps> = ({ 
  title, 
  description, 
  isEnabled, 
  onToggleChange,
  className,
  animationDelay = ""
}) => {
  return (
    <div className={cn(
      "p-6 neo-card animate-slide-up flex items-center justify-between", 
      className,
      animationDelay
    )}>
      <div className="space-y-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch 
        checked={isEnabled} 
        onCheckedChange={onToggleChange} 
        className="data-[state=checked]:bg-primary" 
      />
    </div>
  );
};

export default FeatureToggle;
