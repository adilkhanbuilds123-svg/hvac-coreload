import { useProjectStore } from '../projectStore';
import { useHVACStore } from '../store';
import { calculateTotalLoad, type HVACResults } from '../lib/hvac-math';
import type { Project } from '../projectStore';
import { useNavigate } from 'react-router-dom';
import {
    FileText,
    Plus,
    Clock,
    ChevronRight,
    Activity,
    Snowflake,
    Sun,
    Download,
    Upload,
} from 'lucide-react';
import { useState } from 'react';

export default function ProjectsPage() {
    const navigate = useNavigate();
    const projects = useProjectStore(state => state.projects);
    const loadProject = useProjectStore(state => state.loadProject);
    const deleteProject = useProjectStore(state => state.deleteProject);
    const createNewProject = useProjectStore(state => state.createNewProject);
    const exportProjects = useProjectStore(state => state.exportProjects);
    const importProjects = useProjectStore(state => state.importProjects);
    const reset = useHVACStore(state => state.reset);
    const setCurrentStep = useHVACStore(state => state.setCurrentStep);

    const handleCreateNew = () => {
        reset();
        setCurrentStep(0);
        createNewProject(() => {});
        navigate('/app');
    };

    const handleLoadProject = (id: string) => {
        loadProject(id, (state) => {
            useHVACStore.setState(state);
        });
        navigate('/app');
    };

    const handleExport = () => {
        const json = exportProjects();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coreload-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-zinc-100 pb-10">
                <div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">Projects</h1>
                    <p className="text-base text-zinc-500 font-medium">All saved block load calculations</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {projects.length > 0 && (
                        <button 
                            onClick={handleExport}
                            className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 text-sm font-bold hover:bg-zinc-50 transition-all flex items-center gap-2"
                        >
                            <Download size={16} />
                            Export All
                        </button>
                    )}
                    <label className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 text-sm font-bold cursor-pointer hover:bg-zinc-50 transition-all flex items-center gap-2">
                        <Upload size={16} />
                        Import
                        <input type="file" className="hidden" accept=".json" onChange={handleImport} />
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
                    <div className="relative z-10 text-center max-w-sm mx-auto">
                        <div className="w-20 h-20 bg-white border border-zinc-100 rounded-2xl shadow-sm flex items-center justify-center mb-8 mx-auto">
                            <Activity className="text-blue-600" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-3">No Active Projects</h2>
                        <p className="text-zinc-500 mb-8 font-medium leading-relaxed">
                            Create your first professional block load calculation.
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p: Project) => (
                        <ProjectCard 
                            key={p.id} 
                            project={p} 
                            onSelect={() => handleLoadProject(p.id)}
                            onDelete={() => deleteProject(p.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ProjectCard({ project, onSelect, onDelete }: { 
    project: Project; 
    onSelect: () => void; 
    onDelete: () => void;
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Calculate results from stored state for the summary
    let tonnage = '—';
    let heatingBTU = '—';
    let coolingBTU = '—';
    try {
        const s = project.state;
        const results: HVACResults = calculateTotalLoad({
            winterDesign: s.winterDesign,
            summerDesign: s.summerDesign,
            elevation: s.elevation,
            heatingSetpoint: s.heatingSetpoint,
            coolingSetpoint: s.coolingSetpoint,
            buildingLength: s.buildingLength,
            buildingWidth: s.buildingWidth,
            ceilingHeight: s.ceilingHeight,
            wallInsulation: s.wallInsulation,
            roofInsulation: s.roofInsulation,
            floorType: s.floorType,
            floorInsulation: s.floorInsulation,
            footprintShape: s.footprintShape || 'rectangle',
            windowAreaNorth: s.windowAreaNorth,
            windowAreaSouth: s.windowAreaSouth,
            windowAreaEast: s.windowAreaEast,
            windowAreaWest: s.windowAreaWest,
            windowType: s.windowType,
            tightness: s.tightness,
            latentGrains: s.latentGrains,
            occupants: s.occupants,
            applianceLoad: s.applianceLoad,
            distanceToDucts: 25,
            ductLocation: s.ductLocation,
            ductInsulation: s.ductInsulation,
            isVaulted: s.isVaulted,
            vaultedHeight: s.vaultedHeight,
        });
        tonnage = String(results.tonnage);
        heatingBTU = results.heatingBTU.toLocaleString();
        coolingBTU = results.coolingBTU.toLocaleString();
    } catch { /* silent */ }

    return (
        <div className="group relative rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                    <FileText size={20} />
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); confirmDelete ? onDelete() : setConfirmDelete(true); }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border transition-all ${confirmDelete ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-zinc-200 text-zinc-400 hover:border-red-300 hover:text-red-500'}`}
                >
                    {confirmDelete ? 'Confirm' : 'Delete'}
                </button>
            </div>

            <div className="cursor-pointer" onClick={onSelect}>
                <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-blue-600 transition-colors truncate">{project.name}</h3>
                <p className="text-[11px] text-zinc-400 mb-4 font-bold uppercase tracking-wider">
                    {project.state.selectedCity ? `${project.state.selectedCity}, ${project.state.selectedState}` : 'Custom Location'}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-zinc-50/50 border border-zinc-100 p-2.5 rounded-xl text-center">
                        <div className="text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Tonnage</div>
                        <div className="text-sm font-black text-zinc-900">{tonnage}T</div>
                    </div>
                    <div className="bg-blue-50/50 border border-blue-100 p-2.5 rounded-xl text-center">
                        <div className="text-[9px] font-bold text-blue-400 uppercase mb-0.5 flex items-center justify-center gap-1"><Snowflake size={8} />Heat</div>
                        <div className="text-[11px] font-bold text-zinc-700 tabular-nums">{heatingBTU}</div>
                    </div>
                    <div className="bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl text-center">
                        <div className="text-[9px] font-bold text-amber-400 uppercase mb-0.5 flex items-center justify-center gap-1"><Sun size={8} />Cool</div>
                        <div className="text-[11px] font-bold text-zinc-700 tabular-nums">{coolingBTU}</div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                    <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(project.lastModified).toLocaleDateString()}
                    </span>
                    <ChevronRight size={14} className="text-zinc-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
            </div>
        </div>
    );
}
