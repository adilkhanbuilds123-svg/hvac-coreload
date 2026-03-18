/**
 * CoreLoad — Global Unit Conversion
 * All state is persisted in Imperial (BTUs, SqFt, Fahrenheit).
 * These functions convert those values for display and input when useMetricUnits is true.
 */

// Square Feet to Square Meters
export function sqftToSqm(sqft: number): number {
    return Math.round(sqft * 0.092903);
}

export function sqmToSqft(sqm: number): number {
    return Math.round(sqm * 10.7639);
}

// Feet to Meters (for ceilings)
export function ftToM(ft: number): number {
    return Math.round(ft * 0.3048 * 10) / 10;
}

export function mToFt(m: number): number {
    return Math.round(m * 3.28084 * 10) / 10;
}

// Fahrenheit to Celsius
export function fToC(f: number): number {
    return Math.round((f - 32) * (5 / 9));
}

export function cToF(c: number): number {
    return Math.round((c * 9 / 5) + 32);
}

// BTU/hr to kW
export function btuToKw(btu: number): number {
    return Math.round((btu * 0.000293071) * 10) / 10;
}
