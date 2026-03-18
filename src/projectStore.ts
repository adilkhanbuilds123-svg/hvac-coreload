import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import type { HVACState } from './store'; // Import state type

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    lastModified: z.number(),
    state: z.any(), // HVACState
});

export type Project = z.infer<typeof ProjectSchema>;

interface ProjectState {
    projects: Project[];
    currentProjectId: string | null;
}

interface ProjectActions {
    saveProject: (name?: string, currentState?: HVACState) => void;
    loadProject: (id: string, loadCallback: (state: HVACState) => void) => void;
    deleteProject: (id: string) => void;
    createNewProject: (createNewCallback: () => void) => void;
    exportProjects: () => string;
    importProjects: (json: string) => boolean;
}

export const useProjectStore = create<ProjectState & ProjectActions>()(
    persist(
        (set, get) => ({
            projects: [],
            currentProjectId: null,

            saveProject: (name, currentState) => {
                if (!currentState) return;
                
                const state = get();
                const currentId = state.currentProjectId;
                const projectName = name || (currentState.selectedCity ? `${currentState.selectedCity} Project` : 'Unnamed Project');

                // Clone state so we don't accidentally hold references, 
                // just in case we need a clean snapshot
                const calculatorState = JSON.parse(JSON.stringify(currentState));

                const newProject: Project = {
                    id: currentId || crypto.randomUUID(),
                    name: projectName,
                    lastModified: Date.now(),
                    state: calculatorState
                };

                const existsInArray = currentId ? state.projects.some(p => p.id === currentId) : false;
                const updatedProjects = existsInArray
                    ? state.projects.map(p => p.id === currentId ? newProject : p)
                    : [newProject, ...state.projects];

                set({ 
                    projects: updatedProjects,
                    currentProjectId: newProject.id 
                });
            },

            loadProject: (id, loadCallback) => {
                const project = get().projects.find(p => p.id === id);
                if (project) {
                    set({ currentProjectId: project.id });
                    // Pass the state back to the main store to load
                    loadCallback(project.state as HVACState);
                }
            },

            deleteProject: (id) => {
                set(state => ({
                    projects: state.projects.filter(p => p.id !== id),
                    currentProjectId: state.currentProjectId === id ? null : state.currentProjectId
                }));
            },

            createNewProject: (createNewCallback) => {
                const newId = crypto.randomUUID();
                set({ currentProjectId: newId });
                createNewCallback();
            },

            exportProjects: () => {
                const state = get();
                return JSON.stringify(state.projects, null, 2);
            },
            
            importProjects: (json: string) => {
                try {
                    const data = JSON.parse(json);
                    const validated = z.array(ProjectSchema).parse(data);
                    
                    set((state) => {
                        const existingIds = new Set(state.projects.map(p => p.id));
                        const newProjects = validated.filter(p => !existingIds.has(p.id));
                        return {
                            projects: [...state.projects, ...newProjects],
                        };
                    });
                    return true;
                } catch (err) {
                    console.error('Import failed:', err);
                    return false;
                }
            },
        }),
        {
            name: 'coreload-projects-v1', // Separate localstorage key
            version: 1,
        }
    )
);
