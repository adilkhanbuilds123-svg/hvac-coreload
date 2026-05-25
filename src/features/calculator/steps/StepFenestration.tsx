'use client';

import { useShallow } from 'zustand/react/shallow';
import { useHVACStore } from '@/store/useHVACStore';
import { StepHeader } from '@/components/ui/StepHeader';
import { EngineeringSlider } from '@/features/calculator/EngineeringSlider';
import { Select } from '@/components/ui/Select';
import { AnimatedValue } from '@/components/ui/AnimatedValue';

export function StepFenestration() {
  const { windowType, windowAreaNorth, windowAreaSouth, windowAreaEast, windowAreaWest } = useHVACStore(
    useShallow((s) => ({
      windowType: s.inputs.windowType,
      windowAreaNorth: s.inputs.windowAreaNorth,
      windowAreaSouth: s.inputs.windowAreaSouth,
      windowAreaEast: s.inputs.windowAreaEast,
      windowAreaWest: s.inputs.windowAreaWest,
    }))
  );
  const updateInput = useHVACStore((s) => s.updateInput);

  const totalWindowArea = windowAreaNorth + windowAreaSouth + windowAreaEast + windowAreaWest;

  return (
    <div className="space-y-6">
      <StepHeader title="Fenestration" description="Configure window areas by orientation." />
      
      <div className="w-full sm:w-1/2">
        <Select
          label="Glazing Type"
          value={windowType}
          options={[
            { value: 'single', label: 'Single Pane' },
            { value: 'double', label: 'Double Pane' },
            { value: 'triple', label: 'Triple Pane' },
          ]}
          onChange={(e) => updateInput('windowType', e.target.value as typeof windowType)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        <EngineeringSlider
          label="North"
          value={windowAreaNorth}
          min={0}
          max={200}
          onChange={(v) => updateInput('windowAreaNorth', v)}
          unit="sqft"
        />
        <EngineeringSlider
          label="South"
          value={windowAreaSouth}
          min={0}
          max={200}
          onChange={(v) => updateInput('windowAreaSouth', v)}
          unit="sqft"
        />
        <EngineeringSlider
          label="East"
          value={windowAreaEast}
          min={0}
          max={200}
          onChange={(v) => updateInput('windowAreaEast', v)}
          unit="sqft"
        />
        <EngineeringSlider
          label="West"
          value={windowAreaWest}
          min={0}
          max={200}
          onChange={(v) => updateInput('windowAreaWest', v)}
          unit="sqft"
        />
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Total Glass Area</span>
        <span className="font-mono text-sm text-zinc-300">
          <AnimatedValue value={totalWindowArea} format={(v) => `${v.toLocaleString()} sqft`} />
        </span>
      </div>
    </div>
  );
}
