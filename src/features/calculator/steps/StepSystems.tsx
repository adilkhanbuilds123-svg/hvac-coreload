'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useHVACStore } from '@/store/useHVACStore';
import { StepHeader } from '@/components/ui/StepHeader';
import { EngineeringSlider } from '@/features/calculator/EngineeringSlider';
import { Select } from '@/components/ui/Select';
import { AnimatedValue } from '@/components/ui/AnimatedValue';
import { calculateTotalLoad } from '@/lib/hvac-math';

const PDFDownloadButton = dynamic(
  () => import('@/components/reports/PDFDownloadButton').then((m) => m.PDFDownloadButton),
  { ssr: false, loading: () => <div className="h-11 w-full bg-zinc-900 animate-pulse border border-zinc-800 rounded" /> }
);

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="font-mono text-zinc-500">{label}</span>
      <span className="font-mono text-zinc-400">{value}</span>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: 'cyan' | 'orange';
}) {
  const textColor = accent
    ? accent === 'cyan'
      ? 'text-cyan-cooling font-medium'
      : 'text-orange-heating font-medium'
    : 'text-zinc-400';

  return (
    <div
      className={`flex justify-between text-[11px] border-b border-zinc-800/30 pb-0.5 ${accent ? 'pt-1 border-t border-zinc-700/50' : ''}`}
    >
      <span className="font-mono text-zinc-500">{label}</span>
      <span className={`font-mono ${textColor}`}>
        <AnimatedValue value={value} format={(v) => `${v.toLocaleString()}`} />
      </span>
    </div>
  );
}

export function StepSystems() {
  const inputs = useHVACStore((s) => s.inputs);
  const updateInput = useHVACStore((s) => s.updateInput);

  const results = React.useMemo(() => {
    return calculateTotalLoad({ ...inputs });
  }, [inputs]);

  return (
    <div className="space-y-6">
      <StepHeader title="Internal Loads & Results" description="Occupancy, appliances, and the full component breakdown." />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <EngineeringSlider
          label="Occupants"
          value={inputs.occupants}
          min={0}
          max={20}
          onChange={(v) => updateInput('occupants', v)}
        />
        <Select
          label="Appliance Load"
          value={inputs.applianceLoad}
          options={[
            { value: 'standard', label: 'Standard (1,200 BTU)' },
            { value: 'heavy', label: 'Heavy (2,400 BTU)' },
          ]}
          onChange={(e) => updateInput('applianceLoad', e.target.value as typeof inputs.applianceLoad)}
        />
      </div>

      {/* Quick Stats */}
      <div className="space-y-2 border-t border-zinc-800/50 pt-4">
        <QuickStat label="Wall Area" value={`${results.wallArea.toLocaleString()} sqft`} />
        <QuickStat label="Volume" value={`${results.volume.toLocaleString()} cuft`} />
        <QuickStat label="Floor Area" value={`${(inputs.buildingLength * inputs.buildingWidth).toLocaleString()} sqft`} />
      </div>

      {/* Component Breakdown */}
      <div className="border-t border-zinc-800/50 pt-4 space-y-4">
        <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Component Breakdown</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-0">
          {/* Heating */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono text-orange-heating uppercase mb-2">Heating Losses</h4>
            <BreakdownRow label="Wall" value={results.wallHeatLoss} />
            <BreakdownRow label="Roof" value={results.roofHeatLoss} />
            <BreakdownRow label="Window" value={results.windowHeatLoss} />
            <BreakdownRow label="Floor" value={results.floorLoss} />
            <BreakdownRow label="Infiltration" value={results.infiltrationHeating} />
            <BreakdownRow label="Duct Loss" value={results.ductLossHeating} />
            <BreakdownRow label="Total" value={results.heatingBTU} accent="orange" />
          </div>
          {/* Cooling */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono text-cyan-cooling uppercase mb-2">Cooling Gains</h4>
            <BreakdownRow label="Wall" value={results.wallHeatGain} />
            <BreakdownRow label="Roof" value={results.roofHeatGain} />
            <BreakdownRow label="Window" value={results.windowHeatGain} />
            <BreakdownRow label="Floor" value={results.floorGain} />
            <BreakdownRow label="Infil. Sens." value={results.infiltrationCoolingSensible} />
            <BreakdownRow label="Infil. Latent" value={results.infiltrationCoolingLatent} />
            <BreakdownRow label="Int. Sens." value={results.internalSensible} />
            <BreakdownRow label="Int. Latent" value={results.internalLatent} />
            <BreakdownRow label="Total" value={results.coolingBTU} accent="cyan" />
          </div>
        </div>
      </div>

      {/* PDF Export */}
      <div className="border-t border-zinc-800/50 pt-6">
        <p className="text-xs text-zinc-500 mb-3">Generate a permit-ready engineering report.</p>
        <PDFDownloadButton />
      </div>
    </div>
  );
}
