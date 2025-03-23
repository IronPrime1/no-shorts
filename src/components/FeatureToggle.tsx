
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FeatureToggleProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggleChange: (enabled: boolean) => void;
  className?: string;
  animationDelay?: string;
  warningMessage?: string;
  successMessage?: string;
}

const FeatureToggle: React.FC<FeatureToggleProps> = ({ 
  title, 
  description, 
  isEnabled, 
  onToggleChange,
  className,
  animationDelay = "",
  warningMessage,
  successMessage
}) => {
  return (
    <div className={cn(
      "p-6 neo-card animate-slide-up flex flex-col gap-4", 
      className,
      animationDelay
    )}>
      <div className="flex items-center justify-between">
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
      
      {isEnabled && successMessage && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successMessage}</span>
        </div>
      )}
      
      {warningMessage && (
        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
          <AlertCircle className="h-4 w-4" />
          <span>{warningMessage}</span>
        </div>
      )}
    </div>
  );
};

export default FeatureToggle;
