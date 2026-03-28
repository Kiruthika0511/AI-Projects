"use client";

import React, { useState } from 'react';
import WizardTabs from '@/components/wizard/WizardTabs';
import Step1Setup from '@/components/wizard/Step1Setup';
import Step2Fetch from '@/components/wizard/Step2Fetch';
import Step3Review from '@/components/wizard/Step3Review';
import Step4Plan from '@/components/wizard/Step4Plan';

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="p-8 max-w-5xl mx-auto w-full print:p-0 print:m-0 print:max-w-none">
      <div className="mb-10 print:hidden">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Intelligent Test Planning
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Leverage AI to generate comprehensive test plans from your Jira requirements.
        </p>
      </div>
      
      <div className="print:hidden">
        <WizardTabs currentStep={currentStep} onStepClick={setCurrentStep} />
      </div>
      
      <div className="mt-8 transition-opacity duration-300 print:mt-0">
        {currentStep === 1 && <Step1Setup onComplete={nextStep} />}
        {currentStep === 2 && <Step2Fetch onComplete={nextStep} onBack={prevStep} />}
        {currentStep === 3 && <Step3Review onComplete={nextStep} onBack={prevStep} />}
        {currentStep === 4 && <Step4Plan onBack={prevStep} />}
      </div>
    </div>
  );
}
