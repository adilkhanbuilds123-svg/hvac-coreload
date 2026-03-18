import type { HVACResults } from '../lib/hvac-math';
import type { HVACState } from '../store';
import {
    Zap,
    Layers,
    Thermometer,
    Mountain,
} from 'lucide-react';

interface Props {
    results: HVACResults;
    store: HVACState;
}

export default function RecommendationEngine({ results, store }: Props) {
    const cards: React.ReactNode[] = [];

    // ── Engineering Rec 1: Equipment Target ──────────────────────
    cards.push(
        <div
            key="equipment"
            className="rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm p-4 sm:p-5 hover-glow bento-card transition-all duration-300"
            style={{ '--stagger': 10 } as React.CSSProperties}
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Zap size={20} className="text-blue-400" />
                </div>
                <div>
                    <h4 className="text-sm sm:text-base font-bold text-white leading-tight break-words">
                        Equipment Target: {results.tonnage} Ton Variable-Speed
                    </h4>
                </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-2">
                Based on your block load of {results.totalBTU.toLocaleString()} BTU/hr, a variable-speed compressor provides optimal efficiency and precise part-load humidity control to prevent short-cycling.
            </p>
        </div>,
    );

    // ── Engineering Rec 2: Envelope Leakage (conditional) ────────────────────
    if (store.wallInsulation === 'R-0' || store.roofInsulation === 'R-0') {
        const location = store.wallInsulation === 'R-0' && store.roofInsulation === 'R-0'
            ? 'walls and attic'
            : store.wallInsulation === 'R-0'
                ? 'walls'
                : 'attic';

        cards.push(
            <div
                key="insulation"
                className="rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm p-4 sm:p-5 hover-glow bento-card transition-all duration-300"
                style={{ '--stagger': 11 } as React.CSSProperties}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <Layers size={20} className="text-orange-400" />
                    </div>
                    <div>
                        <h4 className="text-sm sm:text-base font-bold text-white leading-tight break-words">
                            Critical Envelope Leakage
                        </h4>
                    </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-2">
                    Your {location} have zero insulation rated, causing massive conductive heat transfer. Upgrading to code-minimum R-30 insulation will dramatically drop your required equipment tonnage.
                </p>
            </div>,
        );
    }

    // ── Engineering Rec 3: Elevation Derating (conditional) ────────────────────
    if (store.elevation && store.elevation > 2000) {
        cards.push(
            <div
                key="elevation"
                className="rounded-2xl bg-white/[0.04] border border-white/[0.08] border-l-4 border-l-amber-500/40 backdrop-blur-sm p-4 sm:p-5 hover-glow bento-card transition-all duration-300"
                style={{ '--stagger': 12 } as React.CSSProperties}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Mountain size={20} className="text-amber-400" />
                    </div>
                    <div>
                        <h4 className="text-sm sm:text-base font-bold text-white leading-tight break-words">
                            High-Altitude Derating
                        </h4>
                    </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-2">
                    At {store.elevation} ft, lower air density reduces equipment capacity by ~{((1 - ((1 - (0.00000687 * store.elevation)) ** 5.256)) * 100).toFixed(0)}%. Ensure your installer selects equipment based on <strong className="text-white">De-rated Capacity</strong>, not nominal sea-level ratings.
                </p>
            </div>,
        );
    }

    // ── Engineering Rec 4: Controls Strategy ────────────────────
    cards.push(
        <div
            key="thermostat"
            className="rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm p-4 sm:p-5 hover-glow bento-card transition-all duration-300"
            style={{ '--stagger': 13 } as React.CSSProperties}
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Thermometer size={20} className="text-cyan-400" />
                </div>
                <div>
                    <h4 className="text-sm sm:text-base font-bold text-white leading-tight break-words">
                        Controls Strategy
                    </h4>
                </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-2">
                Pair the matched equipment with a multi-sensor smart thermostat strategy. Relying on a single thermostat in a central hallway will result in poor temperature stratification in peripheral zones.
            </p>
        </div>,
    );

    return (
        <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                <Zap size={12} className="text-cyan-400"/>
                Engineering Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {cards}
            </div>
        </div>
    );
}
