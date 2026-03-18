import { useState, useEffect } from 'react';
import { useHVACStore } from '../../store';
import { calculateTotalLoad, type WindowType, type HVACResults } from '../../lib/hvac-math';
import {
    PanelTop,
    ChevronLeft,
    ChevronRight,
    Snowflake,
    Sun,
    Gauge,
    Compass,
    Users,
    PlugZap,
    Minus,
    Plus,
} from 'lucide-react';
import type { ApplianceLoad } from '../../lib/hvac-math';

const WINDOW_OPTIONS: { value: WindowType; label: string; desc: string }[] = [
    { value: 'single', label: 'Single', desc: '1 pane' },
    { value: 'double', label: 'Double', desc: '2 panes' },
    { value: 'triple', label: 'Triple', desc: '3 panes' },
];

const APPLIANCE_OPTIONS: { value: ApplianceLoad; label: string; desc: string }[] = [
    { value: 'standard', label: 'Standard', desc: 'Typical home' },
    { value: 'heavy', label: 'Heavy', desc: '+PCs, extra' },
];

export default function WindowsStep() {
    const {
        winterDesign,
        summerDesign,
        elevation,
        heatingSetpoint,
        coolingSetpoint,
        buildingLength,
        buildingWidth,
        ceilingHeight,
        isVaulted,
        vaultedHeight,
        wallInsulation,
        roofInsulation,
        floorType,
        floorInsulation,
        footprintShape,
        windowAreaNorth,
        windowAreaSouth,
        windowAreaEast,
        windowAreaWest,
        setWindowArea,
        windowType,
        setWindowType,
        tightness,
        latentGrains,
        occupants,
        setOccupants,
        applianceLoad,
        setApplianceLoad,
        ductLocation,
        ductInsulation,
        nextStep,
        prevStep,
    } = useHVACStore();

    const [isHomeownerMode, setIsHomeownerMode] = useState(true);
    const [windowCounts, setWindowCounts] = useState({ North: 0, South: 0, East: 0, West: 0 });
    const [windowSize, setWindowSize] = useState<'small' | 'med' | 'large'>('med');

    const SIZE_MAP = { small: 12, med: 15, large: 24 };

    useEffect(() => {
        if (isHomeownerMode) {
            setWindowArea('North', windowCounts.North * SIZE_MAP[windowSize]);
            setWindowArea('South', windowCounts.South * SIZE_MAP[windowSize]);
            setWindowArea('East', windowCounts.East * SIZE_MAP[windowSize]);
            setWindowArea('West', windowCounts.West * SIZE_MAP[windowSize]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [windowCounts, windowSize, isHomeownerMode]);

    // Dynamic max capping
    const totalWindowArea = windowAreaNorth + windowAreaSouth + windowAreaEast + windowAreaWest;
    const maxWindowArea = Math.round((buildingLength * buildingWidth) * 0.25); // Hard cap at 25% of floor area

    const results: HVACResults = calculateTotalLoad({
        winterDesign,
        summerDesign,
        elevation,
        heatingSetpoint,
        coolingSetpoint,
        buildingLength,
        buildingWidth,
        ceilingHeight,
        wallInsulation,
        roofInsulation,
        floorType,
        floorInsulation,
        footprintShape,
        windowAreaNorth,
        windowAreaSouth,
        windowAreaEast,
        windowAreaWest,
        windowType,
        tightness,
        latentGrains,
        occupants,
        applianceLoad,
        distanceToDucts: 25,
        ductLocation,
        ductInsulation,
        isVaulted,
        vaultedHeight,
    });

    const renderStepper = (dir: 'North' | 'South' | 'East' | 'West', value: number, emoji: string) => {
        if (isHomeownerMode) {
            const count = windowCounts[dir];
            const handleMinus = () => setWindowCounts(prev => ({ ...prev, [dir]: Math.max(0, count - 1) }));
            const handlePlus = () => setWindowCounts(prev => ({ ...prev, [dir]: count + 1 }));

            return (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 w-24">
                        <span className="text-xl">{emoji}</span>
                        <span className="font-bold text-slate-700">{dir}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleMinus} className="w-10 h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600 shadow-sm"><Minus size={18} /></button>
                        <div className="w-12 text-center"><span className="text-xl font-black text-slate-900 tabular-nums">{count}</span></div>
                        <button onClick={handlePlus} className="w-10 h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600 shadow-sm"><Plus size={18} /></button>
                    </div>
                </div>
            );
        }

        const handleMinus = () => setWindowArea(dir, Math.max(0, value - 5));
        const handlePlus = () => {
            if (totalWindowArea + 5 <= maxWindowArea) {
                setWindowArea(dir, value + 5);
            }
        };

        return (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 w-24">
                    <span className="text-xl">{emoji}</span>
                    <span className="font-bold text-slate-700">{dir}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleMinus}
                        className="w-10 h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-sm"
                        aria-label={`Decrease ${dir} window area`}
                    >
                        <Minus size={18} />
                    </button>
                    <div className="w-16 text-center">
                        <span className="text-xl font-black text-slate-900 tabular-nums">{value}</span>
                    </div>
                    <button
                        onClick={handlePlus}
                        className={`w-10 h-10 rounded-lg bg-white border flex items-center justify-center transition-colors shadow-sm ${totalWindowArea + 5 > maxWindowArea ? 'border-red-200 text-red-300 cursor-not-allowed bg-red-50/50' : 'border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400'}`}
                        disabled={totalWindowArea + 5 > maxWindowArea}
                        aria-label={`Increase ${dir} window area`}
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in-up pb-12">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-sm font-medium mb-4">
                    <PanelTop size={14} />
                    Step 3: Engineering Loads
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    Windows & Internal Gains
                </h2>
                <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
                    Solar Heat Gain (SHGC) varies massively by compass direction. Enter precise window areas for an accurate Manual J block load.
                </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="space-y-5">

                    {/* Directional Windows UI */}
                    <div className="glass-card p-6 border-l-4 border-l-amber-500">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Compass size={18} className="text-amber-600" />
                                <span className="font-semibold text-slate-900 text-base">Window Orientations</span>
                            </div>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setIsHomeownerMode(true)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${isHomeownerMode ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                                >
                                    Homeowner
                                </button>
                                <button
                                    onClick={() => setIsHomeownerMode(false)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${!isHomeownerMode ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                                >
                                    Pro
                                </button>
                            </div>
                        </div>

                        {isHomeownerMode && (
                            <div className="mb-6 animate-fade-in-up">
                                <label className="block text-sm font-semibold text-slate-600 mb-3">Approx. Window Size</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['small', 'med', 'large'] as const).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setWindowSize(s)}
                                            className={`py-2 px-1 rounded-lg border text-xs font-bold transition-all ${windowSize === s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                                        >
                                            {s.toUpperCase()} <br /> <span className="opacity-70 font-normal">{SIZE_MAP[s]} sqft</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {renderStepper('North', windowAreaNorth, '⬆️')}
                            {renderStepper('South', windowAreaSouth, '⬇️')}
                            {renderStepper('East', windowAreaEast, '➡️')}
                            {renderStepper('West', windowAreaWest, '⬅️')}
                        </div>
                    </div>

                    {/* Window Type Toggle */}
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <PanelTop size={18} className="text-blue-600" />
                            <span className="font-semibold text-slate-900 text-base">Window Glazing</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {WINDOW_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setWindowType(opt.value)}
                                    className={`segment-btn flex flex-col items-center justify-center gap-1 py-4 ${windowType === opt.value ? 'active ring-2 ring-blue-500' : ''
                                        }`}
                                >
                                    <span className="text-base font-bold">{opt.label}</span>
                                    <span className="text-xs opacity-60">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Occupants Stepper */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Users size={18} className="text-emerald-600" />
                                <span className="font-semibold text-slate-900 text-base">Occupants</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-between">
                                <button
                                    onClick={() => setOccupants(Math.max(1, occupants - 1))}
                                    className="w-12 h-12 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
                                    aria-label="Decrease occupants"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="text-2xl font-black text-slate-900 tabular-nums">{occupants}</span>
                                <button
                                    onClick={() => setOccupants(Math.min(15, occupants + 1))}
                                    className="w-12 h-12 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
                                    aria-label="Increase occupants"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Appliance Load Toggle */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <PlugZap size={18} className="text-pink-600" />
                                <span className="font-semibold text-slate-900 text-base">Appliance Load</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {APPLIANCE_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setApplianceLoad(opt.value)}
                                        className={`segment-btn text-left px-4 py-3 flex justify-between items-center ${applianceLoad === opt.value ? 'active ring-2 ring-pink-500' : ''}`}
                                    >
                                        <span className="font-bold">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Preview (Sticky on desktop) */}
                <div className="lg:sticky lg:top-8 h-fit">
                    <div className="glass-card p-6 shadow-xl shadow-slate-200/50">
                        <h3 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-wider text-center border-b border-slate-100 pb-4">
                            Live Tonnage Estimate
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                        <Snowflake size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Heating</p>
                                        <p className="text-xl font-bold text-slate-900 tabular-nums">
                                            {results.heatingBTU.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-400">BTU/hr</span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                        <Sun size={20} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Cooling</p>
                                        <p className="text-xl font-bold text-slate-900 tabular-nums">
                                            {results.coolingBTU.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-400">BTU/hr</span>
                            </div>

                            <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200 shadow-inner mt-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                        <Gauge size={24} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-purple-700 uppercase tracking-widest">System Size</p>
                                        <p className="text-3xl font-black text-slate-900 tabular-nums">
                                            {results.tonnage}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-purple-800 uppercase tracking-wider">Tons</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between max-w-4xl mx-auto mt-8">
                <button onClick={prevStep} className="btn-secondary px-6">
                    <ChevronLeft size={18} />
                    Back
                </button>
                <button onClick={nextStep} className="btn-primary text-lg px-8 shadow-lg shadow-blue-500/30">
                    Calculate Final Results
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
