
import React from 'react';
import { cn } from '@/lib/utils';

interface InstructionStepProps {
  number: number;
  title: string;
  description: string;
  className?: string;
  animationDelay?: string;
}

const InstructionStep: React.FC<InstructionStepProps> = ({
  number,
  title,
  description,
  className,
  animationDelay = ""
}) => {
  return (
    <div className={cn(
      "flex gap-4 p-6 neo-card animate-slide-up", 
      className,
      animationDelay
    )}>
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
        {number}
      </div>
      <div className="space-y-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default InstructionStep;
