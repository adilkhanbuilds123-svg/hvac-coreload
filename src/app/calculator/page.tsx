'use client';

import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useHVACStore } from '@/store/useHVACStore';

import { StepNavigation } from '@/components/ui/StepNavigation';
import { Button } from '@/components/ui/Button';
import { ResultsLedger } from '@/components/calculator/ResultsLedger';

import { StepClimate } from '@/features/calculator/steps/StepClimate';
import { StepEnvelope } from '@/features/calculator/steps/StepEnvelope';
import { StepFenestration } from '@/features/calculator/steps/StepFenestration';
import { StepSystems } from '@/features/calculator/steps/StepSystems';

const STEPS = ['Climate', 'Envelope', 'Fenestration', 'Systems'];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0,
  }),
};

export default function CalculatorPage() {
  const currentStep = useHVACStore((s) => s.inputs.currentStep);
  const setStep = useHVACStore((s) => s.setStep);
  const nextStep = useHVACStore((s) => s.nextStep);
  const prevStep = useHVACStore((s) => s.prevStep);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-12 pb-24">
      {/* ═══ Header ═══════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-2 border-b border-zinc-900 pb-8">
        <h1 className="font-display text-2xl font-semibold text-zinc-100">HVAC Load Calculator</h1>
        <p className="text-sm text-zinc-500">ACCA Manual J methodology</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
        {/* ── Left Column: Form (8 cols) ────────────────────────────── */}
        <div className="lg:col-span-8 flex flex-col min-h-screen lg:min-h-0">
          <StepNavigation steps={STEPS} currentStep={currentStep} onStepClick={setStep} />

          <div className="flex-1 mt-8">
            <AnimatePresence mode="wait" custom={currentStep}>
              <motion.div
                key={currentStep}
                custom={currentStep}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              >
                {currentStep === 0 && <StepClimate />}
                {currentStep === 1 && <StepEnvelope />}
                {currentStep === 2 && <StepFenestration />}
                {currentStep === 3 && <StepSystems />}
              </motion.div>
            </AnimatePresence>

            {/* ── Step Controls ─────────────────────────────────────── */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-zinc-900">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="gap-2 px-0"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                variant="primary"
                onClick={nextStep}
                disabled={currentStep === STEPS.length - 1}
                className="gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* ── Right Column: Ledger (4 cols) ─────────────────────────── */}
        <ResultsLedger />
      </div>
    </div>
  );
}
