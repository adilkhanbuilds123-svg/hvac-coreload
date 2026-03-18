import { useProjectStore } from '../projectStore';
import { calculateTotalLoad, type HVACResults } from '../lib/hvac-math';
import type { Project } from '../projectStore';
import { Link } from 'react-router-dom';
import {
    FileBarChart,
    Snowflake,
    Sun,
} from 'lucide-react';

export default function ReportsPage() {
    const projects = useProjectStore(state => state.projects);

    // Compute results for each project
    const reports = projects.map((p: Project) => {
        try {
            const s = p.state;
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
            return { project: p, results };
        } catch {
            return null;
        }
    }).filter(Boolean) as { project: Project; results: HVACResults }[];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-zinc-100 pb-10">
                <div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">Reports</h1>
                    <p className="text-base text-zinc-500 font-medium">Saved calculation summaries at a glance</p>
                </div>
            </header>

            {reports.length === 0 ? (
                <div className="relative rounded-[2.5rem] border border-zinc-100 bg-zinc-50/30 min-h-[400px] flex items-center justify-center p-12">
                    <div className="text-center max-w-sm mx-auto">
                        <div className="w-20 h-20 bg-white border border-zinc-100 rounded-2xl shadow-sm flex items-center justify-center mb-8 mx-auto">
                            <FileBarChart className="text-zinc-400" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-3">No Reports Yet</h2>
                        <p className="text-zinc-500 mb-8 font-medium leading-relaxed">
                            Complete a calculation and save a project to generate engineering reports.
                        </p>
                        <Link
                            to="/app"
                            className="inline-block w-full bg-zinc-900 text-white rounded-xl py-4 font-bold text-lg hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 text-center"
                        >
                            Start a Calculation
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        <div className="col-span-3">Project</div>
                        <div className="col-span-2">Location</div>
                        <div className="col-span-1 text-center">Tons</div>
                        <div className="col-span-2 text-right">Heating</div>
                        <div className="col-span-2 text-right">Cooling</div>
                        <div className="col-span-1 text-right">Area</div>
                        <div className="col-span-1 text-right">Date</div>
                    </div>

                    {reports.map(({ project, results }) => (
                        <div 
                            key={project.id}
                            className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 rounded-2xl border border-zinc-100 bg-white hover:shadow-lg hover:shadow-zinc-200/40 transition-all items-center"
                        >
                            {/* Name + ID */}
                            <div className="col-span-3">
                                <h3 className="text-sm font-black text-zinc-900 group-hover:text-blue-600 transition-colors truncate">{project.name}</h3>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">ID: {project.id.slice(0, 8)}</p>
                            </div>

                            {/* Location */}
                            <div className="col-span-2">
                                <span className="text-sm font-bold text-zinc-600">
                                    {project.state.selectedCity ? `${project.state.selectedCity}, ${project.state.selectedState}` : 'Custom'}
                                </span>
                            </div>

                            {/* Tonnage */}
                            <div className="col-span-1 text-center">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-900 text-white text-sm font-black tabular-nums">
                                    {results.tonnage}T
                                </span>
                            </div>

                            {/* Heating */}
                            <div className="col-span-2 text-right">
                                <span className="text-sm font-bold text-zinc-700 tabular-nums flex items-center justify-end gap-1.5">
                                    <Snowflake size={12} className="text-blue-500" />
                                    {results.heatingBTU.toLocaleString()} BTU
                                </span>
                            </div>

                            {/* Cooling */}
                            <div className="col-span-2 text-right">
                                <span className="text-sm font-bold text-zinc-700 tabular-nums flex items-center justify-end gap-1.5">
                                    <Sun size={12} className="text-amber-500" />
                                    {results.coolingBTU.toLocaleString()} BTU
                                </span>
                            </div>

                            {/* Area */}
                            <div className="col-span-1 text-right">
                                <span className="text-sm font-bold text-zinc-500 tabular-nums">
                                    {(project.state.buildingLength * project.state.buildingWidth).toLocaleString()} ft²
                                </span>
                            </div>

                            {/* Date */}
                            <div className="col-span-1 text-right">
                                <span className="text-[10px] font-bold text-zinc-400">
                                    {new Date(project.lastModified).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
