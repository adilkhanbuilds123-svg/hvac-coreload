'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepNavigationProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepNavigation({ steps, currentStep, onStepClick }: StepNavigationProps) {
  return (
    <nav className="w-full mb-8">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {steps.map((label, i) => {
          const isActive = i === currentStep;
          const isCompleted = i < currentStep;

          return (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => onStepClick(i)}
                className={`
                  flex items-center gap-2 px-1 py-1 transition-colors duration-200
                  ${isActive
                    ? 'text-zinc-100 font-semibold'
                    : isCompleted
                      ? 'text-zinc-400 hover:text-zinc-300'
                      : 'text-zinc-600 hover:text-zinc-500'
                  }
                `}
              >
                <span className="text-xs">{i + 1}.</span>
                <span>{label}</span>
              </button>
              
              {/* Separator */}
              {i < steps.length - 1 && (
                <span className="text-zinc-700 font-light select-none">/</span>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
