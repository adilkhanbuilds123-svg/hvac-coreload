import Link from 'next/link';
import { LandingAnimations } from '@/components/landing/LandingAnimations';
import { ConsoleButton } from '@/components/ui/ConsoleButton';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden text-zinc-400 font-body">
      {/* Hero Section */}
      <section className="relative z-10 flex flex-col justify-center min-h-[75vh] px-6 lg:px-12 max-w-7xl mx-auto pt-24">
        <div className="mb-8">
          <span className="inline-block px-3 py-1.5 text-xs font-medium text-zinc-300 border border-zinc-800 bg-zinc-900/50">
            ACCA Manual J Engine
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight leading-[0.9] mb-8 text-zinc-100 max-w-5xl">
          CoreLoad
        </h1>

        <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl mb-12 leading-relaxed font-light">
          Precision residential HVAC load calculations. Engineered for accuracy,
          built for professionals who demand data-driven system sizing.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <ConsoleButton href="/calculator" variant="primary">
            Launch Calculator
          </ConsoleButton>
          <ConsoleButton href="/blog" variant="secondary">
            Engineering Blog
          </ConsoleButton>
        </div>
      </section>

      {/* Asymmetrical Feature Layout */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-zinc-900 pt-12">
          
          {/* Main Feature Highlight (8 cols) */}
          <div className="lg:col-span-8 bg-zinc-900/20 border border-zinc-900 p-8 lg:p-12">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-zinc-200 mb-4">Manual J Calculations</h3>
                <p className="text-zinc-500 leading-relaxed text-lg max-w-xl">
                  Complete block-load analysis with envelope heat transfer, infiltration modeling, solar gain calculations, and duct loss physics. Every variable accounted for in real-time.
                </p>
              </div>
              <div className="mt-12">
                <span className="text-5xl font-display font-bold text-zinc-100">22</span>
                <span className="block text-sm text-zinc-500 mt-2">Output Variables</span>
              </div>
            </div>
          </div>

          {/* Secondary Features Stack (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-zinc-900/20 border border-zinc-900 p-8 flex-1">
              <h3 className="font-display text-xl font-bold text-zinc-200 mb-3">Climate Database</h3>
              <p className="text-zinc-500 text-sm mb-8">
                ASHRAE weather database with 99% heating and 1% cooling design temperatures.
              </p>
              <div>
                <span className="text-3xl font-display font-bold text-zinc-100">195</span>
                <span className="block text-xs text-zinc-500 mt-1">Cities Indexed</span>
              </div>
            </div>

            <div className="bg-zinc-900/20 border border-zinc-900 p-8 flex-1">
              <h3 className="font-display text-xl font-bold text-zinc-200 mb-3">Real-time Engine</h3>
              <p className="text-zinc-500 text-sm mb-8">
                Instant recalculation on every parameter change.
              </p>
              <div>
                <span className="text-3xl font-display font-bold text-zinc-100">&lt;50ms</span>
                <span className="block text-xs text-zinc-500 mt-1">Response Time</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        <LandingAnimations />
      </section>
    </div>
  );
}
