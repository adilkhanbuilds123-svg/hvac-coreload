'use client';

import { useMemo } from 'react';
import { useHVACStore } from '@/store/useHVACStore';
import { calculateTotalLoad } from '@/lib/hvac-math';
import type { HVACInputs as MathInputs } from '@/lib/hvac-math';
import { MetricCard } from '@/components/ui/MetricCard';

export function ResultsLedger() {
  const inputs = useHVACStore((s) => s.inputs);

  const results = useMemo(() => {
    const mathInputs: MathInputs = { ...inputs };
    return calculateTotalLoad(mathInputs);
  }, [inputs]);

  return (
    <>
      <div className="lg:col-span-4 sticky top-24">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-600 mb-8 pb-4 border-b border-zinc-900/50">Load Ledger</h2>
        
        <div className="flex flex-col gap-6">
          <MetricCard
            label="System Tonnage"
            value={results.tonnage}
            unit="tons"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Heating"
              value={Math.round(results.heatingBTU / 1000)}
              unit="kBTU/h"
            />
            <MetricCard
              label="Cooling"
              value={Math.round(results.coolingBTU / 1000)}
              unit="kBTU/h"
            />
          </div>

          <div className="pt-6 border-t border-zinc-900">
            <MetricCard
              label="Sensible Heat Ratio"
              value={results.sensibleHeatRatio}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-zinc-900 p-4 pb-safe flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-0.5">Total Load</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-semibold text-2xl text-zinc-100 leading-none">{results.tonnage}</span>
            <span className="text-xs text-zinc-500 uppercase">Tons</span>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-zinc-400">
          <span>{Math.round(results.heatingBTU/1000)}k Heat</span>
          <span>{Math.round(results.coolingBTU/1000)}k Cool</span>
        </div>
      </div>
    </>
  );
}
