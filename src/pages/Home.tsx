import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHVACStore } from '../store';
import { useProjectStore } from '../projectStore';
import type { Project } from '../projectStore';
import { calculateTotalLoad } from '../lib/hvac-math';
import Stepper from '../components/Stepper';
import LocationStep from '../components/steps/LocationStep';
import BuildingShellStep from '../components/steps/BuildingShellStep';
import WindowsStep from '../components/steps/WindowsStep';
import ResultsPanel from '../components/ResultsPanel';
// ThermalDiagram is rendered inline in BuildingShellStep
import { locations } from '../data/seo/locations';
import { buildingTypes } from '../data/seo/buildingTypes';
import { 
    Plus, 
    FileText, 
    Clock, 
    ChevronRight, 
    Trash2, 
    Activity,
    Thermometer,
    ChevronLeft
} from 'lucide-react';

export default function Home() {
    const currentStep = useHVACStore(state => state.currentStep);
    const setCurrentStep = useHVACStore(state => state.setCurrentStep);

    const projects = useProjectStore(state => state.projects);
    const currentProjectId = useProjectStore(state => state.currentProjectId);
    const importProjects = useProjectStore(state => state.importProjects);
    const createNewProject = useProjectStore(state => state.createNewProject);
    const loadProject = useProjectStore(state => state.loadProject);
    const deleteProject = useProjectStore(state => state.deleteProject);

    const [compareIds, setCompareIds] = useState<string[]>([]);
    const [showCompare, setShowCompare] = useState(false);

    const showWizard = currentStep > 0 || currentProjectId !== null;

    const reset = useHVACStore(state => state.reset);
    const [searchParams] = useSearchParams();

    // Ingest SEO Parameters
    useEffect(() => {
        const city = searchParams.get('city');
        const state = searchParams.get('state');
        const building = searchParams.get('building');

        if (city && state) {
            // Find location in database
            const loc = locations?.find((l: { slug: string; city: string; state: string; winterDesignTemp: number; summerDesignTemp: number; designGrains: number; elevation: number }) => l.slug === `${state}/${city}`);
            
            if (loc) {
                useHVACStore.setState({
                    selectedCity: loc.city,
                    selectedState: loc.state,
                    winterDesign: loc.winterDesignTemp,
                    summerDesign: loc.summerDesignTemp,
                    latentGrains: loc.designGrains,
                    elevation: loc.elevation,
                    currentStep: 1 // Skip location step if pre-filled
                });
            }
        }

        if (building) {
            const bType = buildingTypes?.find((b: { slug: string; typicalRWall: number; tightnessStr: string }) => b.slug === building);
            if (bType) {
                useHVACStore.setState({
                    wallInsulation: `R-${bType.typicalRWall}` as typeof useHVACStore.getState.prototype.wallInsulation || 'R-13',
                    tightness: bType.tightnessStr as typeof useHVACStore.getState.prototype.tightness || 'average'
                });
            }
        }
    }, [searchParams]);

    const handleCreateNew = () => {
        reset();
        setCurrentStep(0);
        createNewProject(() => {
            // callback if needed
        });
    };

    const handleLoadProject = (id: string) => {
        loadProject(id, (state) => {
            useHVACStore.setState(state);
        });
    };

    const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (importProjects(content)) {
                alert('Projects successfully imported.');
            } else {
                alert('Import failed. Check file format.');
            }
        };
        reader.readAsText(file);
    };

    const toggleCompare = (id: string) => {
        setCompareIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(-2)
        );
    };

    if (showWizard) {
        return (
            <div className="max-w-5xl w-full mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-300/50 border border-slate-200 p-4 sm:p-8 md:p-12 min-h-[600px]">
                    <div className="flex items-center justify-between mb-8">
                        <button 
                            onClick={() => setCurrentStep(0)}
                            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <ChevronLeft size={20} />
                            <span className="text-sm font-bold">Back to Dashboard</span>
                        </button>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <Thermometer className="text-blue-600" size={24} />
                            {currentProjectId ? projects.find((p: Project) => p.id === currentProjectId)?.name : 'New Block Load'}
                        </h2>
                    </div>

                    <div className="mb-10 lg:mb-12">
                        <Stepper />
                    </div>

                    <div className="min-h-[400px]">
                        {currentStep === 0 && <LocationStep />}
                        {currentStep === 1 && <BuildingShellStep />}
                        {currentStep === 2 && <WindowsStep />}
                        {currentStep === 3 && <ResultsPanel />}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-zinc-100 pb-10">
                <div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">Workspace</h1>
                    <p className="text-base text-zinc-500 font-medium">Manage and compare whole-house engineering reports</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <label className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 text-sm font-bold cursor-pointer hover:bg-zinc-50 transition-all flex items-center gap-2">
                        <Plus size={16} />
                        Import Data
                        <input type="file" className="hidden" accept=".json" onChange={handleImportData} />
                    </label>
                    <button 
                        onClick={handleCreateNew} 
                        className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        New Analysis
                    </button>
                </div>
            </header>

            {projects.length === 0 ? (
                <div className="relative rounded-[2.5rem] border border-zinc-100 bg-zinc-50/30 min-h-[500px] flex items-center justify-center p-12 overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-grid-zinc-200/[0.2]"></div>
                    
                    <div className="relative z-10 text-center max-w-sm mx-auto">
                        <div className="w-20 h-20 bg-white border border-zinc-100 rounded-2xl shadow-sm flex items-center justify-center mb-8 mx-auto">
                            <Activity className="text-blue-600" size={32} />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-zinc-900 mb-3">No Active Projects</h2>
                        <p className="text-zinc-500 mb-8 font-medium leading-relaxed">
                            Create your first professional block load calculation to populate your workspace.
                        </p>
                        
                        <button 
                            onClick={handleCreateNew} 
                            className="w-full bg-zinc-900 text-white rounded-xl py-4 font-bold text-lg hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10"
                        >
                            Start First Analysis
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Clock size={20} className="text-slate-400" />
                            Recent Projects
                        </h2>
                        {compareIds.length === 2 && (
                            <button 
                                onClick={() => setShowCompare(true)}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center gap-2"
                            >
                                Run Comparison (2)
                                <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((p: Project) => (
                            <ProjectCard 
                                key={p.id} 
                                project={p} 
                                onSelect={() => handleLoadProject(p.id)}
                                onDelete={() => deleteProject(p.id)}
                                isComparing={compareIds.includes(p.id)}
                                onCompare={() => toggleCompare(p.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {showCompare && (
                <ComparisonModal 
                    projects={projects.filter((p: Project) => compareIds.includes(p.id))}
                    onClose={() => setShowCompare(false)}
                />
            )}
        </div>
    );
}

function ProjectCard({ project, onSelect, onDelete, isComparing, onCompare }: { 
    project: Project, 
    onSelect: () => void, 
    onDelete: () => void,
    isComparing: boolean,
    onCompare: () => void
}) {
    return (
        <div className="group relative rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                    <FileText size={20} />
                </div>
                <div className="flex items-center gap-1.5">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onCompare(); }}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border transition-all ${isComparing ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300'}`}
                    >
                        {isComparing ? 'Active' : 'Select'}
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="cursor-pointer" onClick={onSelect}>
                <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-blue-600 transition-colors truncate">{project.name}</h3>
                <p className="text-[11px] text-zinc-400 mb-6 font-bold uppercase tracking-wider">Project ID: {project.id.slice(0, 8)}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="bg-zinc-50/50 border border-zinc-100 p-3 rounded-xl">
                        <div className="text-[9px] font-bold text-zinc-400 uppercase mb-1">Load Area</div>
                        <div className="text-sm font-bold text-zinc-700">{(project.state.buildingLength * project.state.buildingWidth).toLocaleString()} ft²</div>
                    </div>
                    <div className="bg-zinc-50/50 border border-zinc-100 p-3 rounded-xl">
                        <div className="text-[9px] font-bold text-zinc-400 uppercase mb-1">Envelope</div>
                        <div className="text-sm font-bold text-zinc-700 capitalize">{project.state.tightness}</div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                    <span className="text-[10px] font-bold text-zinc-400">EDITED {new Date(project.lastModified).toLocaleDateString()}</span>
                    <ChevronRight size={14} className="text-zinc-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
            </div>
        </div>
    );
}

function ComparisonModal({ projects, onClose }: { projects: Project[], onClose: () => void }) {
    if (projects.length < 2) return null;
    const [p1, p2] = projects;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20">
                <header className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Spec Comparison</h2>
                        <p className="text-slate-500 font-medium">Whole-House Block Load Variables</p>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
                        <Plus size={24} className="rotate-45 text-slate-500" />
                    </button>
                </header>
                
                <div className="flex-1 overflow-auto p-8">
                    <table className="w-full text-left order-collapse">
                        <thead>
                            <tr>
                                <th className="pb-6 border-b border-slate-100 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] w-1/3">Criteria</th>
                                <th className="pb-6 border-b border-slate-100 font-black text-blue-600 uppercase text-[11px] truncate">{p1.name}</th>
                                <th className="pb-6 border-b border-slate-100 font-black text-emerald-600 uppercase text-[11px] truncate">{p2.name}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <ComparisonRow label="Design ΔT" v1={`${p1.state.winterDesign}° / ${p1.state.summerDesign}°`} v2={`${p2.state.winterDesign}° / ${p2.state.summerDesign}°`} />
                            <ComparisonRow label="Envelope Area" v1={`${p1.state.buildingLength * p1.state.buildingWidth} sq ft`} v2={`${p2.state.buildingLength * p2.state.buildingWidth} sq ft`} />
                            <ComparisonRow label="Wall R-Value" v1={p1.state.wallInsulation} v2={p2.state.wallInsulation} isDiff={p1.state.wallInsulation !== p2.state.wallInsulation} />
                            <ComparisonRow label="Roof R-Value" v1={p1.state.roofInsulation} v2={p2.state.roofInsulation} isDiff={p1.state.roofInsulation !== p2.state.roofInsulation} />
                            <ComparisonRow label="Tightness" v1={p1.state.tightness} v2={p2.state.tightness} isDiff={p1.state.tightness !== p2.state.tightness} />
                            <ComparisonRow label="Glazing Area" v1={`${p1.state.windowAreaNorth + p1.state.windowAreaSouth + p1.state.windowAreaEast + p1.state.windowAreaWest} sq ft`} v2={`${p2.state.windowAreaNorth + p2.state.windowAreaSouth + p2.state.windowAreaEast + p2.state.windowAreaWest} sq ft`} />
                            {(() => {
                                // Calculate results for both projects
                                try {
                                    const r1 = calculateTotalLoad({
                                        winterDesign: p1.state.winterDesign, summerDesign: p1.state.summerDesign, elevation: p1.state.elevation,
                                        heatingSetpoint: p1.state.heatingSetpoint, coolingSetpoint: p1.state.coolingSetpoint,
                                        buildingLength: p1.state.buildingLength, buildingWidth: p1.state.buildingWidth, ceilingHeight: p1.state.ceilingHeight,
                                        wallInsulation: p1.state.wallInsulation, roofInsulation: p1.state.roofInsulation,
                                        floorType: p1.state.floorType, floorInsulation: p1.state.floorInsulation,
                                        footprintShape: p1.state.footprintShape || 'rectangle',
                                        windowAreaNorth: p1.state.windowAreaNorth, windowAreaSouth: p1.state.windowAreaSouth,
                                        windowAreaEast: p1.state.windowAreaEast, windowAreaWest: p1.state.windowAreaWest,
                                        windowType: p1.state.windowType, tightness: p1.state.tightness, latentGrains: p1.state.latentGrains,
                                        occupants: p1.state.occupants, applianceLoad: p1.state.applianceLoad, distanceToDucts: 25,
                                        ductLocation: p1.state.ductLocation, ductInsulation: p1.state.ductInsulation,
                                        isVaulted: p1.state.isVaulted, vaultedHeight: p1.state.vaultedHeight,
                                    });
                                    const r2 = calculateTotalLoad({
                                        winterDesign: p2.state.winterDesign, summerDesign: p2.state.summerDesign, elevation: p2.state.elevation,
                                        heatingSetpoint: p2.state.heatingSetpoint, coolingSetpoint: p2.state.coolingSetpoint,
                                        buildingLength: p2.state.buildingLength, buildingWidth: p2.state.buildingWidth, ceilingHeight: p2.state.ceilingHeight,
                                        wallInsulation: p2.state.wallInsulation, roofInsulation: p2.state.roofInsulation,
                                        floorType: p2.state.floorType, floorInsulation: p2.state.floorInsulation,
                                        footprintShape: p2.state.footprintShape || 'rectangle',
                                        windowAreaNorth: p2.state.windowAreaNorth, windowAreaSouth: p2.state.windowAreaSouth,
                                        windowAreaEast: p2.state.windowAreaEast, windowAreaWest: p2.state.windowAreaWest,
                                        windowType: p2.state.windowType, tightness: p2.state.tightness, latentGrains: p2.state.latentGrains,
                                        occupants: p2.state.occupants, applianceLoad: p2.state.applianceLoad, distanceToDucts: 25,
                                        ductLocation: p2.state.ductLocation, ductInsulation: p2.state.ductInsulation,
                                        isVaulted: p2.state.isVaulted, vaultedHeight: p2.state.vaultedHeight,
                                    });
                                    return (
                                        <>
                                            <ComparisonRow label="Heating BTU" v1={`${r1.heatingBTU.toLocaleString()} BTU/hr`} v2={`${r2.heatingBTU.toLocaleString()} BTU/hr`} isDiff={r1.heatingBTU !== r2.heatingBTU} />
                                            <ComparisonRow label="Cooling BTU" v1={`${r1.coolingBTU.toLocaleString()} BTU/hr`} v2={`${r2.coolingBTU.toLocaleString()} BTU/hr`} isDiff={r1.coolingBTU !== r2.coolingBTU} />
                                            <ComparisonRow label="Tonnage" v1={`${r1.tonnage} T`} v2={`${r2.tonnage} T`} isDiff={r1.tonnage !== r2.tonnage} />
                                        </>
                                    );
                                } catch { return null; }
                            })()}
                        </tbody>
                    </table>
                </div>

                <footer className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
                    <button onClick={onClose} className="btn-primary px-8">Return to Dashboard</button>
                </footer>
            </div>
        </div>
    );
}

function ComparisonRow({ label, v1, v2, isDiff }: { label: string, v1: string | number, v2: string | number, isDiff?: boolean }) {
    return (
        <tr className="group">
            <td className="py-5 border-b border-slate-50 font-bold text-slate-950 uppercase text-[10px] tracking-wider">{label}</td>
            <td className={`py-5 border-b border-slate-50 font-black tabular-nums transition-colors ${isDiff ? 'text-blue-500 bg-blue-50/30' : 'text-slate-600'}`}>{v1}</td>
            <td className={`py-5 border-b border-slate-50 font-black tabular-nums transition-colors ${isDiff ? 'text-emerald-500 bg-emerald-50/30' : 'text-slate-600'}`}>{v2}</td>
        </tr>
    );
}
