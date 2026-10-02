import React, { useState, useEffect } from 'react';
import type { BusinessInput, RabbitState } from '../../types';
import { RabbitCanvas } from '../rabbit/RabbitCanvas';
import { Sparkles } from 'lucide-react';

interface Props {
  input: BusinessInput;
  onComplete: () => void;
}

const STEPS = [
  { text: 'Understanding your business concept and goals...', state: 'thinking' as RabbitState, progress: 15 },
  { text: 'Scanning local market demand and industry growth signals...', state: 'researching' as RabbitState, progress: 30 },
  { text: 'Analyzing competitors in target location...', state: 'detective' as RabbitState, progress: 45 },
  { text: 'Evaluating budget against estimated startup & operating costs...', state: 'calculating' as RabbitState, progress: 65 },
  { text: 'Forecasting revenue trajectory and monthly burn rate...', state: 'analyzing' as RabbitState, progress: 80 },
  { text: 'Calculating profit potential, net margin %, and break-even month...', state: 'explaining' as RabbitState, progress: 95 },
  { text: 'Validation Complete! Compiling your executive business plan...', state: 'celebrating' as RabbitState, progress: 100 }
];

export const ValidationAnimationModal: React.FC<Props> = ({ input, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    if (currentStepIdx < STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIdx((prev) => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(finishTimer);
    }
  }, [currentStepIdx, onComplete]);

  const step = STEPS[currentStepIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-gray-200 shadow-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          MillenniumIQ AI Validation Engine
        </div>

        {/* Rabbit Canvas Character */}
        <div className="flex justify-center my-2">
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 shadow-inner">
            <RabbitCanvas
              state={step.state}
              isSpeaking={true}
              width={220}
              height={220}
            />
          </div>
        </div>

        {/* Status Copy */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-gray-900 leading-snug">
            {step.text}
          </h3>
          <p className="text-xs text-gray-500">
            Analyzing: <strong className="text-gray-800">{input.businessName}</strong> ({input.location})
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${step.progress}%` }} 
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-gray-400">
            <span>Step {currentStepIdx + 1} of {STEPS.length}</span>
            <span>{step.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
