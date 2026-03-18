import { useHVACStore, type HVACState } from '../store';
import { useProjectStore } from '../projectStore';
import { calculateTotalLoad, type HVACResults, WALL_R_VALUES, rValueToUValue } from '../lib/hvac-math';
import HouseVisualizer from './HouseVisualizer';
import RecommendationEngine from './RecommendationEngine';
import { CoreLoadLogo } from './branding/CoreLoadLogo';
import {
    Link2,
    RotateCcw,
    CheckCircle2,
    Printer,
    Check,
    Activity,
    Gauge,
} from 'lucide-react';
import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';



/* ═══════════════════════════════════════════════════════════════
   DARK TOOLTIP for Recharts
   ═══════════════════════════════════════════════════════════════ */
const darkTooltipStyle = {
    background: '#09090b',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 700,
    padding: '8px 12px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
};

/* ═══════════════════════════════════════════════════════════════
   MAIN RESULTS PANEL — Climatix Dark Dashboard
   ═══════════════════════════════════════════════════════════════ */
export default function ResultsPanel() {
    const winterDesign = useHVACStore(state => state.winterDesign);
    const summerDesign = useHVACStore(state => state.summerDesign);
    const latentGrains = useHVACStore(state => state.latentGrains);
    const buildingLength = useHVACStore(state => state.buildingLength);
    const buildingWidth = useHVACStore(state => state.buildingWidth);
    const ceilingHeight = useHVACStore(state => state.ceilingHeight);
    const isVaulted = useHVACStore(state => state.isVaulted);
    const vaultedHeight = useHVACStore(state => state.vaultedHeight);
    const wallInsulation = useHVACStore(state => state.wallInsulation);
    const roofInsulation = useHVACStore(state => state.roofInsulation);
    const windowAreaNorth = useHVACStore(state => state.windowAreaNorth);
    const windowAreaSouth = useHVACStore(state => state.windowAreaSouth);
    const windowAreaEast = useHVACStore(state => state.windowAreaEast);
    const windowAreaWest = useHVACStore(state => state.windowAreaWest);
    const windowType = useHVACStore(state => state.windowType);
    const tightness = useHVACStore(state => state.tightness);
    const occupants = useHVACStore(state => state.occupants);
    const applianceLoad = useHVACStore(state => state.applianceLoad);
    const ductLocation = useHVACStore(state => state.ductLocation);
    const ductInsulation = useHVACStore(state => state.ductInsulation);
    const elevation = useHVACStore(state => state.elevation);
    const heatingSetpoint = useHVACStore(state => state.heatingSetpoint);
    const coolingSetpoint = useHVACStore(state => state.coolingSetpoint);
    const floorType = useHVACStore(state => state.floorType);
    const floorInsulation = useHVACStore(state => state.floorInsulation);
    const footprintShape = useHVACStore(state => state.footprintShape);
    const avgUtilityRate = useHVACStore(state => state.avgUtilityRate);
    
    const selectedCity = useHVACStore(state => state.selectedCity);
    const selectedState = useHVACStore(state => state.selectedState);
    const generateShareURL = useHVACStore(state => state.generateShareURL);
    const setCurrentStep = useHVACStore(state => state.setCurrentStep);

    const fullStoreSnapshot = useHVACStore(state => state);
    const projectCount = useProjectStore(state => state.projects.length);
    const saveProject = useProjectStore(state => state.saveProject);
    const [copied, setCopied] = useState(false);
    const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
    const [showMath, setShowMath] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const results: HVACResults = calculateTotalLoad({
        winterDesign, summerDesign, elevation, heatingSetpoint, coolingSetpoint,
        buildingLength, buildingWidth, ceilingHeight, wallInsulation, roofInsulation,
        floorType, floorInsulation, footprintShape, windowAreaNorth, windowAreaSouth, windowAreaEast,
        windowAreaWest, windowType, tightness, latentGrains, occupants, applianceLoad,
        distanceToDucts: 25, ductLocation, ductInsulation, isVaulted, vaultedHeight,
    });

    const locationLabel = selectedCity
        ? `${selectedCity}, ${selectedState}`
        : `Custom (${winterDesign}°F / ${summerDesign}°F)`;

    const handleSave = () => { setIsSaving(true); saveProject(undefined, fullStoreSnapshot); setTimeout(() => setIsSaving(false), 1500); };
    const handleCopyLink = async () => {
        const url = generateShareURL();
        try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500); }
        catch { alert('Failed to copy to clipboard.'); }
    };
    const handlePrint = () => { window.print(); };
    const handleReset = () => { setCurrentStep(0); };

    // --- Energy Cost Projection ---
    const heatingHours = Math.max(500, (65 - winterDesign) * 40);
    const coolingHours = Math.max(400, (summerDesign - 75) * 50);
    const estHeatingKWh = (results.heatingBTU * heatingHours) / (9 * 3412);
    const estCoolingKWh = (results.coolingBTU * coolingHours) / (16 * 1000);
    const annualCost = (estHeatingKWh + estCoolingKWh) * avgUtilityRate;

    // --- Chart Data ---
    const breakdownData = [
        { name: 'Walls', heating: results.wallHeatLoss, cooling: results.wallHeatGain },
        { name: 'Roof', heating: results.roofHeatLoss, cooling: results.roofHeatGain },
        { name: 'Floor', heating: results.floorLoss, cooling: results.floorGain },
        { name: 'Windows', heating: results.windowHeatLoss, cooling: results.windowHeatGain },
        { name: 'Infil.', heating: results.infiltrationHeating, cooling: results.infiltrationCoolingSensible + results.infiltrationCoolingLatent },
        { name: 'Internal', heating: 0, cooling: results.internalSensible + results.internalLatent },
        { name: 'Ducts', heating: results.ductLossHeating, cooling: results.ductLossCoolingSensible + results.ductLossCoolingLatent },
    ];



    // Monthly energy model (simplified degree-day)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const heatingWeights = [1.0, 0.9, 0.7, 0.3, 0.05, 0, 0, 0, 0, 0.2, 0.6, 0.95];
    const coolingWeights = [0, 0, 0.05, 0.15, 0.5, 0.85, 1.0, 0.95, 0.7, 0.3, 0.05, 0];
    const monthlyData = months.map((m, i) => ({
        name: m,
        heating: Math.round((estHeatingKWh * avgUtilityRate * heatingWeights[i]) / 1.5),
        cooling: Math.round((estCoolingKWh * avgUtilityRate * coolingWeights[i]) / 1.5),
    }));

    // Equipment recommendation
    const equipmentRecs = [
        { brand: 'High SEER', model: `${results.tonnage}T Variable`, seer: '20+', capacity: `${results.tonnage} ton`, fit: 'Premium' },
        { brand: 'Mid Range', model: `${results.tonnage}T Two-Stage`, seer: '16-18', capacity: `${results.tonnage} ton`, fit: 'Optimal' },
        { brand: 'Budget', model: `${results.tonnage}T Single`, seer: '14-15', capacity: `${results.tonnage} ton`, fit: 'Adequate' },
    ];

    // ROI Calculation
    const equipmentCost = results.tonnage * 2800; // ~$2800/ton average installed
    const paybackYears = annualCost > 0 ? (equipmentCost / annualCost) : 0;
    const tenYearSavings = annualCost * 10 * 0.15; // 15% efficiency gain over 10yrs

    return (
        <div className="animate-fade-in-up pb-20 sm:pb-0 overflow-x-hidden" id="results-panel">
            {/* Print-only inputs table Header with Branding */}
            <div className="print-header hidden mb-8">
                <div className="flex items-center justify-between mb-2">
                    <CoreLoadLogo className="h-10" variant="dark" />
                    <div className="text-right text-sm">
                        <strong className="block text-brand-navy">CoreLoad SaaS</strong>
                        <span className="text-slate-500 block">Precision Sizing For Modern Builds</span>
                        <span className="text-slate-400 block mt-1 text-xs">Date: {new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Print-only inputs table */}
            <div className="print-inputs-table">
                <h3>Calculation Inputs (Block Load)</h3>
                <table>
                    <tbody>
                        <tr><td>Report Type</td><td>Whole-House Block Load</td></tr>
                        <tr><td>Location</td><td>{locationLabel}</td></tr>
                        <tr><td>Winter Design Temp</td><td>{winterDesign}°F</td></tr>
                        <tr><td>Summer Design Temp</td><td>{summerDesign}°F</td></tr>
                        <tr><td>Building Dimensions</td><td>{buildingLength}ft × {buildingWidth}ft ({(buildingLength * buildingWidth).toLocaleString()} sq ft)</td></tr>
                        <tr><td>Ceiling Height</td><td>{ceilingHeight} ft</td></tr>
                        <tr><td>Envelope Tightness</td><td>{tightness}</td></tr>
                        <tr><td>Wall Insulation</td><td>{wallInsulation}</td></tr>
                        <tr><td>Roof Insulation</td><td>{roofInsulation}</td></tr>
                        <tr><td>Window Area (N/S/E/W)</td><td>{windowAreaNorth} / {windowAreaSouth} / {windowAreaEast} / {windowAreaWest} sq ft</td></tr>
                        <tr><td>Window Type</td><td>{windowType} pane</td></tr>
                        <tr><td>Occupants</td><td>{occupants}</td></tr>
                        <tr><td>Appliance Load</td><td>{applianceLoad}</td></tr>
                        <tr><td>Duct Location</td><td>{ductLocation}</td></tr>
                        <tr><td>Duct Insulation</td><td>{ductInsulation}</td></tr>
                    </tbody>
                </table>
            </div>

            {/* ═══════════════════════════════════════════════════
                DARK CLIMATIX DASHBOARD
               ═══════════════════════════════════════════════════ */}
            {/* ═══════════════════════════════════════════════════
                DARK CLIMATIX DASHBOARD
               ═══════════════════════════════════════════════════ */}
            <div className="bg-[#0c1220] rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.04]">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-3 no-print">
                            <CheckCircle2 size={12} />
                            Analysis Complete
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            Block Load Report
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">{locationLabel}</p>
                    </div>
                </div>

                {!disclaimerAccepted ? (
                    <div className="max-w-xl mx-auto py-12 text-center">
                        <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <Activity size={28} className="text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Engineering Disclaimer</h3>
                        <p className="text-slate-400 mb-8 leading-relaxed font-medium text-sm">
                            This report provides a <strong className="text-white">Whole-House Block Load Estimation</strong>. 
                            It is optimized for total tonnage selection and is not a room-by-room Manual J report.
                        </p>
                        <label className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-colors text-left mb-8">
                            <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-700 text-brand-blue focus:ring-brand-blue bg-slate-900" onChange={(e) => setDisclaimerAccepted(e.target.checked)} />
                            <span className="text-sm font-bold text-slate-300 leading-tight">
                                I confirm these results are block-load estimations and I assume all responsibility for equipment selection.
                            </span>
                        </label>
                        <button
                            onClick={() => undefined}
                            disabled={!disclaimerAccepted}
                            className={`w-full py-4 rounded-xl font-black text-base transition-all ${disclaimerAccepted ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20 hover:bg-blue-600' : 'bg-white/[0.03] text-slate-600 cursor-not-allowed'}`}
                        >
                            Review Final Report
                        </button>
                    </div>
                ) : (
                    <>
                        {/* ═══════ ROW 1: System Status & Equipment Table ═══════ */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            {/* System Status */}
                            <div className="climatix-card rounded-2xl p-5 bento-card hover-glow" style={{ '--stagger': 1 } as React.CSSProperties}>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xs font-bold text-white tracking-wide">System Status</h3>
                                    <Activity size={14} className="text-slate-500" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
                                        <span className="text-[13px] font-medium text-slate-400">Active Projects</span>
                                        <span className="text-white font-bold">{projectCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
                                        <span className="text-[13px] font-medium text-slate-400">Loads</span>
                                        <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs"><CheckCircle2 size={14}/> Optimized</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-1">
                                        <span className="text-[13px] font-medium text-slate-400">Equipment</span>
                                        <span className="text-blue-400 font-bold flex items-center gap-1.5 text-xs"><Link2 size={14}/> Selected</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Equipment Table */}
                            <div className="md:col-span-2 lg:col-span-2 climatix-card rounded-2xl p-5 bento-card hover-glow" style={{ '--stagger': 2 } as React.CSSProperties}>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xs font-bold text-white tracking-wide">Equipment Selection</h3>
                                    <div className="flex gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                                        <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                                        <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                                        <thead>
                                            <tr className="border-b border-white/[0.06] text-slate-500 text-xs">
                                                <th className="pb-3 font-medium px-2">Brand</th>
                                                <th className="pb-3 font-medium px-2">Model</th>
                                                <th className="pb-3 font-medium px-2">Capacity</th>
                                                <th className="pb-3 font-medium px-2">Efficiency</th>
                                                <th className="pb-3 font-medium text-right px-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.02]">
                                            {equipmentRecs.map((eq, i) => (
                                                <tr key={i} className="text-slate-300">
                                                    <td className="py-3.5 font-bold text-white px-2">{eq.brand}</td>
                                                    <td className="py-3.5 text-slate-400 text-xs px-2">{eq.model}</td>
                                                    <td className="py-3.5 px-2">{eq.capacity}</td>
                                                    <td className="py-3.5 px-2 text-slate-400">{eq.seer} SEER</td>
                                                    <td className="py-3.5 text-right px-2">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${i === 1 ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20' : 'text-slate-500 bg-white/[0.02]'}`}>
                                                            {i === 1 ? 'Specified' : 'Alternative'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* ═══════ ROW 2: Hero Visualizer + Project Summary ═══════ */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <div className="md:col-span-2 lg:col-span-2 climatix-card rounded-2xl p-6 relative overflow-hidden bento-card hover-glow flex flex-col items-center justify-center min-h-[320px]" style={{ '--stagger': 3 } as React.CSSProperties}>
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-900/[0.08] to-transparent pointer-events-none"></div>
                                <div className="absolute top-5 left-6 text-left z-10">
                                    <h3 className="text-sm font-bold text-white tracking-wide">Residence Load Profile</h3>
                                    <p className="text-xs text-slate-500 mt-1">Heat load zones & thermal envelope</p>
                                </div>
                                <div className="w-full max-w-sm mt-8 relative z-0">
                                    <HouseVisualizer wallInsulation={wallInsulation} roofInsulation={roofInsulation} />
                                </div>
                            </div>

                            <div className="climatix-card rounded-2xl p-5 flex flex-col bento-card hover-glow" style={{ '--stagger': 4 } as React.CSSProperties}>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xs font-bold text-white tracking-wide truncate pr-4">Project: {locationLabel.split(',')[0]}</h3>
                                    <div className="flex gap-1.5 shrink-0">
                                        <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                                        <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                                        <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-blue-500 p-5 mb-3 shadow-[0_8px_30px_rgba(59,130,246,0.3)] relative overflow-hidden flex-shrink-0">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                     <h4 className="text-[11px] font-bold text-blue-100 mb-1">Equipment</h4>
                                     <h5 className="text-[10px] text-blue-200 uppercase tracking-widest mt-4">Heat Load</h5>
                                     <div className="flex items-baseline gap-1 mt-0.5">
                                         <span className="text-3xl font-black text-white tabular-nums">${Math.round(results.totalBTU / 1000)}</span>
                                         <span className="text-blue-100 font-bold text-sm">kW</span>
                                     </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 flex-1 mt-1">
                                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 flex flex-col justify-center">
                                        <span className="text-[10px] font-bold text-slate-500 mb-1">Capacity</span>
                                        <span className="text-xl font-bold text-slate-300">
                                            <span className="text-white">{results.tonnage}</span> ton
                                        </span>
                                    </div>
                                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 flex flex-col justify-center">
                                        <span className="text-[10px] font-bold text-slate-500 mb-1">Sensible Heat Ratio</span>
                                        <span className="text-xs font-medium text-slate-400 mb-0.5">SHR</span>
                                        <span className="text-lg font-bold text-emerald-400 text-truncate">{results.sensibleHeatRatio}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ═══════ ROW 3: Charts & ROI ═══════ */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            {/* Load Breakdown Chart */}
                            <div className="climatix-card rounded-2xl p-5 bento-card hover-glow" style={{ '--stagger': 5 } as React.CSSProperties}>
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h3 className="text-xs font-bold text-white tracking-wide">Cooling Load</h3>
                                        <p className="text-[10px] text-slate-500 mt-0.5">BTU/hr By Component</p>
                                    </div>
                                    <div className="flex gap-1.5"><div className="w-1 h-1 rounded-full bg-slate-600"></div><div className="w-1 h-1 rounded-full bg-slate-600"></div><div className="w-1 h-1 rounded-full bg-slate-600"></div></div>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={breakdownData} barGap={1} barCategoryGap="20%">
                                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} width={25} />
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        <Tooltip contentStyle={darkTooltipStyle} formatter={(value: any) => [`${Number(value).toLocaleString()}`, 'BTU/hr']} cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                                        <Bar dataKey="cooling" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={16}>
                                            {breakdownData.map((_, i) => <Cell key={`c-${i}`} fill="#3b82f6" />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Monthly Energy */}
                            <div className="climatix-card rounded-2xl p-5 bento-card hover-glow" style={{ '--stagger': 6 } as React.CSSProperties}>
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h3 className="text-xs font-bold text-white tracking-wide">Energy Use - Monthly</h3>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Segmented Cost ($)</p>
                                    </div>
                                    <div className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-white/[0.04] text-slate-400">
                                        Est: ${Math.round(annualCost).toLocaleString()}/yr
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={monthlyData} barGap={0} barCategoryGap="15%">
                                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v}`} width={30} />
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        <Tooltip contentStyle={darkTooltipStyle} formatter={(value: any) => [`$${value}`, 'Cost']} cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                                        <Bar dataKey="cooling" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} maxBarSize={14} />
                                        <Bar dataKey="heating" stackId="a" fill="#94a3b8" radius={[2, 2, 0, 0]} maxBarSize={14} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* ROI Forecast / Financial Performance */}
                            <div className="climatix-card rounded-2xl p-5 bento-card hover-glow flex flex-col" style={{ '--stagger': 7 } as React.CSSProperties}>
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h3 className="text-xs font-bold text-white tracking-wide">Financial Performance</h3>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Cost & Payback</p>
                                    </div>
                                    <div className="flex gap-1.5"><div className="w-1 h-1 rounded-full bg-slate-600"></div><div className="w-1 h-1 rounded-full bg-slate-600"></div><div className="w-1 h-1 rounded-full bg-slate-600"></div></div>
                                </div>
                                
                                {/* Financial Bar */}
                                <div className="flex-1 flex items-end gap-3 pb-5 border-b border-white/[0.04] mt-2 h-[120px]">
                                     <div className="flex-1 flex flex-col justify-end h-full">
                                         <span className="text-[10px] font-bold text-center text-slate-300 mb-1 leading-tight">${Math.round(equipmentCost / 1000)}k</span>
                                         <div className="w-full bg-blue-500 rounded-sm" style={{height: '90%'}}></div>
                                         <span className="text-[9px] font-medium text-center text-slate-500 mt-2">Equipment</span>
                                     </div>
                                     <div className="flex-1 flex flex-col justify-end h-full">
                                         <span className="text-[10px] font-bold text-center text-slate-300 mb-1 leading-tight">$4k</span>
                                         <div className="w-full bg-slate-600 rounded-sm" style={{height: '40%'}}></div>
                                         <span className="text-[9px] font-medium text-center text-slate-500 mt-2">Labor</span>
                                     </div>
                                     <div className="flex-1 flex flex-col justify-end h-full">
                                         <span className="text-[10px] font-bold text-center text-slate-300 mb-1 leading-tight">$2k</span>
                                         <div className="w-full bg-slate-500 rounded-sm" style={{height: '20%'}}></div>
                                         <span className="text-[9px] font-medium text-center text-slate-500 mt-2">Materials</span>
                                     </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-4 pt-1 text-left">
                                    <div>
                                        <div className="text-[10px] font-medium text-slate-400 mb-1">ROI</div>
                                        <div className="flex items-baseline gap-1.5">
                                            <div className="text-sm font-bold text-emerald-400">15%</div>
                                            <div className="text-[9px] font-medium text-slate-500">YoY</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-medium text-slate-400 mb-1">Payback</div>
                                        <div className="flex items-baseline gap-1.5">
                                            <div className="text-sm font-bold text-white">{Math.round(paybackYears * 10) / 10}</div>
                                            <div className="text-[9px] font-medium text-slate-500">Yrs</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-medium text-slate-400 mb-1">Savings</div>
                                        <div className="flex items-baseline gap-1.5">
                                            <div className="text-sm font-bold text-slate-300">${Math.round(tenYearSavings / 1000)}k</div>
                                            <div className="text-[9px] font-medium text-slate-500">/10y</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recommendation Engine */}
                        <div className="no-print">
                            <RecommendationEngine results={results} store={fullStoreSnapshot} />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row justify-center gap-2 mt-6 no-print">
                            <button onClick={handleSave} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isSaving ? 'bg-emerald-600 text-white' : 'bg-white/[0.06] text-white border border-white/[0.1] hover:bg-white/[0.1]'}`}>
                                {isSaving ? <Check size={16} /> : <Activity size={16} />}
                                {isSaving ? 'Saved!' : 'Save Project'}
                            </button>
                            <button onClick={handleCopyLink} className="px-5 py-3 rounded-xl font-bold text-sm bg-white/[0.06] text-zinc-300 border border-white/[0.1] hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2">
                                {copied ? <Check size={16} /> : <Link2 size={16} />}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                            <button onClick={handlePrint} className="px-5 py-3 rounded-xl font-bold text-sm bg-white/[0.06] text-zinc-300 border border-white/[0.1] hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2">
                                <Printer size={16} /> Print
                            </button>
                            <button onClick={() => setShowMath(!showMath)} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${showMath ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/[0.06] text-zinc-300 border border-white/[0.1] hover:bg-white/[0.1]'}`}>
                                <Gauge size={16} /> Math
                            </button>
                            <button onClick={handleReset} className="px-5 py-3 rounded-xl font-bold text-sm bg-white/[0.06] text-zinc-300 border border-white/[0.1] hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2">
                                <RotateCcw size={16} /> Reset
                            </button>
                        </div>

                        {showMath && <MathTransparency results={results} store={fullStoreSnapshot} />}
                    </>
                )}
            </div>

            {/* Sticky Mobile CTA */}
            {disclaimerAccepted && (
                <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden no-print bg-zinc-950/95 backdrop-blur-lg border-t border-white/10 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <button onClick={handleSave} className="w-full py-3.5 rounded-xl bg-brand-blue text-white font-black text-base shadow-lg shadow-brand-blue/20">
                        {isSaving ? 'Saved!' : 'Save Project'}
                    </button>
                </div>
            )}
        </div>
    );
}

function MathTransparency({ results, store }: { results: HVACResults, store: HVACState }) {
    const wallR = WALL_R_VALUES[store.wallInsulation as import('../lib/hvac-math').WallInsulation];
    const wallU = rValueToUValue(wallR);

    return (
        <div className="mt-6 p-6 bg-black/50 rounded-2xl text-zinc-300 font-mono text-xs leading-relaxed border border-white/[0.06] animate-fade-in-up">
            <h3 className="text-blue-400 font-bold mb-5 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                Engineering Log
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                    <h4 className="text-white font-bold mb-2 border-b border-white/[0.06] pb-1 text-[10px] uppercase tracking-wider">Geometry & Physics</h4>
                    <p>Floor Area: {(store.buildingLength * store.buildingWidth).toLocaleString()} SQFT</p>
                    <p>Volume: {results.volume.toLocaleString()} CUFT</p>
                    <p>Elevation: {store.elevation} ft</p>
                    <p>Winter ΔT: {store.heatingSetpoint - store.winterDesign}°F</p>
                    <p>Summer ΔT: {store.summerDesign - store.coolingSetpoint}°F</p>
                </section>
                <section>
                    <h4 className="text-white font-bold mb-2 border-b border-white/[0.06] pb-1 text-[10px] uppercase tracking-wider">Heat Transfer</h4>
                    <p>Wall U-Value: {wallU.toFixed(4)} (1 / {wallR})</p>
                    <p>Window U: {store.windowType === 'single' ? '1.10' : store.windowType === 'double' ? '0.50' : '0.30'}</p>
                    <p>Infil: 0.018 × {store.tightness === 'tight' ? '0.3' : store.tightness === 'average' ? '0.6' : '1.2'} ACH</p>
                </section>
            </div>

            <div className="mt-6 p-4 bg-black rounded-xl border border-white/[0.04]">
                <p className="text-blue-400 mb-2">// Q = U × A × ΔT</p>
                <p>Wall: {results.wallHeatLoss.toLocaleString()} BTU/hr | Window: {results.windowHeatLoss.toLocaleString()} BTU/hr</p>
                <p>Roof: {results.roofHeatLoss.toLocaleString()} BTU/hr | Floor: {results.floorLoss.toLocaleString()} BTU/hr</p>
                <p className="text-emerald-400 mt-2">// Infil: Q = 0.018 × V × ACH × ΔT</p>
                <p>Infil: {results.infiltrationHeating.toLocaleString()} BTU/hr</p>
                <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-between items-center mb-1">
                    <span className="text-white font-bold">Total Heating (Winter):</span>
                    <span className="text-amber-400 font-bold">{results.heatingBTU.toLocaleString()} BTU/hr</span>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center">
                    <span className="text-white font-bold">Total Cooling (Summer):</span>
                    <span className="text-blue-400 font-bold">{results.coolingBTU.toLocaleString()} BTU/hr</span>
                </div>
                <div className="flex justify-between items-center text-[10px] mt-1 text-slate-400">
                    <span> Sensible: {results.totalSensibleCooling.toLocaleString()} BTU/hr</span>
                    <span> Latent: {results.totalLatentCooling.toLocaleString()} BTU/hr</span>
                </div>
            </div>
        </div>
    );
}
