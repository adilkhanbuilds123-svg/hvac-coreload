import { useState, useEffect } from 'react';
import { useHVACStore } from '../../store';
import type { WallInsulation, RoofInsulation, BuildingTightness, DuctLocation, DuctInsulation, FloorType, FloorInsulation, FootprintShape } from '../../lib/hvac-math';
import ThermalDiagram from '../ThermalDiagram';
import {
    Home,
    ChevronRight,
    ChevronLeft,
    Layers,
    Ruler,
    ArrowUpDown,
    Wind,
    Wind as DuctIcon,
    ThermometerSnowflake,
    Box
} from 'lucide-react';

const FOOTPRINT_OPTIONS: { value: FootprintShape; label: string; desc: string; svg: string }[] = [
    { value: 'rectangle', label: 'Rectangle', desc: 'Simple 4 corners', svg: 'M2,2 H14 V10 H2 Z' },
    { value: 'l_shape', label: 'L-Shape', desc: '6 corners', svg: 'M2,2 H10 V6 H14 V10 H2 Z' },
    { value: 'u_shape', label: 'U-Shape', desc: '8 corners', svg: 'M2,2 H5 V6 H11 V2 H14 V10 H2 Z' },
    { value: 'complex', label: 'Complex', desc: 'Many jogs/bump-outs', svg: 'M2,2 H6 V4 H10 V2 H14 V7 H12 V10 H4 V8 H2 Z' },
];

const WALL_OPTIONS: { value: WallInsulation; label: string; desc: string }[] = [
    { value: 'R-0', label: 'R-0', desc: 'None' },
    { value: 'R-7', label: 'R-7', desc: 'Thin' },
    { value: 'R-11', label: 'R-11', desc: 'Basic' },
    { value: 'R-13', label: 'R-13', desc: 'Standard' },
    { value: 'R-19', label: 'R-19', desc: 'Advanced' },
    { value: 'R-21', label: 'R-21', desc: 'High' },
    { value: 'R-30', label: 'R-30', desc: 'Super' },
    { value: 'R-40', label: 'R-40', desc: 'Passive' },
];

const ROOF_OPTIONS: { value: RoofInsulation; label: string; desc: string }[] = [
    { value: 'R-0', label: 'R-0', desc: 'None' },
    { value: 'R-11', label: 'R-11', desc: 'Flat' },
    { value: 'R-19', label: 'R-19', desc: 'Basic' },
    { value: 'R-30', label: 'R-30', desc: 'Fiberglass' },
    { value: 'R-38', label: 'R-38', desc: 'Standard' },
    { value: 'R-49', label: 'R-49', desc: 'Premium' },
    { value: 'R-60', label: 'R-60', desc: 'High Perf.' },
];

const TIGHTNESS_OPTIONS: { value: BuildingTightness; label: string; desc: string }[] = [
    { value: 'tight', label: 'Tight', desc: 'New const.' },
    { value: 'average', label: 'Average', desc: 'Standard/Retrofit' },
    { value: 'leaky', label: 'Leaky', desc: 'Drafty/Older' },
];

const DUCT_LOCATION_OPTIONS: { value: DuctLocation; label: string; desc: string }[] = [
    { value: 'conditioned', label: 'Conditioned', desc: 'Inside home' },
    { value: 'unconditioned_basement', label: 'Basement', desc: 'Unconditioned' },
    { value: 'vented_attic', label: 'Attic', desc: 'Vented' },
];

const DUCT_INSULATION_OPTIONS: { value: DuctInsulation; label: string; desc: string }[] = [
    { value: 'none', label: 'None', desc: 'Uninsulated' },
    { value: 'R-4', label: 'R-4', desc: 'Basic flex' },
    { value: 'R-6', label: 'R-6', desc: 'Standard' },
    { value: 'R-8', label: 'R-8', desc: 'Premium' },
];

const FLOOR_TYPE_OPTIONS: { value: FloorType; label: string; desc: string }[] = [
    { value: 'slab_on_grade', label: 'Slab', desc: 'On grade' },
    { value: 'vented_crawlspace', label: 'Crawlspace', desc: 'Vented' },
    { value: 'conditioned_basement', label: 'Basement', desc: 'Conditioned' },
];

const FLOOR_INSULATION_OPTIONS: { value: FloorInsulation; label: string; desc: string }[] = [
    { value: 'uninsulated', label: 'None', desc: 'Uninsulated' },
    { value: 'R-7', label: 'R-7', desc: 'Basic' },
    { value: 'R-11', label: 'R-11', desc: 'Standard' },
    { value: 'R-19', label: 'R-19', desc: 'Premium' },
];



export default function BuildingShellStep() {
    const buildingLength = useHVACStore((state) => state.buildingLength);
    const setBuildingLength = useHVACStore((state) => state.setBuildingLength);
    const buildingWidth = useHVACStore((state) => state.buildingWidth);
    const setBuildingWidth = useHVACStore((state) => state.setBuildingWidth);
    const footprintShape = useHVACStore((state) => state.footprintShape);
    const setFootprintShape = useHVACStore((state) => state.setFootprintShape);
    const ceilingHeight = useHVACStore((state) => state.ceilingHeight);
    const setCeilingHeight = useHVACStore((state) => state.setCeilingHeight);
    const isVaulted = useHVACStore((state) => state.isVaulted);
    const setIsVaulted = useHVACStore((state) => state.setIsVaulted);
    const vaultedHeight = useHVACStore((state) => state.vaultedHeight);
    const setVaultedHeight = useHVACStore((state) => state.setVaultedHeight);
    const wallInsulation = useHVACStore((state) => state.wallInsulation);
    const setWallInsulation = useHVACStore((state) => state.setWallInsulation);
    const roofInsulation = useHVACStore((state) => state.roofInsulation);
    const setRoofInsulation = useHVACStore((state) => state.setRoofInsulation);
    const tightness = useHVACStore((state) => state.tightness);
    const setTightness = useHVACStore((state) => state.setTightness);
    const ductLocation = useHVACStore((state) => state.ductLocation);
    const setDuctLocation = useHVACStore((state) => state.setDuctLocation);
    const ductInsulation = useHVACStore((state) => state.ductInsulation);
    const setDuctInsulation = useHVACStore((state) => state.setDuctInsulation);
    const floorType = useHVACStore((state) => state.floorType);
    const setFloorType = useHVACStore((state) => state.setFloorType);
    const floorInsulation = useHVACStore((state) => state.floorInsulation);
    const setFloorInsulation = useHVACStore((state) => state.setFloorInsulation);
    const nextStep = useHVACStore((state) => state.nextStep);
    const prevStep = useHVACStore((state) => state.prevStep);

    // Local State for Fast Sliding
    const [localLength, setLocalLength] = useState(buildingLength);
    const [localWidth, setLocalWidth] = useState(buildingWidth);
    const [localCeiling, setLocalCeiling] = useState(ceilingHeight);
    const [localVaulted, setLocalVaulted] = useState(vaultedHeight);

    // Sync from global store correctly
    // eslint-disable-next-line
    useEffect(() => setLocalLength(buildingLength), [buildingLength]);
    // eslint-disable-next-line
    useEffect(() => setLocalWidth(buildingWidth), [buildingWidth]);
    // eslint-disable-next-line
    useEffect(() => setLocalCeiling(ceilingHeight), [ceilingHeight]);
    // eslint-disable-next-line
    useEffect(() => setLocalVaulted(vaultedHeight), [vaultedHeight]);

    // Gross wall area preview
    const grossWall = Math.round(2 * (localLength + localWidth) * localCeiling);

    return (
        <div className="animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-4">
                    <Home size={14} />
                    Step 2: Building Shell
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    Describe Your Building
                </h2>
                <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
                    Use the sliders and toggles below — no typing needed.
                </p>
            </div>

            <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left column: Inputs */}
                <div className="space-y-4 sm:space-y-5 order-last lg:order-first">
                    {/* Length Slider */}
                    <div className="glass-card p-4 sm:p-6">
                        <label htmlFor="length-slider" className="flex items-center gap-2 mb-4 cursor-pointer">
                            <Ruler size={18} className="text-blue-600" />
                            <span className="font-semibold text-slate-900 text-base">Building Length</span>
                        </label>
                        <div className="text-center mb-6">
                            <span className="text-4xl font-black text-slate-900 tabular-nums">
                                {localLength}
                            </span>
                            <span className="text-slate-500 text-lg ml-2">ft</span>
                        </div>
                        <input
                            id="length-slider"
                            type="range"
                            min={10}
                            max={150}
                            step={1}
                            value={localLength}
                            onChange={(e) => setLocalLength(Number(e.target.value))}
                            onPointerUp={() => setBuildingLength(localLength)}
                            onTouchEnd={() => setBuildingLength(localLength)}
                            className="w-full"
                            aria-label="Building Length"
                            style={{ '--slider-pct': `${((localLength - 10) / (150 - 10)) * 100}%` } as React.CSSProperties}
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>10 ft</span>
                            <span>150 ft</span>
                        </div>
                    </div>

                    {/* Width Slider */}
                    <div className="glass-card p-4 sm:p-6">
                        <label htmlFor="width-slider" className="flex items-center gap-2 mb-4 cursor-pointer">
                            <Ruler size={18} className="text-blue-600 rotate-90" />
                            <span className="font-semibold text-slate-900 text-base">Building Width</span>
                        </label>
                        <div className="text-center mb-6">
                            <span className="text-4xl font-black text-slate-900 tabular-nums">
                                {localWidth}
                            </span>
                            <span className="text-slate-500 text-lg ml-2">ft</span>
                        </div>
                        <input
                            id="width-slider"
                            type="range"
                            min={10}
                            max={100}
                            step={1}
                            value={localWidth}
                            onChange={(e) => setLocalWidth(Number(e.target.value))}
                            onPointerUp={() => setBuildingWidth(localWidth)}
                            onTouchEnd={() => setBuildingWidth(localWidth)}
                            className="w-full"
                            aria-label="Building Width"
                            style={{ '--slider-pct': `${((localWidth - 10) / (100 - 10)) * 100}%` } as React.CSSProperties}
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>10 ft</span>
                            <span>100 ft</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                            <span className="text-sm font-semibold text-slate-600">Total Floor Area: {(localLength * localWidth).toLocaleString()} sq ft</span>
                        </div>
                    </div>

                    {/* Footprint Shape Toggle */}
                    <div className="glass-card p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Box size={18} className="text-blue-500" />
                                <span className="font-semibold text-slate-900 text-base">Exterior Footprint</span>
                            </label>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {FOOTPRINT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setFootprintShape(opt.value)}
                                    className={`segment-btn flex flex-col items-center gap-1.5 py-3 ${footprintShape === opt.value ? 'active' : ''
                                        }`}
                                >
                                    <svg viewBox="0 0 16 12" className="w-8 h-6" fill="none" stroke="currentColor" strokeWidth="1">
                                        <path d={opt.svg} className={footprintShape === opt.value ? 'fill-blue-500/20 stroke-blue-500' : 'fill-slate-100 stroke-slate-400'} />
                                    </svg>
                                    <span className="text-sm font-bold">{opt.label}</span>
                                    <span className="text-[10px] opacity-60 uppercase tracking-tighter">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-3 text-center leading-tight">
                            Complex shapes have exponentially more exterior wall surface area than simple rectangles.
                        </p>
                    </div>

                    {/* Ceiling Height Slider */}
                    <div className="glass-card p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <label htmlFor="ceiling-slider" className="flex items-center gap-2 cursor-pointer">
                                <ArrowUpDown size={18} className="text-emerald-600" />
                                <span className="font-semibold text-slate-900 text-base">Baseline Ceiling Height</span>
                            </label>
                            <span className="text-xs text-slate-500">
                                Wall area: {grossWall.toLocaleString()} sq ft
                            </span>
                        </div>
                        <div className="text-center mb-6">
                            <span className="text-4xl font-black text-slate-900 tabular-nums">
                                {localCeiling}
                            </span>
                            <span className="text-slate-500 text-lg ml-2">ft</span>
                        </div>
                        <input
                            id="ceiling-slider"
                            type="range"
                            min={8}
                            max={20}
                            step={1}
                            value={localCeiling}
                            onChange={(e) => setLocalCeiling(Number(e.target.value))}
                            onPointerUp={() => setCeilingHeight(localCeiling)}
                            onTouchEnd={() => setCeilingHeight(localCeiling)}
                            className="w-full"
                            aria-label="Ceiling height"
                            style={{ '--slider-pct': `${((localCeiling - 8) / (20 - 8)) * 100}%` } as React.CSSProperties}
                        />
                        
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <Layers size={18} className="text-amber-500" />
                                    <span className="font-semibold text-slate-900">Vaulted / Gabled Ceiling</span>
                                </label>
                                <button
                                    onClick={() => setIsVaulted(!isVaulted)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isVaulted ? 'bg-amber-500' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isVaulted ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {isVaulted && (
                                <div className="space-y-4 animate-fade-in-up">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 font-medium">Extra Peak Height</span>
                                        <span className="text-amber-600 font-bold">{localVaulted} ft</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={0}
                                        max={20}
                                        step={1}
                                        value={localVaulted}
                                        onChange={(e) => setLocalVaulted(Number(e.target.value))}
                                        onPointerUp={() => setVaultedHeight(localVaulted)}
                                        onTouchEnd={() => setVaultedHeight(localVaulted)}
                                        className="w-full accent-amber-500"
                                        style={{ '--slider-pct': `${(localVaulted / 20) * 100}%` } as React.CSSProperties}
                                    />
                                    <p className="text-[10px] text-slate-400 leading-tight italic">
                                        Adds a triangular prism (gabled volume) to the building for more accurate infiltration math.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>



                    <div className="glass-card p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Layers size={18} className="text-purple-600" />
                            <span className="font-semibold text-slate-900 text-base">Wall Insulation</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2">
                            {WALL_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setWallInsulation(opt.value)}
                                    className={`segment-btn flex flex-col items-center gap-1 py-3 ${wallInsulation === opt.value ? 'active' : ''
                                        }`}
                                >
                                    <span className="text-sm font-bold">{opt.label}</span>
                                    <span className="text-[10px] opacity-60 uppercase tracking-tighter">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Layers size={18} className="text-cyan-600" />
                            <span className="font-semibold text-slate-900 text-base">Roof Insulation</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2">
                            {ROOF_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setRoofInsulation(opt.value)}
                                    className={`segment-btn flex flex-col items-center gap-1 py-3 ${roofInsulation === opt.value ? 'active' : ''
                                        }`}
                                >
                                    <span className="text-sm font-bold">{opt.label}</span>
                                    <span className="text-[10px] opacity-60 uppercase tracking-tighter">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Floor Foundation Toggle */}
                    <div className="glass-card p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Home size={18} className="text-emerald-600" />
                            <span className="font-semibold text-slate-900 text-base">Floor Foundation</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {FLOOR_TYPE_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setFloorType(opt.value)}
                                    className={`segment-btn flex flex-col items-center gap-1 ${floorType === opt.value ? 'active' : ''
                                        }`}
                                >
                                    <span className="text-base font-bold">{opt.label}</span>
                                    <span className="text-xs opacity-60">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Floor Insulation Toggle */}
                    <div className="glass-card p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Layers size={18} className="text-emerald-500" />
                            <span className="font-semibold text-slate-900 text-base">Floor Insulation</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {FLOOR_INSULATION_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setFloorInsulation(opt.value)}
                                    className={`segment-btn flex flex-col items-center gap-1 ${floorInsulation === opt.value ? 'active' : ''
                                        }`}
                                >
                                    <span className="text-base font-bold">{opt.label}</span>
                                    <span className="text-xs opacity-60">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tightness Toggle */}
                    <div className="glass-card p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Wind size={18} className="text-amber-600" />
                            <span className="font-semibold text-slate-900 text-base">Infiltration (Tightness)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {TIGHTNESS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setTightness(opt.value)}
                                    className={`segment-btn flex flex-col items-center gap-1 ${tightness === opt.value ? 'active' : ''
                                        }`}
                                >
                                    <span className="text-base font-bold">{opt.label}</span>
                                    <span className="text-xs opacity-60">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duct Location Toggle */}
                    <div className="glass-card p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <DuctIcon size={18} className="text-indigo-600" />
                            <span className="font-semibold text-slate-900 text-base">Duct Location</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {DUCT_LOCATION_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setDuctLocation(opt.value)}
                                    className={`segment-btn flex flex-col items-center gap-1 ${ductLocation === opt.value ? 'active' : ''
                                        }`}
                                >
                                    <span className="text-base font-bold">{opt.label}</span>
                                    <span className="text-xs opacity-60">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duct Insulation Toggle (Only show if ducts are not in conditioned space) */}
                    {ductLocation !== 'conditioned' && (
                        <div className="glass-card p-4 sm:p-6 animate-fade-in-up">
                            <div className="flex items-center gap-2 mb-4">
                                <ThermometerSnowflake size={18} className="text-blue-500" />
                                <span className="font-semibold text-slate-900 text-base">Duct Insulation</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {DUCT_INSULATION_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setDuctInsulation(opt.value)}
                                        className={`segment-btn flex flex-col items-center gap-1 ${ductInsulation === opt.value ? 'active' : ''
                                            }`}
                                    >
                                        <span className="text-base font-bold">{opt.label}</span>
                                        <span className="text-xs opacity-60">{opt.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column: Interactive 3D House */}
                <div className="flex flex-col items-center justify-center order-first lg:order-last">
                    <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                        Thermal Envelope Preview
                    </h3>
                    <div className="w-full h-[280px] sm:h-[320px] lg:h-[350px] rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                        <ThermalDiagram />
                    </div>
                    <p className="text-xs text-slate-500 mt-3 text-center max-w-xs">
                        Colors react to your insulation selections. Hover for BTU physics.
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between max-w-3xl mx-auto mt-8">
                <button onClick={prevStep} className="btn-secondary">
                    <ChevronLeft size={18} />
                    Back
                </button>
                <button onClick={nextStep} className="btn-primary text-lg px-8">
                    Continue
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
