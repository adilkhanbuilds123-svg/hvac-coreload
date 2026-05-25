'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { AnimatedValue } from './AnimatedValue';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  variant?: 'cyan' | 'orange' | 'neutral';
  trend?: 'up' | 'down';
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  variant = 'neutral',
  trend,
  className = '',
}: MetricCardProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-0.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-zinc-600" />}
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">{label}</p>
        
        {trend && (
          <span className="text-[10px] ml-auto text-zinc-600">
            {trend === 'up' ? '\u2191' : '\u2193'}
          </span>
        )}
      </div>
      
      <div className="flex items-baseline gap-1.5">
        <div className="font-display text-5xl font-bold tracking-tight text-zinc-200">
          {typeof value === 'number' ? <AnimatedValue value={value} /> : value}
        </div>
        {unit && <span className="text-xs font-mono uppercase tracking-widest text-zinc-600">{unit}</span>}
      </div>
    </div>
  );
}
