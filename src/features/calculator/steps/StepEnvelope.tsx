'use client';

import { useShallow } from 'zustand/react/shallow';
import { useHVACStore } from '@/store/useHVACStore';
import { StepHeader } from '@/components/ui/StepHeader';
import { EngineeringSlider } from '@/features/calculator/EngineeringSlider';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { motion, AnimatePresence } from 'framer-motion';

export function StepEnvelope() {
  const {
    buildingLength,
    buildingWidth,
    ceilingHeight,
    footprintShape,
    tightness,
    isVaulted,
    vaultedHeight,
    wallInsulation,
    roofInsulation,
    floorType,
    floorInsulation,
    ductLocation,
    ductInsulation,
  } = useHVACStore(
    useShallow((s) => ({
      buildingLength: s.inputs.buildingLength,
      buildingWidth: s.inputs.buildingWidth,
      ceilingHeight: s.inputs.ceilingHeight,
      footprintShape: s.inputs.footprintShape,
      tightness: s.inputs.tightness,
      isVaulted: s.inputs.isVaulted,
      vaultedHeight: s.inputs.vaultedHeight,
      wallInsulation: s.inputs.wallInsulation,
      roofInsulation: s.inputs.roofInsulation,
      floorType: s.inputs.floorType,
      floorInsulation: s.inputs.floorInsulation,
      ductLocation: s.inputs.ductLocation,
      ductInsulation: s.inputs.ductInsulation,
    }))
  );
  const updateInput = useHVACStore((s) => s.updateInput);

  return (
    <div className="space-y-6">
      <StepHeader title="Building Envelope" description="Define the physical structure — dimensions, insulation, and air tightness." />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        <EngineeringSlider
          label="Length"
          value={buildingLength}
          min={10}
          max={200}
          onChange={(v) => updateInput('buildingLength', v)}
          unit="ft"
        />
        <EngineeringSlider
          label="Width"
          value={buildingWidth}
          min={10}
          max={200}
          onChange={(v) => updateInput('buildingWidth', v)}
          unit="ft"
        />
        <EngineeringSlider
          label="Ceiling Height"
          value={ceilingHeight}
          min={7}
          max={20}
          onChange={(v) => updateInput('ceilingHeight', v)}
          unit="ft"
        />
        <div className="flex flex-col justify-end">
          <Select
            label="Shape"
            value={footprintShape}
            options={[
              { value: 'rectangle', label: 'Rectangle' },
              { value: 'l_shape', label: 'L-Shape' },
              { value: 'u_shape', label: 'U-Shape' },
              { value: 'complex', label: 'Complex' },
            ]}
            onChange={(e) => updateInput('footprintShape', e.target.value as typeof footprintShape)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <Select
          label="Tightness"
          value={tightness}
          options={[
            { value: 'tight', label: 'Tight (0.3 ACH)' },
            { value: 'average', label: 'Average (0.6 ACH)' },
            { value: 'leaky', label: 'Leaky (1.2 ACH)' },
          ]}
          onChange={(e) => updateInput('tightness', e.target.value as typeof tightness)}
        />

        <div className="flex flex-col justify-end pb-1 gap-2">
          <Checkbox
            id="vaulted"
            label="Vaulted Ceiling"
            checked={isVaulted}
            onChange={(e) => updateInput('isVaulted', e.target.checked)}
          />
          <AnimatePresence>
            {isVaulted && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="pl-6 border-l-2 border-zinc-800/50 py-1">
                  <EngineeringSlider
                    label="Vault Height"
                    value={vaultedHeight}
                    min={1}
                    max={15}
                    onChange={(v) => updateInput('vaultedHeight', v)}
                    unit="ft"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-zinc-900/30 rounded-lg p-5 border border-zinc-800/50 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/50 pb-3 mb-2">
          <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-cooling opacity-70"></span>
            Insulation Assembly
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <Select
            label="Wall R-Value"
            value={wallInsulation}
            options={['R-0', 'R-7', 'R-11', 'R-13', 'R-19', 'R-21', 'R-30', 'R-40'].map((r) => ({ value: r, label: r }))}
            onChange={(e) => updateInput('wallInsulation', e.target.value as typeof wallInsulation)}
          />
          <Select
            label="Roof R-Value"
            value={roofInsulation}
            options={['R-0', 'R-11', 'R-19', 'R-30', 'R-38', 'R-49', 'R-60'].map((r) => ({ value: r, label: r }))}
            onChange={(e) => updateInput('roofInsulation', e.target.value as typeof roofInsulation)}
          />
          <Select
            label="Floor Type"
            value={floorType}
            options={[
              { value: 'slab_on_grade', label: 'Slab on Grade' },
              { value: 'vented_crawlspace', label: 'Vented Crawlspace' },
              { value: 'conditioned_basement', label: 'Cond. Basement' },
            ]}
            onChange={(e) => updateInput('floorType', e.target.value as typeof floorType)}
          />
          <Select
            label="Floor Insulation"
            value={floorInsulation}
            options={[
              { value: 'uninsulated', label: 'Uninsulated' },
              { value: 'R-7', label: 'R-7' },
              { value: 'R-11', label: 'R-11' },
              { value: 'R-19', label: 'R-19' },
            ]}
            onChange={(e) => updateInput('floorInsulation', e.target.value as typeof floorInsulation)}
          />
          <Select
            label="Duct Location"
            value={ductLocation}
            options={[
              { value: 'conditioned', label: 'Conditioned' },
              { value: 'unconditioned_basement', label: 'Uncond. Basement' },
              { value: 'vented_attic', label: 'Vented Attic' },
            ]}
            onChange={(e) => updateInput('ductLocation', e.target.value as typeof ductLocation)}
          />
          <Select
            label="Duct Insulation"
            value={ductInsulation}
            options={[
              { value: 'none', label: 'None' },
              { value: 'R-4', label: 'R-4' },
              { value: 'R-6', label: 'R-6' },
              { value: 'R-8', label: 'R-8' },
            ]}
            onChange={(e) => updateInput('ductInsulation', e.target.value as typeof ductInsulation)}
          />
        </div>
      </div>
    </div>
  );
}
