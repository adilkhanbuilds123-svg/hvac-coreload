import type { WallInsulation, RoofInsulation } from '../lib/hvac-math';

interface Props {
    wallInsulation: WallInsulation;
    roofInsulation: RoofInsulation;
}

/**
 * SVG house visualizer.
 * Colors transition from red (#ef4444) for poor insulation
 * to green (#22c55e) for good insulation.
 * Designed for high visibility on both desktop and mobile.
 */
export default function HouseVisualizer({ wallInsulation, roofInsulation }: Props) {
    const wallScore: Record<WallInsulation, number> = {
        'R-0': 0,
        'R-7': 0.15,
        'R-11': 0.3,
        'R-13': 0.45,
        'R-19': 0.6,
        'R-21': 0.75,
        'R-30': 0.9,
        'R-40': 1,
    };

    const roofScore: Record<RoofInsulation, number> = {
        'R-0': 0,
        'R-11': 0.15,
        'R-19': 0.3,
        'R-30': 0.45,
        'R-38': 0.6,
        'R-49': 0.8,
        'R-60': 1,
    };

    const score = (wallScore[wallInsulation] + roofScore[roofInsulation]) / 2;

    const getColor = (s: number): string => {
        if (s <= 0.25) return '#94a3b8'; // slate-400 (poor)
        if (s <= 0.5) return '#38bdf8';  // sky-400  (fair)
        if (s <= 0.75) return '#0284c7'; // sky-600  (good)
        return '#0f172a';                // slate-900 (excellent)
    };

    const wallColor = getColor(wallScore[wallInsulation]);
    const roofColor = getColor(roofScore[roofInsulation]);
    const overallColor = getColor(score);

    const label =
        score < 0.25 ? 'Poor' : score < 0.5 ? 'Fair' : score < 0.75 ? 'Good' : 'Excellent';

    return (
        <div className="flex flex-col items-center gap-3 w-full">
            <svg
                viewBox="0 0 200 180"
                className="w-full max-w-[12rem] sm:max-w-[14rem] drop-shadow-lg"
                aria-label={`House insulation: ${label}`}
            >
                {/* Roof fill — bold and visible */}
                <polygon
                    points="100,15 25,75 175,75"
                    fill={roofColor}
                    opacity="0.35"
                    style={{ transition: 'fill 0.5s' }}
                />
                {/* Roof stroke */}
                <polygon
                    points="100,15 25,75 175,75"
                    fill="none"
                    stroke={roofColor}
                    strokeWidth="6"
                    strokeLinejoin="round"
                    style={{ transition: 'stroke 0.5s' }}
                />

                {/* Wall fill — bold and visible */}
                <rect
                    x="35" y="75" width="130" height="90" rx="2"
                    fill={wallColor}
                    opacity="0.25"
                    style={{ transition: 'fill 0.5s' }}
                />
                {/* Wall stroke */}
                <rect
                    x="35" y="75" width="130" height="90" rx="2"
                    fill="none"
                    stroke={wallColor}
                    strokeWidth="5"
                    style={{ transition: 'stroke 0.5s' }}
                />

                {/* Door */}
                <rect
                    x="85" y="120" width="30" height="45" rx="2"
                    fill={overallColor}
                    opacity="0.15"
                    stroke={overallColor}
                    strokeWidth="2.5"
                    style={{ transition: 'stroke 0.5s, fill 0.5s' }}
                />
                <circle cx="109" cy="144" r="2.5" fill={overallColor} opacity="0.7" />

                {/* Left window */}
                <rect
                    x="50" y="92" width="22" height="22" rx="2"
                    fill={overallColor}
                    opacity="0.1"
                    stroke={overallColor}
                    strokeWidth="2.5"
                    style={{ transition: 'stroke 0.5s, fill 0.5s' }}
                />
                <line x1="61" y1="92" x2="61" y2="114" stroke={overallColor} strokeWidth="1.5" opacity="0.4" />
                <line x1="50" y1="103" x2="72" y2="103" stroke={overallColor} strokeWidth="1.5" opacity="0.4" />

                {/* Right window */}
                <rect
                    x="128" y="92" width="22" height="22" rx="2"
                    fill={overallColor}
                    opacity="0.1"
                    stroke={overallColor}
                    strokeWidth="2.5"
                    style={{ transition: 'stroke 0.5s, fill 0.5s' }}
                />
                <line x1="139" y1="92" x2="139" y2="114" stroke={overallColor} strokeWidth="1.5" opacity="0.4" />
                <line x1="128" y1="103" x2="150" y2="103" stroke={overallColor} strokeWidth="1.5" opacity="0.4" />

                {/* Chimney */}
                <rect
                    x="140" y="25" width="16" height="35" rx="2"
                    fill="none"
                    stroke={roofColor}
                    strokeWidth="3"
                    opacity="0.6"
                    style={{ transition: 'stroke 0.5s' }}
                />
            </svg>

            <div className="flex items-center gap-2">
                <div
                    className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: overallColor, transition: 'background-color 0.5s' }}
                />
                <span className="text-sm font-bold text-zinc-400">
                    Insulation:{' '}
                    <span
                        className="font-extrabold"
                        style={{ color: overallColor, transition: 'color 0.5s' }}
                    >
                        {label}
                    </span>
                </span>
            </div>
        </div>
    );
}
