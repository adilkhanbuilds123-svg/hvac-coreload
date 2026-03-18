import { useState, useMemo, useRef, useEffect } from 'react';
import { useHVACStore } from '../../store';
import { CLIMATE_DATABASE, type ClimateRecord } from '../../lib/climate-data';
import {
    Search,
    MapPin,
    Snowflake,
    Sun,
    ChevronRight,
    ToggleLeft,
    ToggleRight,
    Thermometer,
    PenLine,
    Droplets,
} from 'lucide-react';

export default function LocationStep() {
    const selectedCity = useHVACStore(state => state.selectedCity);
    const selectedState = useHVACStore(state => state.selectedState);
    const winterDesign = useHVACStore(state => state.winterDesign);
    const summerDesign = useHVACStore(state => state.summerDesign);
    const latentGrains = useHVACStore(state => state.latentGrains);
    const useCustomTemps = useHVACStore(state => state.useCustomTemps);
    const setLocation = useHVACStore(state => state.setLocation);
    const setWinterDesign = useHVACStore(state => state.setWinterDesign);
    const setSummerDesign = useHVACStore(state => state.setSummerDesign);
    const heatingSetpoint = useHVACStore(state => state.heatingSetpoint);
    const coolingSetpoint = useHVACStore(state => state.coolingSetpoint);
    const setHeatingSetpoint = useHVACStore(state => state.setHeatingSetpoint);
    const setCoolingSetpoint = useHVACStore(state => state.setCoolingSetpoint);
    const setLatentGrains = useHVACStore(state => state.setLatentGrains);
    const setUseCustomTemps = useHVACStore(state => state.setUseCustomTemps);
    const nextStep = useHVACStore(state => state.nextStep);

    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightIdx, setHighlightIdx] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Local State for Fast Typing (Prevents Zustand localStorage lag)
    const [localWinterDesign, setLocalWinterDesign] = useState(winterDesign.toString());
    const [localSummerDesign, setLocalSummerDesign] = useState(summerDesign.toString());
    const [localHeatingSetpoint, setLocalHeatingSetpoint] = useState(heatingSetpoint.toString());
    const [localCoolingSetpoint, setLocalCoolingSetpoint] = useState(coolingSetpoint.toString());
    const [localLatentGrains, setLocalLatentGrains] = useState(latentGrains.toString());

    // Sync from global store if it changes externally
    // eslint-disable-next-line
    useEffect(() => setLocalWinterDesign(winterDesign.toString()), [winterDesign]);
    // eslint-disable-next-line
    useEffect(() => setLocalSummerDesign(summerDesign.toString()), [summerDesign]);
    // eslint-disable-next-line
    useEffect(() => setLocalHeatingSetpoint(heatingSetpoint.toString()), [heatingSetpoint]);
    // eslint-disable-next-line
    useEffect(() => setLocalCoolingSetpoint(coolingSetpoint.toString()), [coolingSetpoint]);
    // eslint-disable-next-line
    useEffect(() => setLocalLatentGrains(latentGrains.toString()), [latentGrains]);

    // Filter the database
    const filtered = useMemo(() => {
        if (!query.trim()) return CLIMATE_DATABASE;
        const q = query.toLowerCase().replace(/[^a-z0-9]/g, '');
        return CLIMATE_DATABASE.filter(
            (r) => {
                const combined = `${r.city}${r.state}`.toLowerCase().replace(/[^a-z0-9]/g, '');
                return combined.includes(q);
            }
        );
    }, [query]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (highlightIdx >= 0 && listRef.current) {
            const el = listRef.current.children[highlightIdx] as HTMLElement;
            el?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightIdx]);

    const selectRecord = (record: ClimateRecord) => {
        setLocation(record.city, record.state, record.winterDesign, record.summerDesign, record.latentGrains, record.elevation || 0);
        setQuery(`${record.city}, ${record.state}`);
        setIsOpen(false);
        setHighlightIdx(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightIdx((prev) => Math.min(prev + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightIdx((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && highlightIdx >= 0 && filtered[highlightIdx]) {
            e.preventDefault();
            selectRecord(filtered[highlightIdx]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleToggleCustom = () => {
        const next = !useCustomTemps;
        setUseCustomTemps(next);
        if (next) {
            // Clear city selection when switching to manual
            setQuery('');
        }
    };

    const hasSelection = selectedCity.length > 0 || useCustomTemps;

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                    <MapPin size={14} />
                    Step 1: Location
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    Set Design Temperatures
                </h2>
                <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto">
                    Search our ACCA database for your city's 99% heating and 1% cooling design temperatures,
                    or enter custom values for unlisted locations.
                </p>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
                {/* ── Toggle: Database vs Manual ──────────────────────── */}
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={handleToggleCustom}
                        className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl
              glass-card glass-card-hover transition-all duration-300 outline-none text-sm font-semibold"
                    >
                        {useCustomTemps ? (
                            <ToggleRight size={22} className="text-amber-600" />
                        ) : (
                            <ToggleLeft size={22} className="text-slate-500" />
                        )}
                        <span className={useCustomTemps ? 'text-amber-600' : 'text-slate-600'}>
                            {useCustomTemps
                                ? "Using custom design temps"
                                : "Can't find your city? Enter custom temps"}
                        </span>
                    </button>
                </div>

                {/* ── Mode A: Autocomplete Search ────────────────────── */}
                {!useCustomTemps && (
                    <div className="space-y-4">
                        {/* Search Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Search size={20} className="text-slate-400" />
                            </div>
                            <label htmlFor="location-search" className="sr-only">Search city or state</label>
                            <input
                                id="location-search"
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setIsOpen(true);
                                    setHighlightIdx(-1);
                                }}
                                onFocus={() => setIsOpen(true)}
                                onBlur={(e) => {
                                    // Only close if the blur target is NOT inside the dropdown
                                    const related = e.relatedTarget as HTMLElement | null;
                                    if (!related || !e.currentTarget.parentElement?.contains(related)) {
                                        setTimeout(() => setIsOpen(false), 150);
                                    }
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Search city or state, or scroll to browse…"
                                className="w-full pl-12 pr-4 py-4 rounded-xl glass-card text-slate-900 text-lg
                  placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500/20
                  transition-all duration-200 border border-transparent focus:border-blue-400"
                                aria-label="Search city"
                                autoComplete="off"
                            />

                            {/* Dropdown */}
                            {isOpen && filtered.length > 0 && (
                                <ul
                                    ref={listRef}
                                    className="absolute z-50 mt-2 w-full max-h-80 overflow-y-auto rounded-xl bg-white
                    border border-slate-200 shadow-xl shadow-slate-200/50"
                                    role="listbox"
                                    style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
                                >
                                    <li className="sticky top-0 z-10 bg-slate-50 px-5 py-2 text-xs text-slate-400 font-medium border-b border-slate-200">
                                        {filtered.length} {filtered.length === 1 ? 'city' : 'cities'} — scroll to browse
                                    </li>
                                    {filtered.map((record, idx) => (
                                        <li
                                            key={`${record.city}-${record.state}`}
                                            role="option"
                                            aria-selected={highlightIdx === idx}
                                            onClick={() => selectRecord(record)}
                                            className={`
                        px-4 py-3 cursor-pointer
                        transition-colors duration-100 border-b border-slate-100 last:border-b-0
                        ${highlightIdx === idx
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                                }
                      `}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <MapPin size={14} className="text-slate-500 shrink-0" />
                                                <span className="font-semibold truncate">{record.city}</span>
                                                <span className="text-slate-500 text-sm shrink-0">{record.state}</span>
                                            </div>
                                            <div className="flex gap-3 text-xs pl-6">
                                                <span className="flex items-center gap-1 text-blue-500">
                                                    <Snowflake size={10} />
                                                    {record.winterDesign}°F
                                                </span>
                                                <span className="flex items-center gap-1 text-amber-500">
                                                    <Sun size={10} />
                                                    {record.summerDesign}°F
                                                </span>
                                                <span className="flex items-center gap-1 text-emerald-500">
                                                    <Droplets size={10} />
                                                    {record.latentGrains} gr
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {isOpen && filtered.length === 0 && query.trim() && (
                                <div className="absolute z-50 mt-2 w-full rounded-xl glass-card border border-slate-200
                  shadow-xl shadow-slate-200/50 px-5 py-4 text-center text-slate-500 text-sm">
                                    No matching cities. Try the custom temp override below.
                                </div>
                            )}
                        </div>

                        {/* Selection Confirmation */}
                        {selectedCity && !useCustomTemps && (
                            <div className="glass-card p-5 border border-emerald-200 bg-emerald-50 animate-fade-in-up">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                        <MapPin size={16} className="text-emerald-600" />
                                    </div>
                                    <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
                                        Location Set
                                    </span>
                                </div>
                                <p className="text-xl font-bold text-slate-900 mb-2">
                                    {selectedCity}, {selectedState}
                                </p>
                                <div className="flex gap-6 text-sm">
                                    <span className="flex items-center gap-2 text-blue-600">
                                        <Snowflake size={14} />
                                        Winter: <strong>{winterDesign}°F</strong>
                                    </span>
                                    <span className="flex items-center gap-2 text-amber-600">
                                        <Sun size={14} />
                                        Summer: <strong>{summerDesign}°F</strong>
                                    </span>
                                    <span className="flex items-center gap-2 text-emerald-600">
                                        <Droplets size={14} />
                                        Moisture: <strong>{latentGrains} gr</strong>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Mode B: Manual Override ────────────────────────── */}
                {useCustomTemps && (
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="glass-card p-5 border border-amber-200 bg-amber-50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <PenLine size={16} className="text-amber-600" />
                                </div>
                                <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
                                    Custom Design Temperatures
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-5">
                                Enter your local 99% heating and 1% cooling design temperatures.
                                Check ACCA Manual J or ASHRAE Fundamentals for your area.
                            </p>

                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Winter Design Temp */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                                        <Snowflake size={14} />
                                        Winter Design Temp (°F)
                                    </label>
                                    <div className="relative">
                                        <Thermometer size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
                                        <input
                                            type="number"
                                            value={localWinterDesign}
                                            onChange={(e) => setLocalWinterDesign(e.target.value)}
                                            onBlur={() => setWinterDesign(Number(localWinterDesign))}
                                            min={-60}
                                            max={80}
                                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-slate-200
                        text-slate-900 text-2xl font-bold text-center outline-none
                        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300
                        transition-all duration-200
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            aria-label="Winter design temperature"
                                        />
                                    </div>
                                </div>

                                {/* Summer Design Temp */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-amber-600">
                                        <Sun size={14} />
                                        Summer Design Temp (°F)
                                    </label>
                                    <div className="relative">
                                        <Thermometer size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
                                        <input
                                            type="number"
                                            value={localSummerDesign}
                                            onChange={(e) => setLocalSummerDesign(e.target.value)}
                                            onBlur={() => setSummerDesign(Number(localSummerDesign))}
                                            min={60}
                                            max={130}
                                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-slate-200
                        text-slate-900 text-2xl font-bold text-center outline-none
                        focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300
                        transition-all duration-200
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            aria-label="Summer design temperature"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                {/* Heating Setpoint */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Thermometer size={14} className="text-blue-400" />
                                        Indoor Heating Setpoint
                                    </label>
                                    <input
                                        type="number"
                                        value={localHeatingSetpoint}
                                        onChange={(e) => setLocalHeatingSetpoint(e.target.value)}
                                        onBlur={() => setHeatingSetpoint(Number(localHeatingSetpoint))}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-center outline-none"
                                    />
                                </div>

                                {/* Cooling Setpoint */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Thermometer size={14} className="text-amber-400" />
                                        Indoor Cooling Setpoint
                                    </label>
                                    <input
                                        type="number"
                                        value={localCoolingSetpoint}
                                        onChange={(e) => setLocalCoolingSetpoint(e.target.value)}
                                        onBlur={() => setCoolingSetpoint(Number(localCoolingSetpoint))}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-center outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                {/* Latent Grains */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                                        <Droplets size={14} />
                                        Latent Moisture (Gr)
                                    </label>
                                    <div className="relative">
                                        <Droplets size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />
                                        <input
                                            type="number"
                                            value={localLatentGrains}
                                            onChange={(e) => setLocalLatentGrains(e.target.value)}
                                            onBlur={() => setLatentGrains(Number(localLatentGrains))}
                                            min={-20}
                                            max={150}
                                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-slate-200
                        text-slate-900 text-2xl font-bold text-center outline-none
                        focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300
                        transition-all duration-200
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            aria-label="Latent grains difference"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Live confirmation for manual */}
                        <div className="glass-card p-4 text-center">
                            <p className="text-sm text-slate-600 flex flex-wrap justify-center gap-4">
                                <span>Indoor Target: <strong className="text-slate-900">{heatingSetpoint}/{coolingSetpoint}°F</strong></span>
                                <span className="hidden sm:inline text-slate-300">|</span>
                                <span>ΔT Heating: <strong className="text-blue-600">{heatingSetpoint - winterDesign}°F</strong></span>
                                <span className="hidden sm:inline text-slate-300">|</span>
                                <span>ΔT Cooling: <strong className="text-amber-600">{summerDesign - coolingSetpoint}°F</strong></span>
                                <span className="hidden sm:inline text-slate-300">|</span>
                                <span>Moisture Load: <strong className="text-emerald-600">{latentGrains} gr</strong></span>
                            </p>
                        </div>
                    </div>
                )}

                {/* Continue Button */}
                <div className="flex justify-center pt-4">
                    <button
                        onClick={nextStep}
                        disabled={!hasSelection}
                        className={`btn-primary text-lg px-10 ${!hasSelection ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                    >
                        Continue
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
