import { describe, it, expect } from 'vitest';
import { calculateTotalLoad, type BuildingTightness, type HVACInputs } from './hvac-math';

describe('Manual J HVAC Core Load Calculator', () => {

    const baseProjectParams: HVACInputs = {
        buildingLength: 40,
        buildingWidth: 30,  // 1200 sq ft
        ceilingHeight: 10,
        footprintShape: 'rectangle',
        isVaulted: false,
        vaultedHeight: 0,
        wallInsulation: 'R-13',
        roofInsulation: 'R-38',
        windowAreaNorth: 50,
        windowAreaSouth: 80,
        windowAreaEast: 30,
        windowAreaWest: 40,  // 200 total window area
        windowType: 'double',
        tightness: 'average' as BuildingTightness,
        ductLocation: 'conditioned',
        ductInsulation: 'none',
        floorType: 'slab_on_grade',
        floorInsulation: 'R-7',
        winterDesign: 32, // Typical winter
        summerDesign: 95, // Typical summer
        heatingSetpoint: 70,
        coolingSetpoint: 75,
        latentGrains: 40,
        elevation: 500,
        occupants: 4,
        applianceLoad: 'standard',
    };

    it('should correctly calculate a baseline load', () => {
        const result = calculateTotalLoad(baseProjectParams);

        // Basic assertions to ensure math runs cleanly
        expect(result.heatingBTU).toBeGreaterThan(0);
        expect(result.coolingBTU).toBeGreaterThan(0);
        expect(result.totalBTU).toBeGreaterThan(0);
        expect(result.tonnage).toBeGreaterThanOrEqual(1.5);
        expect(result.tonnage).toBeLessThanOrEqual(4);
    });

    it('should scale significantly for extreme heating (Fargo, ND)', () => {
        const fargoResult = calculateTotalLoad({
            ...baseProjectParams,
            winterDesign: -20, // Extreme cold
            summerDesign: 85,
        });

        const miamiResult = calculateTotalLoad({
            ...baseProjectParams,
            winterDesign: 55, // Mild winter
            summerDesign: 95,
        });

        // Fargo should require massively more heating BTUs than Miami
        expect(fargoResult.heatingBTU).toBeGreaterThan(miamiResult.heatingBTU * 2);
    });

    it('should scale significantly for extreme cooling (Phoenix, AZ)', () => {
        const phoenixResult = calculateTotalLoad({
            ...baseProjectParams,
            summerDesign: 115, // Extreme heat
            winterDesign: 40,
        });

        const seattleResult = calculateTotalLoad({
            ...baseProjectParams,
            summerDesign: 80, // Mild summer
            winterDesign: 35,
        });

        // Phoenix should require massively more cooling BTUs than Seattle
        expect(phoenixResult.coolingBTU).toBeGreaterThan(seattleResult.coolingBTU * 1.5);
    });

    it('should calculate higher infiltration load for leaky houses vs tight houses', () => {
        const leakyResult = calculateTotalLoad({
            ...baseProjectParams,
            tightness: 'leaky', // 1.2 ACH
        });

        const tightResult = calculateTotalLoad({
            ...baseProjectParams,
            tightness: 'tight', // 0.3 ACH
        });

        // The specific line item for infiltration should be strictly higher
        expect(leakyResult.infiltrationHeating).toBeGreaterThan(tightResult.infiltrationHeating * 3);
        expect(leakyResult.infiltrationCoolingSensible).toBeGreaterThan(tightResult.infiltrationCoolingSensible * 3);
    });

    it('should account for latent moisture load (Miami, FL vs Phoenix, AZ)', () => {
        const humidResult = calculateTotalLoad({
            ...baseProjectParams,
            latentGrains: 70, // Humid Miami
        });

        const dryResult = calculateTotalLoad({
            ...baseProjectParams,
            latentGrains: -10, // Dry Phoenix
        });

        // Latent load should be directly impacted by grains diff
        expect(humidResult.infiltrationCoolingLatent).toBeGreaterThan(dryResult.infiltrationCoolingLatent);
    });

    it('should increase volume (and thus infiltration) when vaulted ceilings are enabled', () => {
        const flatResult = calculateTotalLoad({
            ...baseProjectParams,
            isVaulted: false,
        });

        const vaultedResult = calculateTotalLoad({
            ...baseProjectParams,
            isVaulted: true,
            vaultedHeight: 10,
        });

        // Vaulted ceiling adds a triangular prism volume, so infiltration BTUs should rise
        expect(vaultedResult.infiltrationHeating).toBeGreaterThan(flatResult.infiltrationHeating);
    });
});
