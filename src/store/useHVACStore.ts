/**
 * CoreLoad — Zustand State Engine
 * Unified, persistent state management with Zod schema validation.
 * Preserves all 32 fields from the original store + hydration protection.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';

// ── Enum Schemas ────────────────────────────────────────────────────
export const WallInsulationSchema = z.enum(['R-0', 'R-7', 'R-11', 'R-13', 'R-19', 'R-21', 'R-30', 'R-40']);
export const RoofInsulationSchema = z.enum(['R-0', 'R-11', 'R-19', 'R-30', 'R-38', 'R-49', 'R-60']);
export const FloorTypeSchema = z.enum(['slab_on_grade', 'vented_crawlspace', 'conditioned_basement']);
export const FloorInsulationSchema = z.enum(['uninsulated', 'R-7', 'R-11', 'R-19']);
export const WindowTypeSchema = z.enum(['single', 'double', 'triple']);
export const BuildingTightnessSchema = z.enum(['tight', 'average', 'leaky']);
export const ApplianceLoadSchema = z.enum(['standard', 'heavy']);
export const DuctLocationSchema = z.enum(['conditioned', 'unconditioned_basement', 'vented_attic']);
export const DuctInsulationSchema = z.enum(['none', 'R-4', 'R-6', 'R-8']);
export const FootprintShapeSchema = z.enum(['rectangle', 'l_shape', 'u_shape', 'complex']);

// ── Primary State Schema ────────────────────────────────────────────
export const HVACInputsSchema = z.object({
  // Step tracking
  currentStep: z.number().min(0).max(3).catch(0),
  useMetricUnits: z.boolean().catch(false),

  // Location & Climate
  selectedCity: z.string().catch(''),
  selectedState: z.string().catch(''),
  winterDesign: z.number().catch(15),
  summerDesign: z.number().catch(89),
  latentGrains: z.number().catch(35),
  elevation: z.number().nonnegative().catch(0),
  heatingSetpoint: z.number().catch(70),
  coolingSetpoint: z.number().catch(75),
  avgUtilityRate: z.number().catch(0.12),
  useCustomTemps: z.boolean().catch(false),

  // Building Envelope
  buildingLength: z.number().min(5).catch(40),
  buildingWidth: z.number().min(5).catch(30),
  footprintShape: FootprintShapeSchema.catch('rectangle'),
  ceilingHeight: z.number().min(5).catch(9),
  isVaulted: z.boolean().catch(false),
  vaultedHeight: z.number().catch(5),

  // Insulation
  wallInsulation: WallInsulationSchema.catch('R-13'),
  roofInsulation: RoofInsulationSchema.catch('R-38'),
  floorType: FloorTypeSchema.catch('slab_on_grade'),
  floorInsulation: FloorInsulationSchema.catch('uninsulated'),
  tightness: BuildingTightnessSchema.catch('average'),

  // Windows (per-direction)
  windowAreaNorth: z.number().nonnegative().catch(15),
  windowAreaSouth: z.number().nonnegative().catch(15),
  windowAreaEast: z.number().nonnegative().catch(15),
  windowAreaWest: z.number().nonnegative().catch(15),
  windowType: WindowTypeSchema.catch('double'),

  // Internal Loads
  occupants: z.number().int().nonnegative().catch(2),
  applianceLoad: ApplianceLoadSchema.catch('standard'),

  // Duct System
  ductLocation: DuctLocationSchema.catch('conditioned'),
  ductInsulation: DuctInsulationSchema.catch('none'),
});

export type HVACInputs = z.infer<typeof HVACInputsSchema>;

// ── Exported enum types ─────────────────────────────────────────────
export type WallInsulation = z.infer<typeof WallInsulationSchema>;
export type RoofInsulation = z.infer<typeof RoofInsulationSchema>;
export type FloorType = z.infer<typeof FloorTypeSchema>;
export type FloorInsulation = z.infer<typeof FloorInsulationSchema>;
export type WindowType = z.infer<typeof WindowTypeSchema>;
export type BuildingTightness = z.infer<typeof BuildingTightnessSchema>;
export type ApplianceLoad = z.infer<typeof ApplianceLoadSchema>;
export type DuctLocation = z.infer<typeof DuctLocationSchema>;
export type DuctInsulation = z.infer<typeof DuctInsulationSchema>;
export type FootprintShape = z.infer<typeof FootprintShapeSchema>;

// ── Store Interface ─────────────────────────────────────────────────
interface HVACStore {
  inputs: HVACInputs;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
  updateInput: <K extends keyof HVACInputs>(key: K, val: HVACInputs[K]) => void;
  setLocation: (city: string, state: string, winterDesign: number, summerDesign: number, latentGrains: number, elevation: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetStore: () => void;
  generateShareURL: () => string;
  hydrateFromURL: () => boolean;
}

const DEFAULT_INPUTS = HVACInputsSchema.parse({});

// ── Store Implementation ────────────────────────────────────────────
export const useHVACStore = create<HVACStore>()(
  persist(
    (set, get) => ({
      inputs: DEFAULT_INPUTS,
      isHydrated: false,

      setHydrated: (state) => set({ isHydrated: state }),

      updateInput: (key, val) =>
        set((state) => {
          const castVal =
            typeof val === 'string' && !isNaN(Number(val)) && val !== ''
              ? Number(val)
              : val;
          const nextInputs = { ...state.inputs, [key]: castVal };
          return { inputs: HVACInputsSchema.parse(nextInputs) };
        }),

      setLocation: (city, st, winterDesign, summerDesign, latentGrains, elevation) =>
        set((state) => ({
          inputs: HVACInputsSchema.parse({
            ...state.inputs,
            selectedCity: city,
            selectedState: st,
            winterDesign,
            summerDesign,
            latentGrains,
            elevation,
          }),
        })),

      nextStep: () =>
        set((state) => ({
          inputs: {
            ...state.inputs,
            currentStep: Math.min(state.inputs.currentStep + 1, 3),
          },
        })),

      prevStep: () =>
        set((state) => ({
          inputs: {
            ...state.inputs,
            currentStep: Math.max(state.inputs.currentStep - 1, 0),
          },
        })),

      setStep: (step) =>
        set((state) => ({
          inputs: { ...state.inputs, currentStep: Math.max(0, Math.min(step, 3)) },
        })),

      resetStore: () => set({ inputs: HVACInputsSchema.parse({}) }),

      generateShareURL: () => {
        try {
          const payload = { ...get().inputs, currentStep: 3 };
          const json = JSON.stringify(payload);
          const base64 = btoa(json);
          return (
            (typeof window !== 'undefined'
              ? window.location.origin + '/calculator'
              : '/calculator') +
            '?config=' +
            base64
          );
        } catch {
          return typeof window !== 'undefined' ? window.location.href : '/calculator';
        }
      },

      hydrateFromURL: () => {
        try {
          if (typeof window === 'undefined') return false;
          const params = new URLSearchParams(window.location.search);
          const config = params.get('config');
          if (!config) return false;

          const json = atob(config);
          const parsed = JSON.parse(json);
          const result = HVACInputsSchema.safeParse(parsed);
          if (result.success) {
            set({ inputs: result.data });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'coreload-engine-state',
      version: 3,
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    }
  )
);
