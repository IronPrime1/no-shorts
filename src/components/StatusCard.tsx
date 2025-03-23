
import React from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  isActive: boolean;
  className?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ isActive, className }) => {
  return (
    <div className={cn(
      "p-8 neo-card animate-slide-up text-center",
      isActive ? "border-2 border-green-500/20" : "border border-red-500/20",
      className
    )}>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center animate-float",
          isActive ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : 
                    "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        )}>
          {isActive ? (
            <ShieldCheck className="w-10 h-10" />
          ) : (
            <ShieldAlert className="w-10 h-10" />
          )}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-medium">{isActive ? 'Active' : 'Inactive'}</h2>
          <p className="text-muted-foreground">
            {isActive 
              ? 'Currently blocking YouTube Shorts' 
              : 'YouTube Shorts are currently visible'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
