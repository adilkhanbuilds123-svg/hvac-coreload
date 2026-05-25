'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHVACStore } from '@/store/useHVACStore';
import type { HVACInputs } from '@/store/useHVACStore';
import { calculateTotalLoad } from '@/lib/hvac-math';
import type { HVACInputs as MathInputs } from '@/lib/hvac-math';

interface Project {
  id: string;
  name: string;
  lastModified: string;
  inputs: HVACInputs;
}

const STORAGE_KEY = 'coreload-projects-v3';

function loadProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function inputsToMathInputs(inputs: HVACInputs): MathInputs {
  return {
    winterDesign: inputs.winterDesign,
    summerDesign: inputs.summerDesign,
    elevation: inputs.elevation,
    heatingSetpoint: inputs.heatingSetpoint,
    coolingSetpoint: inputs.coolingSetpoint,
    latentGrains: inputs.latentGrains,
    buildingLength: inputs.buildingLength,
    buildingWidth: inputs.buildingWidth,
    ceilingHeight: inputs.ceilingHeight,
    isVaulted: inputs.isVaulted,
    vaultedHeight: inputs.vaultedHeight,
    wallInsulation: inputs.wallInsulation,
    roofInsulation: inputs.roofInsulation,
    floorType: inputs.floorType,
    floorInsulation: inputs.floorInsulation,
    windowAreaNorth: inputs.windowAreaNorth,
    windowAreaSouth: inputs.windowAreaSouth,
    windowAreaEast: inputs.windowAreaEast,
    windowAreaWest: inputs.windowAreaWest,
    windowType: inputs.windowType,
    tightness: inputs.tightness,
    occupants: inputs.occupants,
    applianceLoad: inputs.applianceLoad,
    ductLocation: inputs.ductLocation,
    ductInsulation: inputs.ductInsulation,
    footprintShape: inputs.footprintShape,
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newName, setNewName] = useState('');
  const [showNew, setShowNew] = useState(false);
  const storeInputs = useHVACStore((s) => s.inputs);
  const updateInput = useHVACStore((s) => s.updateInput);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const handleSave = useCallback(() => {
    if (!newName.trim()) return;
    const project: Project = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      lastModified: new Date().toISOString(),
      inputs: storeInputs,
    };
    const updated = [project, ...projects];
    setProjects(updated);
    saveProjects(updated);
    setNewName('');
    setShowNew(false);
  }, [newName, projects, storeInputs]);

  const handleLoad = useCallback((project: Project) => {
    const keys = Object.keys(project.inputs) as (keyof HVACInputs)[];
    for (const key of keys) {
      updateInput(key, project.inputs[key] as never);
    }
  }, [updateInput]);

  const handleDelete = useCallback((id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveProjects(updated);
  }, [projects]);

  const handleExport = useCallback((project: Project) => {
    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coreload-${project.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-zinc-100 tracking-tight">Saved Projects</h1>
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-wide mt-2">
            Local Configuration State
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {showNew && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="Project name..."
                  className="bg-zinc-950 border-b border-zinc-800 px-0 py-1 text-sm font-mono text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-100 min-w-[200px]"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={showNew ? handleSave : () => setShowNew(true)}
            disabled={showNew && !newName.trim()}
            className="text-sm font-mono uppercase tracking-widest text-zinc-100 hover:text-zinc-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {showNew ? '[ Save Config ]' : '[ New Save ]'}
          </button>
        </div>
      </header>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="py-24 text-center">
          <h2 className="font-display text-5xl md:text-7xl font-bold text-zinc-800 uppercase tracking-tighter">
            No Projects
          </h2>
          <p className="font-mono text-sm text-zinc-600 mt-6 max-w-md mx-auto">
            Calculate your load profile on the main engine and save the state here for future reference.
          </p>
        </div>
      ) : (
        <div className="flex flex-col border-t border-zinc-900">
          <AnimatePresence>
            {projects.map((project) => {
              const results = calculateTotalLoad(inputsToMathInputs(project.inputs));
              const locationStr = project.inputs.selectedCity
                ? `${project.inputs.selectedCity}, ${project.inputs.selectedState}`
                : 'Custom Location';

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="group flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-zinc-900 gap-6"
                >
                  {/* Info Block */}
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold text-zinc-100 group-hover:text-white transition-colors">{project.name}</h3>
                    <p className="font-mono text-xs text-zinc-500 mt-2">
                      {new Date(project.lastModified).toLocaleDateString()} // {locationStr}
                    </p>
                  </div>
                  
                  {/* Metrics Block */}
                  <div className="flex items-baseline gap-6 md:w-64">
                    <div className="flex flex-col">
                      <span className="font-mono text-lg text-zinc-300">{results.tonnage}T</span>
                      <span className="font-mono text-[10px] text-zinc-600 uppercase">Req. Cap</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-sm text-orange-heating">{Math.round(results.heatingBTU / 1000)}k</span>
                      <span className="font-mono text-[10px] text-zinc-600 uppercase">H-BTU</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-sm text-cyan-cooling">{Math.round(results.coolingBTU / 1000)}k</span>
                      <span className="font-mono text-[10px] text-zinc-600 uppercase">C-BTU</span>
                    </div>
                  </div>

                  {/* Actions Block */}
                  <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-zinc-600 md:w-48 justify-end">
                    <button
                      onClick={() => handleLoad(project)}
                      className="hover:text-zinc-100 transition-colors outline-none"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleExport(project)}
                      className="hover:text-zinc-100 transition-colors outline-none"
                    >
                      Export
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="hover:text-red-500 transition-colors outline-none"
                    >
                      Drop
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
