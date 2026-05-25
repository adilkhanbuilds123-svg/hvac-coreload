import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import climateData from '@/data/ashrae-weather.json';
import { CityCalculatorLoader } from './CityCalculatorLoader';

function slugify(city: string): string {
  return city.toLowerCase().replace(/[.\s']+/g, '-').replace(/--+/g, '-');
}

interface CityRecord {
  city: string;
  state: string;
  winterDesign: number;
  summerDesign: number;
  latentGrains: number;
  elevation: number;
}

export async function generateStaticParams() {
  return (climateData as CityRecord[]).map((record) => ({
    city: slugify(record.city),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const record = (climateData as CityRecord[]).find((r) => slugify(r.city) === slug);
  if (!record) return { title: 'City Not Found | CoreLoad' };

  return {
    title: `HVAC Load Calculator for ${record.city}, ${record.state} | CoreLoad`,
    description: `Calculate heating and cooling loads for ${record.city}, ${record.state}. Winter design: ${record.winterDesign}F, Summer design: ${record.summerDesign}F. Free Manual J calculator.`,
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const record = (climateData as CityRecord[]).find((r) => slugify(r.city) === slug);

  if (!record) notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* City Header */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-cyan-cooling uppercase tracking-widest">
          ASHRAE Climate Zone
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-zinc-100">
          HVAC Load Calculator for {record.city}, {record.state}
        </h1>
        <p className="text-zinc-500 font-body">
          Pre-configured with ASHRAE design conditions for {record.city}. Adjust building parameters to calculate your heating and cooling loads.
        </p>
      </div>

      {/* Climate Data Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-subtle rounded-lg overflow-hidden">
        <div className="bg-canvas-card p-4">
          <div className="font-mono text-2xl font-bold text-orange-heating">{record.winterDesign}F</div>
          <div className="text-xs font-mono text-zinc-600 uppercase mt-1">Winter Design</div>
        </div>
        <div className="bg-canvas-card p-4">
          <div className="font-mono text-2xl font-bold text-cyan-cooling">{record.summerDesign}F</div>
          <div className="text-xs font-mono text-zinc-600 uppercase mt-1">Summer Design</div>
        </div>
        <div className="bg-canvas-card p-4">
          <div className="font-mono text-2xl font-bold text-zinc-300">{record.latentGrains}</div>
          <div className="text-xs font-mono text-zinc-600 uppercase mt-1">Latent Grains</div>
        </div>
        <div className="bg-canvas-card p-4">
          <div className="font-mono text-2xl font-bold text-zinc-300">{record.elevation.toLocaleString()}</div>
          <div className="text-xs font-mono text-zinc-600 uppercase mt-1">Elevation (ft)</div>
        </div>
      </div>

      {/* Hydrate store and redirect to calculator */}
      <CityCalculatorLoader
        city={record.city}
        state={record.state}
        winterDesign={record.winterDesign}
        summerDesign={record.summerDesign}
        latentGrains={record.latentGrains}
        elevation={record.elevation}
      />

      {/* SEO Content */}
      <section className="prose prose-invert prose-sm max-w-none">
        <h2 className="font-display text-xl font-bold text-zinc-200">
          About HVAC Sizing in {record.city}
        </h2>
        <p className="text-zinc-400 leading-relaxed">
          {record.city}, {record.state} has a winter 99% design temperature of {record.winterDesign}°F and a summer 1% design temperature of {record.summerDesign}°F.
          {record.elevation > 3000
            ? ` At ${record.elevation.toLocaleString()} feet elevation, altitude corrections significantly reduce air density, which affects infiltration and equipment capacity.`
            : ` At ${record.elevation.toLocaleString()} feet elevation, altitude corrections are minimal.`}
          {record.latentGrains > 60
            ? ` The high moisture content (${record.latentGrains} grains) means latent cooling loads are a major factor in equipment selection. Oversized systems may short-cycle and fail to adequately dehumidify.`
            : record.latentGrains < 20
              ? ` The low humidity (${record.latentGrains} grains) means cooling loads are predominantly sensible, simplifying equipment selection.`
              : ` The moderate humidity level (${record.latentGrains} grains) requires balanced attention to both sensible and latent cooling loads.`}
        </p>
        <p className="text-zinc-500 leading-relaxed">
          CoreLoad uses ACCA Manual J block-load methodology to calculate heating and cooling loads.
          The calculator accounts for wall, roof, and floor heat transfer coefficients, solar heat gain through windows using
          orientation-weighted SHGC factors, infiltration based on building tightness, internal loads from occupants and
          appliances, and duct system losses based on location and insulation level.
        </p>
      </section>
    </div>
  );
}
