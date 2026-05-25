'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useHVACStore } from '@/store/useHVACStore';
import { useHVACStoreHydrated } from '@/hooks/useHVACStoreHydrated';
import { calculateTotalLoad } from '@/lib/hvac-math';
import type { HVACInputs as MathInputs } from '@/lib/hvac-math';
import { SkeletonLoaderHUD } from '@/components/ui/Skeletons';

const PDFDownloadButton = dynamic(
  () => import('@/components/reports/PDFDownloadButton').then((m) => m.PDFDownloadButton),
  { ssr: false, loading: () => <div className="h-10 w-full bg-zinc-950 border border-zinc-800" /> }
);

export default function ReportsPage() {
  const hydrated = useHVACStoreHydrated();
  const inputs = useHVACStore((s) => s.inputs);

  const results = useMemo(() => {
    const mathInputs: MathInputs = {
      winterDesign: inputs.winterDesign,
      summerDesign: inputs.summerDesign,
      elevation: inputs.elevation,
      heatingSetpoint: inputs.heatingSetpoint,
      coolingSetpoint: inputs.coolingSetpoint,
      latentGrains: inputs.latentGrains,
      buildingLength: inputs.buildingLength,
      buildingWidth: inputs.buildingWidth,
      ceilingHeight: inputs.ceilingHeight,
      isVaulted: inputs.isVaulted,
      vaultedHeight: inputs.vaultedHeight,
      wallInsulation: inputs.wallInsulation,
      roofInsulation: inputs.roofInsulation,
      floorType: inputs.floorType,
      floorInsulation: inputs.floorInsulation,
      windowAreaNorth: inputs.windowAreaNorth,
      windowAreaSouth: inputs.windowAreaSouth,
      windowAreaEast: inputs.windowAreaEast,
      windowAreaWest: inputs.windowAreaWest,
      windowType: inputs.windowType,
      tightness: inputs.tightness,
      occupants: inputs.occupants,
      applianceLoad: inputs.applianceLoad,
      ductLocation: inputs.ductLocation,
      ductInsulation: inputs.ductInsulation,
      footprintShape: inputs.footprintShape,
    };
    return calculateTotalLoad(mathInputs);
  }, [inputs]);

  if (!hydrated) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <SkeletonLoaderHUD type="panel" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-24">
      {/* Header */}
      <header className="border-b border-zinc-900 pb-8">
        <h1 className="font-display text-4xl font-bold text-zinc-100 tracking-tight mb-2">
          Engineering Report
        </h1>
        <p className="font-mono text-xs text-zinc-500 uppercase tracking-wide">
          {inputs.selectedCity
            ? `${inputs.selectedCity}, ${inputs.selectedState}`
            : 'Custom Location'}{' '}
          // {new Date().toLocaleDateString()}
        </p>
      </header>

      {/* Asymmetric Core Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-zinc-900 pb-16">
        <div className="md:col-span-8 flex flex-col justify-end">
          <span className="font-display text-7xl md:text-9xl font-bold text-zinc-100 tracking-tighter leading-none">
            {results.tonnage}
            <span className="text-3xl md:text-5xl text-zinc-700 ml-2">TONS</span>
          </span>
          <span className="font-mono text-sm text-zinc-500 mt-4 uppercase tracking-widest">Required Capacity</span>
        </div>
        
        <div className="md:col-span-4 flex flex-col justify-end gap-6">
          <div>
            <span className="block font-display text-3xl font-bold text-zinc-300">
              {results.coolingBTU.toLocaleString()}
            </span>
            <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest">Cooling BTU/hr</span>
          </div>
          <div>
            <span className="block font-display text-3xl font-bold text-zinc-300">
              {results.heatingBTU.toLocaleString()}
            </span>
            <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest">Heating BTU/hr</span>
          </div>
          <div>
            <span className="block font-display text-xl font-bold text-zinc-500">
              {results.sensibleHeatRatio}
            </span>
            <span className="font-mono text-xs text-zinc-700 uppercase tracking-widest">Sensible Heat Ratio</span>
          </div>
        </div>
      </section>

      {/* Building Specifications */}
      <section>
        <h2 className="font-display text-2xl font-bold text-zinc-100 mb-6">Building Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          <ReportRow label="Dimensions" value={`${inputs.buildingLength} × ${inputs.buildingWidth} × ${inputs.ceilingHeight} ft`} />
          <ReportRow label="Floor Area" value={`${(inputs.buildingLength * inputs.buildingWidth).toLocaleString()} sqft`} />
          <ReportRow label="Net Wall Area" value={`${results.wallArea.toLocaleString()} sqft`} />
          <ReportRow label="Volume" value={`${results.volume.toLocaleString()} cuft`} />
          <ReportRow label="Footprint Shape" value={inputs.footprintShape.replace('_', ' ')} />
          <ReportRow label="Wall Insulation" value={inputs.wallInsulation} />
          <ReportRow label="Roof Insulation" value={inputs.roofInsulation} />
          <ReportRow label="Floor Type" value={inputs.floorType.replace(/_/g, ' ')} />
          <ReportRow label="Window Type" value={`${inputs.windowType} pane`} />
          <ReportRow label="Total Window Area" value={`${inputs.windowAreaNorth + inputs.windowAreaSouth + inputs.windowAreaEast + inputs.windowAreaWest} sqft`} />
          <ReportRow label="Building Tightness" value={inputs.tightness} />
          <ReportRow label="Duct Location" value={inputs.ductLocation.replace(/_/g, ' ')} />
        </div>
      </section>

      {/* Design Conditions */}
      <section>
        <h2 className="font-display text-2xl font-bold text-zinc-100 mb-6">Design Conditions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          <ReportRow label="Winter Design Temp" value={`${inputs.winterDesign}°F`} highlight="heating" />
          <ReportRow label="Summer Design Temp" value={`${inputs.summerDesign}°F`} highlight="cooling" />
          <ReportRow label="Heating Setpoint" value={`${inputs.heatingSetpoint}°F`} />
          <ReportRow label="Cooling Setpoint" value={`${inputs.coolingSetpoint}°F`} />
          <ReportRow label="Elevation" value={`${inputs.elevation.toLocaleString()} ft`} />
          <ReportRow label="Latent Grains" value={`${inputs.latentGrains} gr`} />
        </div>
      </section>

      {/* Physics Modifiers & Telemetry */}
      <section className="bg-zinc-950 border border-zinc-900 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-2 bg-glow-accent animate-pulse" />
          <h2 className="font-mono text-lg font-bold text-zinc-100 uppercase tracking-widest">Physics Telemetry Log</h2>
        </div>
        <p className="font-mono text-xs text-zinc-500 uppercase mb-6 border-b border-zinc-900 pb-4">
          Audit of the real-time thermodynamic penalties applied to this specific calculation.
        </p>
        <div className="space-y-3 font-mono text-xs uppercase">
          
          <div className="flex items-baseline justify-between border-b border-zinc-900 pb-2">
            <span className="text-zinc-500">[Altitude_Density]</span>
            <span className="text-glow-accent font-bold">
              {Math.max(0.65, Math.pow(1 - (0.000006875 * inputs.elevation), 5.2559)).toFixed(2)}x Multiplier
            </span>
          </div>

          <div className="flex items-baseline justify-between border-b border-zinc-900 pb-2">
            <span className="text-zinc-500">[Geometry_Penalty]</span>
            <span className={inputs.footprintShape !== 'rectangle' || inputs.isVaulted ? 'text-orange-heating font-bold' : 'text-zinc-300'}>
              {inputs.footprintShape === 'l_shape' ? '+15% Base Perimeter' : 
               inputs.footprintShape === 'u_shape' ? '+25% Base Perimeter' : 
               inputs.footprintShape === 'complex' ? '+35% Base Perimeter' : '1.0x (Standard)'}
              {inputs.isVaulted ? ' | Vaulted Roof Volume Added' : ''}
            </span>
          </div>

          <div className="flex items-baseline justify-between border-b border-zinc-900 pb-2">
            <span className="text-zinc-500">[Solar_Insolation_Bias]</span>
            <span className={inputs.windowAreaWest > 0 ? 'text-orange-heating font-bold' : 'text-zinc-300'}>
              {inputs.windowAreaWest > 0 ? `Severe (1.8x West Bias on ${inputs.windowAreaWest}sqft)` : 
               inputs.windowAreaSouth > 0 ? `Moderate (1.4x South Bias)` : 'Optimal'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-zinc-500">[Duct_Thermal_Loss]</span>
            <span className={(results.ductLossHeating > 0 || results.ductLossCoolingSensible > 0) ? 'text-orange-heating font-bold' : 'text-cyan-cooling font-bold'}>
              {(results.ductLossHeating > 0 || results.ductLossCoolingSensible > 0) 
                ? `-${(results.ductLossHeating + results.ductLossCoolingSensible + results.ductLossCoolingLatent).toLocaleString()} BTU/hr waste` 
                : 'Zero (Conditioned)'}
            </span>
          </div>

        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Heating Breakdown */}
        <section>
          <h2 className="font-display text-xl font-bold text-zinc-100 mb-6 border-b border-zinc-900 pb-2">Heating Breakdown</h2>
          <div className="space-y-2">
            <ReportRow label="Wall Heat Loss" value={`${results.wallHeatLoss.toLocaleString()}`} />
            <ReportRow label="Roof Heat Loss" value={`${results.roofHeatLoss.toLocaleString()}`} />
            <ReportRow label="Window Heat Loss" value={`${results.windowHeatLoss.toLocaleString()}`} />
            <ReportRow label="Floor Heat Loss" value={`${results.floorLoss.toLocaleString()}`} />
            <ReportRow label="Infiltration" value={`${results.infiltrationHeating.toLocaleString()}`} />
            <ReportRow label="Duct Loss" value={`${results.ductLossHeating.toLocaleString()}`} />
            <div className="pt-4 mt-4 border-t border-zinc-900">
              <ReportRow label="Total Heating" value={`${results.heatingBTU.toLocaleString()} BTU/hr`} highlight="heating" />
            </div>
          </div>
        </section>

        {/* Cooling Breakdown */}
        <section>
          <h2 className="font-display text-xl font-bold text-zinc-100 mb-6 border-b border-zinc-900 pb-2">Cooling Breakdown</h2>
          <div className="space-y-2">
            <ReportRow label="Wall Heat Gain" value={`${results.wallHeatGain.toLocaleString()}`} />
            <ReportRow label="Roof Heat Gain" value={`${results.roofHeatGain.toLocaleString()}`} />
            <ReportRow label="Window Gain (Solar)" value={`${results.windowHeatGain.toLocaleString()}`} />
            <ReportRow label="Floor Heat Gain" value={`${results.floorGain.toLocaleString()}`} />
            <ReportRow label="Infiltration (Sens)" value={`${results.infiltrationCoolingSensible.toLocaleString()}`} />
            <ReportRow label="Infiltration (Lat)" value={`${results.infiltrationCoolingLatent.toLocaleString()}`} />
            <ReportRow label="Internal (Sens)" value={`${results.internalSensible.toLocaleString()}`} />
            <ReportRow label="Internal (Lat)" value={`${results.internalLatent.toLocaleString()}`} />
            <ReportRow label="Duct Gain (Sens)" value={`${results.ductLossCoolingSensible.toLocaleString()}`} />
            <ReportRow label="Duct Gain (Lat)" value={`${results.ductLossCoolingLatent.toLocaleString()}`} />
            <div className="pt-4 mt-4 border-t border-zinc-900">
              <ReportRow label="Total Sensible" value={`${results.totalSensibleCooling.toLocaleString()} BTU/hr`} />
              <ReportRow label="Total Latent" value={`${results.totalLatentCooling.toLocaleString()} BTU/hr`} />
            </div>
            <div className="pt-2">
              <ReportRow label="Total Cooling" value={`${results.coolingBTU.toLocaleString()} BTU/hr`} highlight="cooling" />
            </div>
          </div>
        </section>
      </div>

      {/* Footer / Actions */}
      <footer className="border-t border-zinc-900 pt-12 pb-24 flex items-center justify-between">
        <div className="max-w-xs w-full">
          <PDFDownloadButton />
        </div>
      </footer>
    </div>
  );
}

function ReportRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: 'cooling' | 'heating';
}) {
  const valueClass = highlight === 'cooling' 
    ? 'text-cyan-cooling font-medium' 
    : highlight === 'heating' 
      ? 'text-orange-heating font-medium' 
      : 'text-zinc-300';

  return (
    <div className="flex items-baseline justify-between py-1 group">
      <span className="text-sm text-zinc-500 font-body group-hover:text-zinc-400 transition-colors">{label}</span>
      <span className={`font-mono text-sm ${valueClass}`}>{value}</span>
    </div>
  );
}
