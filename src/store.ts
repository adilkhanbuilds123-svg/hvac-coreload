/**
 * CoreLoad — Zustand Store
 * Manages all HVAC calculator state with localStorage persistence
 * and URL ?config= encoding for shareable links.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';

// ... existing schemas ...

import type { FootprintShape } from './lib/hvac-math';

interface HVACActions {    setCurrentStep: (step: number) => void;
    setUseMetricUnits: (useMetric: boolean) => void;
    setLocation: (city: string, state: string, winterDesign: number, summerDesign: number, latentGrains: number, elevation: number) => void;
    setWinterDesign: (temp: number) => void;
    setSummerDesign: (temp: number) => void;
    setHeatingSetpoint: (temp: number) => void;
    setCoolingSetpoint: (temp: number) => void;
    setLatentGrains: (grains: number) => void;
    setUseCustomTemps: (use: boolean) => void;
    setBuildingLength: (ft: number) => void;
    setBuildingWidth: (ft: number) => void;
    setFootprintShape: (shape: FootprintShape) => void;
    setCeilingHeight: (ft: number) => void;
    setIsVaulted: (isVaulted: boolean) => void;
    setVaultedHeight: (ft: number) => void;
    setWallInsulation: (insulation: WallInsulation) => void;
    setRoofInsulation: (insulation: RoofInsulation) => void;
    setFloorType: (type: FloorType) => void;
    setFloorInsulation: (insulation: FloorInsulation) => void;
    setTightness: (tightness: BuildingTightness) => void;
    setWindowArea: (direction: 'North' | 'South' | 'East' | 'West', area: number) => void;
    setWindowType: (type: WindowType) => void;
    setOccupants: (occupants: number) => void;
    setApplianceLoad: (load: ApplianceLoad) => void;
    setDuctLocation: (location: DuctLocation) => void;
    setDuctInsulation: (insulation: DuctInsulation) => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
    generateShareURL: () => string;
    hydrateFromURL: () => boolean;
}

// ── Schemas ─────────────────────────────────────────────────────────
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

export const HVACStateSchema = z.object({
    currentStep: z.number().min(0).max(3).default(0),
    useMetricUnits: z.boolean().default(false),
    selectedCity: z.string().default(''),
    selectedState: z.string().default(''),
    winterDesign: z.number().default(15),
    summerDesign: z.number().default(89),
    elevation: z.number().default(0),
    heatingSetpoint: z.number().default(70),
    coolingSetpoint: z.number().default(75),
    latentGrains: z.number().default(35),
    avgUtilityRate: z.number().default(0.12),
    useCustomTemps: z.boolean().default(false),
    buildingLength: z.number().min(5).max(500).default(40),
    buildingWidth: z.number().min(5).max(500).default(35),
    footprintShape: FootprintShapeSchema.default('rectangle'),
    ceilingHeight: z.number().min(7).max(50).default(9),
    isVaulted: z.boolean().default(false),
    vaultedHeight: z.number().min(0).max(50).default(5),
    wallInsulation: WallInsulationSchema.default('R-11'),
    roofInsulation: RoofInsulationSchema.default('R-19'),
    floorType: FloorTypeSchema.default('slab_on_grade'),
    floorInsulation: FloorInsulationSchema.default('uninsulated'),
    tightness: BuildingTightnessSchema.default('average'),
    windowAreaNorth: z.number().default(25),
    windowAreaSouth: z.number().default(25),
    windowAreaEast: z.number().default(25),
    windowAreaWest: z.number().default(25),
    windowType: WindowTypeSchema.default('double'),
    occupants: z.number().min(1).default(2),
    applianceLoad: ApplianceLoadSchema.default('standard'),
    ductLocation: DuctLocationSchema.default('conditioned'),
    ductInsulation: DuctInsulationSchema.default('none'),
});

export type WallInsulation = z.infer<typeof WallInsulationSchema>;
export type RoofInsulation = z.infer<typeof RoofInsulationSchema>;
export type FloorType = z.infer<typeof FloorTypeSchema>;
export type FloorInsulation = z.infer<typeof FloorInsulationSchema>;
export type WindowType = z.infer<typeof WindowTypeSchema>;
export type BuildingTightness = z.infer<typeof BuildingTightnessSchema>;
export type ApplianceLoad = z.infer<typeof ApplianceLoadSchema>;
export type DuctLocation = z.infer<typeof DuctLocationSchema>;
export type DuctInsulation = z.infer<typeof DuctInsulationSchema>;
export type HVACState = z.infer<typeof HVACStateSchema>;

interface HVACActions {
    setCurrentStep: (step: number) => void;
    setUseMetricUnits: (useMetric: boolean) => void;
    setLocation: (city: string, state: string, winterDesign: number, summerDesign: number, latentGrains: number, elevation: number) => void;
    setWinterDesign: (temp: number) => void;
    setSummerDesign: (temp: number) => void;
    setHeatingSetpoint: (temp: number) => void;
    setCoolingSetpoint: (temp: number) => void;
    setLatentGrains: (grains: number) => void;
    setUseCustomTemps: (use: boolean) => void;
    setBuildingLength: (ft: number) => void;
    setBuildingWidth: (ft: number) => void;
    setFootprintShape: (shape: FootprintShape) => void;
    setCeilingHeight: (ft: number) => void;
    setIsVaulted: (isVaulted: boolean) => void;
    setVaultedHeight: (ft: number) => void;
    setWallInsulation: (insulation: WallInsulation) => void;
    setRoofInsulation: (insulation: RoofInsulation) => void;
    setFloorType: (type: FloorType) => void;
    setFloorInsulation: (insulation: FloorInsulation) => void;
    setTightness: (tightness: BuildingTightness) => void;
    setWindowArea: (direction: 'North' | 'South' | 'East' | 'West', area: number) => void;
    setWindowType: (type: WindowType) => void;
    setOccupants: (occupants: number) => void;
    setApplianceLoad: (load: ApplianceLoad) => void;
    setDuctLocation: (location: DuctLocation) => void;
    setDuctInsulation: (insulation: DuctInsulation) => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
    generateShareURL: () => string;
    hydrateFromURL: () => boolean;
}

const DEFAULT_STATE: HVACState = HVACStateSchema.parse({});

function stateToPayload(state: HVACState): Partial<HVACState> {
    const payload = { ...state };
    return HVACStateSchema.partial().parse(payload);
}

function decodeStateFromURL(): Partial<HVACState> | null {
    try {
        const params = new URLSearchParams(window.location.search);
        const config = params.get('config');
        if (!config) return null;
        
        const json = atob(config);
        const parsed = JSON.parse(json);
        
        const result = HVACStateSchema.partial().safeParse(parsed);
        if (result.success) return result.data;
        
        return null;
    } catch {
        return null;
    }
}

// ── Store ────────────────────────────────────────────────────────────

export const useHVACStore = create<HVACState & HVACActions>()(
    persist(
        (set, get) => ({
            ...DEFAULT_STATE,

            setCurrentStep: (step) => set({ currentStep: step }),
            setUseMetricUnits: (useMetricUnits) => set({ useMetricUnits }),
            setLocation: (city, state, winterDesign, summerDesign, latentGrains, elevation, avgUtilityRate = 0.12) => 
                set({ selectedCity: city, selectedState: state, winterDesign, summerDesign, latentGrains, elevation, avgUtilityRate }),
            setWinterDesign: (winterDesign) => set({ winterDesign }),
            setSummerDesign: (summerDesign) => set({ summerDesign }),
            setHeatingSetpoint: (heatingSetpoint) => set({ heatingSetpoint }),
            setCoolingSetpoint: (coolingSetpoint) => set({ coolingSetpoint }),
            setLatentGrains: (latentGrains) => set({ latentGrains }),
            setUseCustomTemps: (useCustomTemps) => set({ useCustomTemps }),
            setBuildingLength: (buildingLength) => set({ buildingLength }),
            setBuildingWidth: (buildingWidth) => set({ buildingWidth }),
            setFootprintShape: (footprintShape) => set({ footprintShape }),
            setCeilingHeight: (ceilingHeight) => set({ ceilingHeight }),
            setIsVaulted: (isVaulted) => set({ isVaulted }),
            setVaultedHeight: (vaultedHeight) => set({ vaultedHeight }),
            setWallInsulation: (wallInsulation) => set({ wallInsulation }),
            setRoofInsulation: (roofInsulation) => set({ roofInsulation }),
            setFloorType: (floorType) => set({ floorType }),
            setFloorInsulation: (floorInsulation) => set({ floorInsulation }),
            setTightness: (tightness) => set({ tightness }),
            setWindowArea: (direction, area) => set((state) => ({ ...state, [`windowArea${direction}`]: area })),
            setWindowType: (windowType) => set({ windowType }),
            setOccupants: (occupants) => set({ occupants }),
            setApplianceLoad: (applianceLoad) => set({ applianceLoad }),
            setDuctLocation: (ductLocation) => set({ ductLocation }),
            setDuctInsulation: (ductInsulation) => set({ ductInsulation }),
            nextStep: () => set({ currentStep: Math.min(get().currentStep + 1, 3) }),
            prevStep: () => set({ currentStep: Math.max(get().currentStep - 1, 0) }),
            reset: () => set({ ...DEFAULT_STATE }),

            generateShareURL: () => {
                try {
                    const payload = stateToPayload(get());
                    payload.currentStep = 3;
                    const json = JSON.stringify(payload);
                    const base64 = btoa(json);
                    return window.location.origin + window.location.pathname + '?config=' + base64;
                } catch {
                    return window.location.href;
                }
            },

            hydrateFromURL: () => {
                const urlState = decodeStateFromURL();
                if (urlState) {
                    set(urlState);
                    return true;
                }
                return false;
            },
        }),
        {
            name: 'coreload-hvac-state-v2', // Bump version for SaaS state
            version: 2,
        },
    ),
);
