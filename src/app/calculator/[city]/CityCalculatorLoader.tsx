'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useHVACStore } from '@/store/useHVACStore';

interface Props {
  city: string;
  state: string;
  winterDesign: number;
  summerDesign: number;
  latentGrains: number;
  elevation: number;
}

export function CityCalculatorLoader({ city, state, winterDesign, summerDesign, latentGrains, elevation }: Props) {
  const setLocation = useHVACStore((s) => s.setLocation);

  useEffect(() => {
    setLocation(city, state, winterDesign, summerDesign, latentGrains, elevation);
  }, [city, state, winterDesign, summerDesign, latentGrains, elevation, setLocation]);

  return (
    <Link
      href="/calculator"
      className="flex items-center justify-center gap-2 w-full py-3 bg-cyan-cooling text-zinc-950 font-mono text-sm font-bold uppercase tracking-wider rounded hover:bg-cyan-400 transition-colors hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
    >
      Open Full Calculator for {city}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
