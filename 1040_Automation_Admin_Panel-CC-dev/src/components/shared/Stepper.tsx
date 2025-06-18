import { cn } from '@/lib/utils';
import React from 'react';

interface StepperProps {
  steps: string[];
  step: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, step }) => (
  <div className="mb-6 flex items-center">
    {steps.map((label, idx) => (
      <div key={label} className="flex items-center">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full font-bold',
            idx === step
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-600',
            idx < step ? 'border-2 border-blue-600' : ''
          )}
        >
          {idx + 1}
        </div>
        {idx < steps.length - 1 && <div className="mx-1 h-1 w-8 bg-gray-300" />}
      </div>
    ))}
  </div>
);
