/**
 * CoreLoad — HVAC Math Engine
 * All formulas based on ACCA Manual J simplified block‐load method.
 * Core formula: BTU/hr = Area × U‐Value × ΔT
 *
 * Wall area is now dynamic: Gross = 4 × √floorArea × ceilingHeight
 * Window heat gain uses Solar Orientation Multipliers.
 */



// ── Types ────────────────────────────────────────────────────────────
export type WallInsulation = 'R-0' | 'R-7' | 'R-11' | 'R-13' | 'R-19' | 'R-21' | 'R-30' | 'R-40';
export type RoofInsulation = 'R-0' | 'R-11' | 'R-19' | 'R-30' | 'R-38' | 'R-49' | 'R-60';
export type WindowType = 'single' | 'double' | 'triple';
export type BuildingTightness = 'tight' | 'average' | 'leaky';
export type ApplianceLoad = 'standard' | 'heavy';
export type DuctLocation = 'conditioned' | 'unconditioned_basement' | 'vented_attic';
export type DuctInsulation = 'none' | 'R-4' | 'R-6' | 'R-8';
export type FloorType = 'slab_on_grade' | 'vented_crawlspace' | 'conditioned_basement';
export type FloorInsulation = 'uninsulated' | 'R-7' | 'R-11' | 'R-19';
export type FootprintShape = 'rectangle' | 'l_shape' | 'u_shape' | 'complex';

// ── Constants ────────────────────────────────────────────────────────
export const WALL_R_VALUES: Record<WallInsulation, number> = {
    'R-0': 1,
    'R-7': 7,
    'R-11': 11,
    'R-13': 13,
    'R-19': 19,
    'R-21': 21,
    'R-30': 30,
    'R-40': 40,
};

export const ROOF_R_VALUES: Record<RoofInsulation, number> = {
    'R-0': 2,
    'R-11': 11,
    'R-19': 19,
    'R-30': 30,
    'R-38': 38,
    'R-49': 49,
    'R-60': 60,
};

export const WINDOW_U_VALUES: Record<WindowType, number> = {
    single: 1.1,
    double: 0.5,
    triple: 0.3,
};

export const WINDOW_SHGC: Record<WindowType, number> = {
    single: 0.86,
    double: 0.76,
    triple: 0.40,
};

// Note: Solar multipliers are now hardcoded in the cooling loop 
// North: 1.0, East: 1.2, South: 1.4, West: 1.8

export const INFILTRATION_ACH: Record<BuildingTightness, number> = {
    tight: 0.3,
    average: 0.6,
    leaky: 1.2,
};

// Internal Loads
export const OCCUPANT_SENSIBLE_BTU = 230;
export const OCCUPANT_LATENT_BTU = 200;

export const APPLIANCE_BTU: Record<ApplianceLoad, number> = {
    standard: 1200, // Typical fridge, TV, lighting
    heavy: 2400, // + extra fridge/freezer, gaming PCs, excessive lighting
};

export const FLOOR_U_VALUES: Record<FloorType, Record<FloorInsulation, number>> = {
    slab_on_grade: {
        uninsulated: 0.10,
        'R-7': 0.05,
        'R-11': 0.04,
        'R-19': 0.03,
    },
    vented_crawlspace: {
        uninsulated: 0.25,
        'R-7': 0.12,
        'R-11': 0.09,
        'R-19': 0.05,
    },
    conditioned_basement: {
        uninsulated: 0.05,
        'R-7': 0.03,
        'R-11': 0.02,
        'R-19': 0.01,
    }
};

// Removed arbitrary DUCT_LOSS_FACTORS, replaced with physical surface area calculations in main function.

const AVG_SOLAR_INSOLATION = 60;

// ── Core formulas ────────────────────────────────────────────────────

export function calculateHeatLoss(
    area: number,
    uValue: number,
    deltaT: number,
): number {
    return area * uValue * deltaT;
}

export function calculateHeatGain(
    area: number,
    uValue: number,
    deltaT: number,
    solarGainFactor: number = 0,
    solarInsolation: number = AVG_SOLAR_INSOLATION,
): number {
    const conductionGain = area * uValue * deltaT;
    const solarGain = area * solarGainFactor * solarInsolation;
    return conductionGain + solarGain;
}

export function calculateSensibleInfiltration(
    volume: number,
    ach: number,
    deltaT: number,
): number {
    return volume * ach * 0.018 * deltaT;
}

export function calculateLatentInfiltration(
    volume: number,
    ach: number,
    deltaGrains: number,
): number {
    // Q_latent = 0.68 × CFM × ΔGrains, where CFM = Volume × ACH / 60
    // Combined factor: 0.68 / 60 = 0.01133
    return volume * ach * 0.01133 * deltaGrains;
}

// ── Helpers ──────────────────────────────────────────────────────────

export function rValueToUValue(rValue: number): number {
    return 1 / Math.max(rValue, 0.01);
}

export function btuToTonnage(btu: number): number {
    return btu / 12_000;
}

// ── Aggregate calculator ─────────────────────────────────────────────

export interface HVACInputs {
    winterDesign: number;
    summerDesign: number;
    elevation: number;
    heatingSetpoint: number;
    coolingSetpoint: number;
    latentGrains: number;
    buildingLength: number;
    buildingWidth: number;
    ceilingHeight: number;
    isVaulted?: boolean;
    vaultedHeight?: number;
    wallInsulation: WallInsulation;
    roofInsulation: RoofInsulation;
    floorType: FloorType;
    floorInsulation: FloorInsulation;
    windowAreaNorth: number;
    windowAreaSouth: number;
    windowAreaEast: number;
    windowAreaWest: number;
    windowType: WindowType;
    tightness: BuildingTightness;
    occupants: number;
    applianceLoad: ApplianceLoad;
    ductLocation: DuctLocation;
    ductInsulation: DuctInsulation;
    distanceToDucts?: number;
    footprintShape: FootprintShape;
}

export interface HVACResults {
    heatingBTU: number;
    coolingBTU: number;
    totalBTU: number;
    tonnage: number;
    wallArea: number;
    volume: number;
    wallHeatLoss: number;
    roofHeatLoss: number;
    windowHeatLoss: number;
    wallHeatGain: number;
    roofHeatGain: number;
    windowHeatGain: number;
    infiltrationHeating: number;
    infiltrationCoolingSensible: number;
    infiltrationCoolingLatent: number;
    internalSensible: number;
    internalLatent: number;
    ductLossHeating: number;
    ductLossCoolingSensible: number;
    ductLossCoolingLatent: number;
    floorLoss: number;
    floorGain: number;
    // True Physics Metrics
    totalSensibleCooling: number;
    totalLatentCooling: number;
    sensibleHeatRatio: number;
}

function calculateWallArea(length: number, width: number, ceilingHeight: number, windowArea: number, shape: FootprintShape, isVaulted: boolean = false, vaultedHeight: number = 0): number {
    const basePerimeter = 2 * (length + width);
    // Multiply perimeter to account for extra corners/jogs in non-rectangular shapes
    const shapeMultipliers: Record<FootprintShape, number> = {
        rectangle: 1.0,
        l_shape: 1.15,
        u_shape: 1.25,
        complex: 1.35
    };
    
    const actualPerimeter = basePerimeter * shapeMultipliers[shape];
    const baseWallArea = actualPerimeter * ceilingHeight;

    // Gable ends: Assuming gables are on the 'width' sides (standard for rectangles)
    // Area of two triangles = 2 * (0.5 * base * height) = width * vaultedHeight
    const gableArea = isVaulted ? (width * vaultedHeight) : 0;

    const grossWallArea = baseWallArea + gableArea;
    return Math.max(grossWallArea - windowArea, 0);
}

export function calculateTotalLoad(inputs: HVACInputs): HVACResults {
    // ── Input Validation Guards ──────────────────────────────────────────
    const safeNum = (v: number, fallback: number, min = 0, max = 99999) =>
        (typeof v === 'number' && Number.isFinite(v)) ? Math.max(min, Math.min(v, max)) : fallback;

    const i = {
        ...inputs,
        winterDesign: safeNum(inputs.winterDesign, 20, -60, 80),
        summerDesign: safeNum(inputs.summerDesign, 95, 50, 130),
        elevation: safeNum(inputs.elevation, 0, 0, 15000),
        heatingSetpoint: safeNum(inputs.heatingSetpoint, 70, 50, 85),
        coolingSetpoint: safeNum(inputs.coolingSetpoint, 75, 60, 90),
        latentGrains: safeNum(inputs.latentGrains, 35, 0, 200),
        buildingLength: safeNum(inputs.buildingLength, 50, 10, 300),
        buildingWidth: safeNum(inputs.buildingWidth, 30, 10, 300),
        ceilingHeight: safeNum(inputs.ceilingHeight, 8, 6, 30),
        windowAreaNorth: safeNum(inputs.windowAreaNorth, 0, 0, 2000),
        windowAreaSouth: safeNum(inputs.windowAreaSouth, 0, 0, 2000),
        windowAreaEast: safeNum(inputs.windowAreaEast, 0, 0, 2000),
        windowAreaWest: safeNum(inputs.windowAreaWest, 0, 0, 2000),
        occupants: safeNum(inputs.occupants, 3, 0, 50),
        vaultedHeight: safeNum(inputs.vaultedHeight ?? 0, 0, 0, 20),
    };

    const heatingDeltaT = i.heatingSetpoint - i.winterDesign;
    const coolingDeltaT = i.summerDesign - i.coolingSetpoint;

    // Altitude Correction (Air Density)
    // Standard Barometric Formula: (1 - 0.000006875 * elevation)^5.2559
    const densityMultiplier = Math.max(0.65, Math.pow(1 - (0.000006875 * i.elevation), 5.2559));

    const wallU = rValueToUValue(WALL_R_VALUES[i.wallInsulation]);
    const roofU = rValueToUValue(ROOF_R_VALUES[i.roofInsulation]);
    const floorU = FLOOR_U_VALUES[i.floorType][i.floorInsulation];
    const windowU = WINDOW_U_VALUES[i.windowType];
    const windowSHGC = WINDOW_SHGC[i.windowType];

    const totalWindowArea = i.windowAreaNorth + i.windowAreaSouth + i.windowAreaEast + i.windowAreaWest;

    const floorArea = i.buildingLength * i.buildingWidth;
    const wallArea = calculateWallArea(
        i.buildingLength,
        i.buildingWidth,
        i.ceilingHeight,
        totalWindowArea,
        i.footprintShape,
        i.isVaulted,
        i.vaultedHeight
    );

    // Building Volume: Block + Triangular Prism (if vaulted)
    const baseVolume = floorArea * i.ceilingHeight;
    const vaultedVolume = i.isVaulted ? (floorArea * i.vaultedHeight) / 2 : 0;
    const volume = baseVolume + vaultedVolume;

    // Roof Area (Projected vs Actual Surface Area)
    let roofArea = floorArea;
    if (i.isVaulted && i.vaultedHeight) {
        const halfWidth = i.buildingWidth / 2;
        const slopeLength = Math.sqrt(Math.pow(halfWidth, 2) + Math.pow(i.vaultedHeight, 2));
        roofArea = 2 * (i.buildingLength * slopeLength);
    }

    const ach = INFILTRATION_ACH[i.tightness];

    // ── HEATING (winter) ──────────────────────────────────────────────
    const wallHeatLoss = calculateHeatLoss(wallArea, wallU, heatingDeltaT);
    const roofHeatLoss = calculateHeatLoss(roofArea, roofU, heatingDeltaT);
    const windowHeatLoss = calculateHeatLoss(totalWindowArea, windowU, heatingDeltaT);
    
    // Floor Loss (Manual J uses ground temp, simplified here to 50% of deltaT for slab)
    const floorLoss = floorArea * floorU * (heatingDeltaT * 0.5);

    // Sensible Infiltration with Altitude Correction
    const infiltrationHeating = calculateSensibleInfiltration(volume, ach, heatingDeltaT) * densityMultiplier;

    const rawHeatingBTU = wallHeatLoss + roofHeatLoss + windowHeatLoss + floorLoss + infiltrationHeating;

    // ── COOLING (summer) — solar multiplier on windows only ───────────
    const wallHeatGain = calculateHeatGain(wallArea, wallU, coolingDeltaT);
    const roofHeatGain = calculateHeatGain(roofArea, roofU, coolingDeltaT);
    const floorGain = floorArea * floorU * (coolingDeltaT * 0.2); // Slabs stay cooler

    // Adjust solar insolation multiplier based on summer design temp (baseline 90F is 1.0)
    const solarMultiplier = Math.max(0.5, Math.min(1.5, (i.summerDesign - 60) / 30));

    // Calculate window heat gain
    const windowHeatGainN = calculateHeatGain(i.windowAreaNorth, windowU, coolingDeltaT, windowSHGC, 20 * solarMultiplier);
    const windowHeatGainS = calculateHeatGain(i.windowAreaSouth, windowU, coolingDeltaT, windowSHGC, 45 * solarMultiplier);
    const windowHeatGainE = calculateHeatGain(i.windowAreaEast, windowU, coolingDeltaT, windowSHGC, 50 * solarMultiplier);
    const windowHeatGainW = calculateHeatGain(i.windowAreaWest, windowU, coolingDeltaT, windowSHGC, 80 * solarMultiplier);

    const windowHeatGain = windowHeatGainN + windowHeatGainS + windowHeatGainE + windowHeatGainW;

    // Infiltration during cooling includes sensible AND latent (humidity) loads
    const infiltrationCoolingSensible = calculateSensibleInfiltration(volume, ach, coolingDeltaT) * densityMultiplier;
    const infiltrationCoolingLatent = calculateLatentInfiltration(volume, ach, i.latentGrains);

    // ── INTERNAL LOADS (Cooling only) ─────────────────────────────────
    const occupantsSensible = i.occupants * OCCUPANT_SENSIBLE_BTU;
    const occupantsLatent = i.occupants * OCCUPANT_LATENT_BTU;
    const applianceSensible = APPLIANCE_BTU[i.applianceLoad];

    const internalSensible = occupantsSensible + applianceSensible;
    const internalLatent = occupantsLatent;

    // Split raw cooling into sensible and latent
    const rawCoolingSensible = wallHeatGain + roofHeatGain + windowHeatGain + floorGain + infiltrationCoolingSensible + internalSensible;
    const rawCoolingLatent = infiltrationCoolingLatent + internalLatent;

    // ── DUCT LOSSES ───────────────────────────────────────────────────
    const ductSurfaceArea = floorArea * 0.25;

    const ductUValues: Record<DuctInsulation, number> = {
        'none': 1.0, 
        'R-4': 0.25,
        'R-6': 0.16,
        'R-8': 0.125,
    };

    const ductU = ductUValues[i.ductInsulation];

    let ductLossHeating = 0;
    let ductLossCoolingSensible = 0;
    let ductLossCoolingLatent = 0;

    if (i.ductLocation !== 'conditioned') {
        let ductAmbientWinter = 0;
        let ductAmbientSummer = 0;

        if (i.ductLocation === 'vented_attic') {
            ductAmbientWinter = i.winterDesign + 10;
            ductAmbientSummer = i.summerDesign + 40; 
        } else if (i.ductLocation === 'unconditioned_basement') {
            ductAmbientWinter = i.winterDesign + 30;
            ductAmbientSummer = i.summerDesign - 10;
        }

        const supplyHeatingTemp = 105;
        const supplyCoolingTemp = 55;

        const ductDeltaT_Heating = Math.max(0, supplyHeatingTemp - ductAmbientWinter);
        const ductDeltaT_Cooling = Math.max(0, ductAmbientSummer - supplyCoolingTemp);

        ductLossHeating = ductSurfaceArea * ductU * ductDeltaT_Heating * 1.5;
        const totalDuctCoolingGain = ductSurfaceArea * ductU * ductDeltaT_Cooling * 1.5;
        
        ductLossCoolingSensible = totalDuctCoolingGain * 0.9;
        ductLossCoolingLatent = totalDuctCoolingGain * 0.1;
    }

    const heatingBTU = Math.round(rawHeatingBTU + ductLossHeating);
    
    const totalSensibleCooling = Math.round(rawCoolingSensible + ductLossCoolingSensible);
    const totalLatentCooling = Math.round(rawCoolingLatent + ductLossCoolingLatent);
    const coolingBTU = totalSensibleCooling + totalLatentCooling;

    const totalBTU = Math.max(heatingBTU, coolingBTU);
    const tonnage = Math.round(btuToTonnage(totalBTU) * 10) / 10;
    
    // SHR = Sensible / Total
    const sensibleHeatRatio = Number((totalSensibleCooling / coolingBTU).toFixed(2));

    // Guard all output values against NaN/Infinity
    const sf = (v: number): number => (Number.isFinite(v) ? v : 0);

    return {
        heatingBTU: sf(heatingBTU),
        coolingBTU: sf(coolingBTU),
        totalBTU: sf(totalBTU),
        tonnage: sf(tonnage),
        wallArea: sf(Math.round(wallArea)),
        volume: sf(Math.round(volume)),
        wallHeatLoss: sf(Math.round(wallHeatLoss)),
        roofHeatLoss: sf(Math.round(roofHeatLoss)),
        windowHeatLoss: sf(Math.round(windowHeatLoss)),
        wallHeatGain: sf(Math.round(wallHeatGain)),
        roofHeatGain: sf(Math.round(roofHeatGain)),
        windowHeatGain: sf(Math.round(windowHeatGain)),
        infiltrationHeating: sf(Math.round(infiltrationHeating)),
        infiltrationCoolingSensible: sf(Math.round(infiltrationCoolingSensible)),
        infiltrationCoolingLatent: sf(Math.round(infiltrationCoolingLatent)),
        internalSensible: sf(Math.round(internalSensible)),
        internalLatent: sf(Math.round(internalLatent)),
        ductLossHeating: sf(Math.round(ductLossHeating)),
        ductLossCoolingSensible: sf(Math.round(ductLossCoolingSensible)),
        ductLossCoolingLatent: sf(Math.round(ductLossCoolingLatent)),
        floorLoss: sf(Math.round(floorLoss)),
        floorGain: sf(Math.round(floorGain)),
        totalSensibleCooling: sf(totalSensibleCooling),
        totalLatentCooling: sf(totalLatentCooling),
        sensibleHeatRatio: sf(sensibleHeatRatio),
    };
}
