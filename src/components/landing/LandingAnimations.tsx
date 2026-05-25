'use client';

import { motion } from 'framer-motion';
import { MapPin, Building2, BarChart3, ChevronRight } from 'lucide-react';

const steps = [
  {
    icon: MapPin,
    title: 'Set Location',
    description: 'Select from 195 ASHRAE-indexed cities. Design temperatures, latent grains, and elevation auto-populate.',
  },
  {
    icon: Building2,
    title: 'Define Envelope',
    description: 'Configure dimensions, insulation R-values, window areas, duct systems, and building tightness.',
  },
  {
    icon: BarChart3,
    title: 'Get Results',
    description: 'Receive heating and cooling BTU loads, tonnage, sensible heat ratio, and component-level breakdowns.',
  },
];

export function LandingAnimations() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="font-display text-2xl font-bold text-zinc-200 mb-2">
          Three Steps to Precision
        </h2>
        <p className="text-sm text-zinc-500 font-body">
          From location data to equipment sizing in under a minute
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-px bg-border-subtle rounded-lg overflow-hidden">
        {steps.map((step, idx) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: idx * 0.15, duration: 0.5 }}
            className="flex-1 bg-canvas-card p-8 relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center">
                <step.icon className="w-4 h-4 text-cyan-cooling" />
              </div>
              <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                Step {idx + 1}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-zinc-200 mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              {step.description}
            </p>
            {idx < steps.length - 1 && (
              <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center">
                <ChevronRight className="w-3 h-3 text-zinc-600" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
