'use client';

import { useShallow } from 'zustand/react/shallow';
import { useHVACStore } from '@/store/useHVACStore';
import { StepHeader } from '@/components/ui/StepHeader';
import { CitySearch } from '@/features/climate/CitySearch';
import { EngineeringSlider } from '@/features/calculator/EngineeringSlider';

export function StepClimate() {
  const { winterDesign, summerDesign, heatingSetpoint, coolingSetpoint, latentGrains, elevation } = useHVACStore(
    useShallow((s) => ({
      winterDesign: s.inputs.winterDesign,
      summerDesign: s.inputs.summerDesign,
      heatingSetpoint: s.inputs.heatingSetpoint,
      coolingSetpoint: s.inputs.coolingSetpoint,
      latentGrains: s.inputs.latentGrains,
      elevation: s.inputs.elevation,
    }))
  );
  const updateInput = useHVACStore((s) => s.updateInput);

  return (
    <div className="space-y-6">
      <StepHeader title="Climate & Location" description="Set your design conditions and location to establish baseline temperatures." />
      <CitySearch />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        <EngineeringSlider
          label="Winter Design"
          value={winterDesign}
          min={-40}
          max={70}
          onChange={(v) => updateInput('winterDesign', v)}
          unit="°F"
        />
        <EngineeringSlider
          label="Summer Design"
          value={summerDesign}
          min={60}
          max={120}
          onChange={(v) => updateInput('summerDesign', v)}
          unit="°F"
        />
        <EngineeringSlider
          label="Heating Setpoint"
          value={heatingSetpoint}
          min={55}
          max={80}
          onChange={(v) => updateInput('heatingSetpoint', v)}
          unit="°F"
        />
        <EngineeringSlider
          label="Cooling Setpoint"
          value={coolingSetpoint}
          min={65}
          max={85}
          onChange={(v) => updateInput('coolingSetpoint', v)}
          unit="°F"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        <EngineeringSlider
          label="Latent Grains"
          value={latentGrains}
          min={0}
          max={200}
          onChange={(v) => updateInput('latentGrains', v)}
          unit="gr"
        />
        <EngineeringSlider
          label="Elevation"
          value={elevation}
          min={0}
          max={12000}
          step={100}
          onChange={(v) => updateInput('elevation', v)}
          unit="ft"
        />
      </div>
    </div>
  );
}
