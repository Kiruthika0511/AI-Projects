import React from 'react';

interface WizardTabsProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function WizardTabs({ currentStep, onStepClick }: WizardTabsProps) {
  const steps = [
    { id: 1, name: '1. Setup' },
    { id: 2, name: '2. Fetch Requirements' },
    { id: 3, name: '3. Review' },
    { id: 4, name: '4. Test Plan' }
  ];

  return (
    <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 mb-8 overflow-hidden border border-slate-200 dark:border-slate-700">
      {steps.map((step) => {
        const isActive = currentStep === step.id;
        const isPast = currentStep > step.id;
        
        return (
          <div 
            key={step.id}
            onClick={() => onStepClick && onStepClick(step.id)}
            className={`flex-1 text-center py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-300 ${onStepClick ? 'cursor-pointer' : ''} ${
              isActive 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {step.name}
          </div>
        );
      })}
    </div>
  );
}
