import { useHVACStore } from '../store';
import { useMemo, useState } from 'react';
import { rValueToUValue, WALL_R_VALUES, ROOF_R_VALUES, type WallInsulation, type RoofInsulation } from '../lib/hvac-math';

// ──────────────────────────────────────────────────────────────────────────────
// Professional 2D Thermal Envelope Diagram — replaces the 3D Three.js scene
// ──────────────────────────────────────────────────────────────────────────────

function getHeatmapColor(uValue: number, maxU: number = 1.1): string {
    const t = Math.min(Math.max(uValue / maxU, 0), 1);
    if (t < 0.25) return `hsl(210, 90%, ${55 + t * 4 * 15}%)`;   // Blue
    if (t < 0.5) return `hsl(${150 - (t - 0.25) * 4 * 50}, 80%, 50%)`;  // Green → Yellow
    if (t < 0.75) return `hsl(${50 - (t - 0.5) * 4 * 30}, 90%, 50%)`;   // Yellow → Orange
    return `hsl(${20 - (t - 0.75) * 4 * 20}, 90%, ${50 - (t - 0.75) * 4 * 10}%)`;  // Orange → Red
}

function getGrade(uValue: number, maxU: number): string {
    const t = uValue / maxU;
    if (t < 0.2) return 'Excellent';
    if (t < 0.4) return 'Good';
    if (t < 0.6) return 'Standard';
    if (t < 0.8) return 'Marginal';
    return 'Poor';
}

interface TooltipData {
    label: string;
    rValue: string;
    uValue: string;
    btu: string;
    grade: string;
    color: string;
}

export default function ThermalDiagram() {
    const store = useHVACStore();
    const [hovered, setHovered] = useState<string | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    // Physics
    const wallR = WALL_R_VALUES[store.wallInsulation as WallInsulation] || 13;
    const roofR = ROOF_R_VALUES[store.roofInsulation as RoofInsulation] || 38;
    const winU = store.windowType === 'single' ? 1.10 : store.windowType === 'double' ? 0.50 : 0.30;
    const wallU = rValueToUValue(wallR);
    const roofU = rValueToUValue(roofR);

    const dT = Math.max(1, store.heatingSetpoint - store.winterDesign);
    const wallArea = (store.buildingWidth * store.ceilingHeight * 2) + (store.buildingLength * store.ceilingHeight * 2);
    const totalWinArea = store.windowAreaNorth + store.windowAreaSouth + store.windowAreaEast + store.windowAreaWest;
    const netWallArea = Math.max(0, wallArea - totalWinArea);
    const floorArea = store.buildingWidth * store.buildingLength;
    const wallBtu = Math.round(netWallArea * wallU * dT);
    const roofBtu = Math.round(floorArea * roofU * dT);
    const winBtu = Math.round(totalWinArea * winU * dT);

    // Colors
    const wallCol = getHeatmapColor(wallU, 0.25);
    const roofCol = getHeatmapColor(roofU, 0.08);
    const winCol = getHeatmapColor(winU, 1.2);

    // Tooltip data
    const tooltips = useMemo<Record<string, TooltipData>>(() => ({
        wall: { 
            label: 'Walls', rValue: `R-${wallR}`, uValue: wallU.toFixed(3), 
            btu: wallBtu.toLocaleString(), grade: getGrade(wallU, 0.25), color: wallCol 
        },
        roof: { 
            label: 'Roof / Attic', rValue: `R-${roofR}`, uValue: roofU.toFixed(4), 
            btu: roofBtu.toLocaleString(), grade: getGrade(roofU, 0.08), color: roofCol 
        },
        window: { 
            label: 'Windows', rValue: `U=${winU.toFixed(2)}`, uValue: winU.toFixed(2), 
            btu: winBtu.toLocaleString(), grade: getGrade(winU, 1.2), color: winCol 
        },
    }), [wallR, roofR, winU, wallU, roofU, wallBtu, roofBtu, winBtu, wallCol, roofCol, winCol]);

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const activeTooltip = hovered ? tooltips[hovered] : null;

    // SVG dimensions
    const vw = 500, vh = 380;
    // House proportions
    const houseW = 320, houseH = 150, roofH = 80;
    const houseX = (vw - houseW) / 2;
    const houseY = vh - 80 - houseH;
    const roofApex = houseY - roofH;
    const wallThickness = 16;
    const foundationH = 14;

    // Window positions (4 per wall face, visible on front elevation)
    const winCount = Math.max(1, Math.round(totalWinArea / 20));
    const winW = 32, winH = 44;
    const windowSpacing = houseW / (Math.min(winCount, 5) + 1);

    return (
        <div className="w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden relative ring-1 ring-slate-800">
            {/* Legend */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 bg-slate-900/90 backdrop-blur p-2.5 rounded-lg border border-white/10 text-[9px]">
                <div className="font-bold text-slate-400 uppercase tracking-widest mb-0.5">Thermal Loss</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(210, 90%, 60%)' }}></div><span className="text-slate-300">Excellent</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(140, 80%, 50%)' }}></div><span className="text-slate-300">Good</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(40, 90%, 50%)' }}></div><span className="text-slate-300">Standard</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(10, 90%, 45%)' }}></div><span className="text-slate-300">Poor</span></div>
            </div>

            {/* Stats bar */}
            <div className="absolute top-3 right-3 z-10 bg-slate-900/90 backdrop-blur p-2.5 rounded-lg border border-white/10 text-[9px] space-y-1">
                <div className="font-bold text-slate-400 uppercase tracking-widest mb-1">BTU/hr Loss</div>
                <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Walls</span>
                    <span className="font-bold tabular-nums" style={{ color: wallCol }}>{wallBtu.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Roof</span>
                    <span className="font-bold tabular-nums" style={{ color: roofCol }}>{roofBtu.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Glass</span>
                    <span className="font-bold tabular-nums" style={{ color: winCol }}>{winBtu.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/10">
                    <span className="text-white font-bold">Total</span>
                    <span className="font-bold text-orange-400 tabular-nums">{(wallBtu + roofBtu + winBtu).toLocaleString()}</span>
                </div>
            </div>

            <svg
                viewBox={`0 0 ${vw} ${vh}`}
                className="w-full h-full"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHovered(null)}
            >
                <defs>
                    {/* Glow filter */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {/* Wall pattern (insulation fill) */}
                    <pattern id="insulation" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    </pattern>
                    {/* Roof shingle pattern */}
                    <pattern id="shingles" patternUnits="userSpaceOnUse" width="20" height="10">
                        <line x1="0" y1="5" x2="20" y2="5" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                        <line x1="10" y1="0" x2="10" y2="5" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                    </pattern>
                    {/* Ground gradient */}
                    <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                </defs>

                {/* Ground */}
                <rect x={0} y={vh - 80 + foundationH} width={vw} height={80 - foundationH} fill="url(#groundGrad)" />
                <line x1={0} y1={vh - 80 + foundationH} x2={vw} y2={vh - 80 + foundationH} stroke="#475569" strokeWidth="1" />

                {/* Foundation */}
                <rect 
                    x={houseX - 6} y={houseY + houseH} width={houseW + 12} height={foundationH}
                    fill="#475569" stroke="#64748b" strokeWidth="0.5" rx="1"
                />

                {/* ═══════ WALLS ═══════ */}
                <g
                    onMouseEnter={() => setHovered('wall')}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: 'pointer' }}
                >
                    {/* Left wall */}
                    <rect
                        x={houseX} y={houseY} width={wallThickness} height={houseH}
                        fill={wallCol} opacity={hovered === 'wall' ? 0.95 : 0.8}
                        stroke={hovered === 'wall' ? '#fff' : 'rgba(255,255,255,0.2)'}
                        strokeWidth={hovered === 'wall' ? 1.5 : 0.5}
                        rx="1"
                        className="transition-all duration-200"
                    />
                    <rect x={houseX} y={houseY} width={wallThickness} height={houseH} fill="url(#insulation)" rx="1" />

                    {/* Right wall */}
                    <rect
                        x={houseX + houseW - wallThickness} y={houseY} width={wallThickness} height={houseH}
                        fill={wallCol} opacity={hovered === 'wall' ? 0.95 : 0.8}
                        stroke={hovered === 'wall' ? '#fff' : 'rgba(255,255,255,0.2)'}
                        strokeWidth={hovered === 'wall' ? 1.5 : 0.5}
                        rx="1"
                        className="transition-all duration-200"
                    />
                    <rect x={houseX + houseW - wallThickness} y={houseY} width={wallThickness} height={houseH} fill="url(#insulation)" rx="1" />

                    {/* Interior fill */}
                    <rect
                        x={houseX + wallThickness} y={houseY} width={houseW - wallThickness * 2} height={houseH}
                        fill="#1e293b" opacity="0.4"
                    />

                    {/* R-value label on left wall */}
                    <text x={houseX - 8} y={houseY + houseH / 2} fill={wallCol} fontSize="10" fontWeight="700" textAnchor="end" dominantBaseline="middle" className="select-none">
                        R-{wallR}
                    </text>

                    {/* Thermal arrows (heat flow indicators) */}
                    {[0.25, 0.5, 0.75].map((frac, i) => (
                        <g key={`arrow-${i}`} opacity={hovered === 'wall' ? 0.8 : 0.3} className="transition-opacity duration-200">
                            {/* Left arrows - heat escaping */}
                            <line x1={houseX - 2} y1={houseY + houseH * frac} x2={houseX - 16} y2={houseY + houseH * frac}
                                stroke={wallCol} strokeWidth="1.5" markerEnd="none" />
                            <polygon points={`${houseX - 20},${houseY + houseH * frac} ${houseX - 14},${houseY + houseH * frac - 3} ${houseX - 14},${houseY + houseH * frac + 3}`}
                                fill={wallCol} />
                            {/* Right arrows */}
                            <line x1={houseX + houseW + 2} y1={houseY + houseH * frac} x2={houseX + houseW + 16} y2={houseY + houseH * frac}
                                stroke={wallCol} strokeWidth="1.5" />
                            <polygon points={`${houseX + houseW + 20},${houseY + houseH * frac} ${houseX + houseW + 14},${houseY + houseH * frac - 3} ${houseX + houseW + 14},${houseY + houseH * frac + 3}`}
                                fill={wallCol} />
                        </g>
                    ))}
                </g>

                {/* ═══════ ROOF ═══════ */}
                <g
                    onMouseEnter={() => setHovered('roof')}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: 'pointer' }}
                >
                    {/* Left slope */}
                    <polygon
                        points={`${houseX - 10},${houseY + 2} ${vw / 2},${roofApex} ${vw / 2},${roofApex + 14} ${houseX - 10 + 12},${houseY + 2}`}
                        fill={roofCol} opacity={hovered === 'roof' ? 0.95 : 0.8}
                        stroke={hovered === 'roof' ? '#fff' : 'rgba(255,255,255,0.2)'}
                        strokeWidth={hovered === 'roof' ? 1.5 : 0.5}
                        className="transition-all duration-200"
                    />
                    <polygon
                        points={`${houseX - 10},${houseY + 2} ${vw / 2},${roofApex} ${vw / 2},${roofApex + 14} ${houseX - 10 + 12},${houseY + 2}`}
                        fill="url(#shingles)"
                    />

                    {/* Right slope */}
                    <polygon
                        points={`${houseX + houseW + 10},${houseY + 2} ${vw / 2},${roofApex} ${vw / 2},${roofApex + 14} ${houseX + houseW + 10 - 12},${houseY + 2}`}
                        fill={roofCol} opacity={hovered === 'roof' ? 0.95 : 0.8}
                        stroke={hovered === 'roof' ? '#fff' : 'rgba(255,255,255,0.2)'}
                        strokeWidth={hovered === 'roof' ? 1.5 : 0.5}
                        className="transition-all duration-200"
                    />
                    <polygon
                        points={`${houseX + houseW + 10},${houseY + 2} ${vw / 2},${roofApex} ${vw / 2},${roofApex + 14} ${houseX + houseW + 10 - 12},${houseY + 2}`}
                        fill="url(#shingles)"
                    />

                    {/* Ridge cap */}
                    <circle cx={vw / 2} cy={roofApex} r="3" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />

                    {/* R-value label */}
                    <text x={vw / 2} y={roofApex - 12} fill={roofCol} fontSize="10" fontWeight="700" textAnchor="middle" className="select-none">
                        R-{roofR}
                    </text>

                    {/* Roof thermal arrows */}
                    <g opacity={hovered === 'roof' ? 0.8 : 0.3} className="transition-opacity duration-200">
                        <line x1={vw / 2} y1={roofApex - 2} x2={vw / 2} y2={roofApex - 20} stroke={roofCol} strokeWidth="1.5" />
                        <polygon points={`${vw / 2},${roofApex - 24} ${vw / 2 - 3},${roofApex - 18} ${vw / 2 + 3},${roofApex - 18}`} fill={roofCol} />
                    </g>
                </g>

                {/* ═══════ WINDOWS ═══════ */}
                <g
                    onMouseEnter={() => setHovered('window')}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: 'pointer' }}
                >
                    {Array.from({ length: Math.min(winCount, 5) }, (_, i) => {
                        const wx = houseX + windowSpacing * (i + 1) - winW / 2;
                        const wy = houseY + (houseH - winH) / 2 - 5;
                        return (
                            <g key={`win-${i}`}>
                                {/* Window pane */}
                                <rect
                                    x={wx} y={wy} width={winW} height={winH}
                                    fill={winCol} opacity={hovered === 'window' ? 0.7 : 0.45}
                                    stroke={hovered === 'window' ? '#fff' : 'rgba(255,255,255,0.3)'}
                                    strokeWidth={hovered === 'window' ? 1.5 : 0.8}
                                    rx="1.5"
                                    className="transition-all duration-200"
                                />
                                {/* Glass reflection */}
                                <rect x={wx + 2} y={wy + 2} width={winW - 4} height={winH / 2 - 3} fill="rgba(255,255,255,0.06)" rx="1" />
                                {/* Mullion (cross divider) */}
                                <line x1={wx + winW / 2} y1={wy} x2={wx + winW / 2} y2={wy + winH} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                                <line x1={wx} y1={wy + winH / 2} x2={wx + winW} y2={wy + winH / 2} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                            </g>
                        );
                    })}

                    {/* U-value label */}
                    {totalWinArea > 0 && (
                        <text
                            x={houseX + houseW / 2}
                            y={houseY + houseH - 8}
                            fill={winCol} fontSize="9" fontWeight="600" textAnchor="middle"
                            opacity={0.8} className="select-none"
                        >
                            {store.windowType}-pane · U={winU.toFixed(2)} · {totalWinArea} ft²
                        </text>
                    )}
                </g>

                {/* ═══════ FRONT DOOR ═══════ */}
                <g>
                    <rect
                        x={houseX + houseW / 2 - 16} y={houseY + houseH - 55}
                        width={32} height={55}
                        fill="#5D4037" stroke="#3E2723" strokeWidth="0.8" rx="1.5"
                    />
                    {/* Door panel groove */}
                    <rect x={houseX + houseW / 2 - 12} y={houseY + houseH - 50} width={24} height={20} fill="none" stroke="#795548" strokeWidth="0.5" rx="1" />
                    <rect x={houseX + houseW / 2 - 12} y={houseY + houseH - 25} width={24} height={16} fill="none" stroke="#795548" strokeWidth="0.5" rx="1" />
                    {/* Doorknob */}
                    <circle cx={houseX + houseW / 2 + 10} cy={houseY + houseH - 25} r="2" fill="#d4a574" stroke="#c09060" strokeWidth="0.5" />
                </g>

                {/* ═══════ DIMENSION LABELS ═══════ */}
                <g opacity="0.5">
                    {/* Width dimension */}
                    <line x1={houseX} y1={vh - 55} x2={houseX + houseW} y2={vh - 55} stroke="#64748b" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={houseX + houseW / 2} y={vh - 45} fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="middle" className="select-none">
                        {store.buildingWidth} ft
                    </text>
                    {/* Height dimension */}
                    <line x1={houseX + houseW + 30} y1={houseY} x2={houseX + houseW + 30} y2={houseY + houseH} stroke="#64748b" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text 
                        x={houseX + houseW + 40} y={houseY + houseH / 2}
                        fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="start" dominantBaseline="middle"
                        className="select-none"
                    >
                        {store.ceilingHeight} ft
                    </text>
                </g>

                {/* ═══════ FLOOR AREA LABEL ═══════ */}
                <text x={houseX + houseW / 2} y={houseY + houseH / 2 + 15} fill="rgba(255,255,255,0.12)" fontSize="14" fontWeight="800" textAnchor="middle" className="select-none">
                    {(store.buildingWidth * store.buildingLength).toLocaleString()} sq ft
                </text>
            </svg>

            {/* Hover tooltip */}
            {activeTooltip && (
                <div
                    className="absolute z-20 pointer-events-none"
                    style={{ left: Math.min(tooltipPos.x + 12, 280), top: Math.max(tooltipPos.y - 60, 8) }}
                >
                    <div className="bg-slate-900/95 text-white px-3.5 py-2.5 rounded-xl text-[11px] font-bold whitespace-nowrap shadow-2xl border border-white/10 backdrop-blur-md">
                        <div className="text-slate-400 text-[9px] uppercase tracking-widest mb-1">{activeTooltip.label}</div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ background: activeTooltip.color }}></div>
                            <span>{activeTooltip.rValue}</span>
                            <span className="text-slate-500">·</span>
                            <span className="text-slate-400">{activeTooltip.grade}</span>
                        </div>
                        <div className="text-orange-400">⚡ {activeTooltip.btu} BTU/hr</div>
                    </div>
                </div>
            )}

            <div className="absolute bottom-2.5 left-0 right-0 text-center z-10 pointer-events-none">
                <span className="text-[10px] text-slate-500">Hover components for BTU physics</span>
            </div>
        </div>
    );
}
