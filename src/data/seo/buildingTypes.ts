export interface BuildingTypeData {
    name: string;
    slug: string;
    description: string;
    typicalRWall: number;
    typicalRRoof: number;
    tightnessStr: 'tight' | 'average' | 'loose';
    glazingRatio: number; // Percentage of wall that is glass
}

export const buildingTypes: BuildingTypeData[] = [
    { name: 'Barndominium', slug: 'barndominium', description: 'Metal building structures converted to residential living spaces. Known for high ceilings and spray foam envelopes.', typicalRWall: 20, typicalRRoof: 38, tightnessStr: 'tight', glazingRatio: 0.15 },
    { name: 'Spray Foam Attic', slug: 'spray-foam-attic', description: 'Homes utilizing unvented attics encapsulated with closed or open cell spray foam.', typicalRWall: 13, typicalRRoof: 38, tightnessStr: 'tight', glazingRatio: 0.18 },
    { name: 'Mid-Century Modern', slug: 'mid-century-modern', description: 'Homes built between 1945-1969 characterized by large single-pane glass areas, flat roofs, and minimal wall cavity insulation.', typicalRWall: 7, typicalRRoof: 19, tightnessStr: 'loose', glazingRatio: 0.35 },
    { name: 'Passivhaus', slug: 'passivhaus', description: 'Ultra-low energy buildings requiring little energy for space heating or cooling. Features extreme sealing and super-insulation.', typicalRWall: 40, typicalRRoof: 60, tightnessStr: 'tight', glazingRatio: 0.12 },
    { name: 'Historic Home (Pre-1920)', slug: 'historic-home', description: 'Legacy structures typically lacking modern insulation techniques, characterized by balloon framing and plaster walls.', typicalRWall: 4, typicalRRoof: 11, tightnessStr: 'loose', glazingRatio: 0.20 },
    { name: 'Mobile Home', slug: 'mobile-home', description: 'Manufactured housing units with strict depth limitations on wall and roof cavities.', typicalRWall: 11, typicalRRoof: 14, tightnessStr: 'average', glazingRatio: 0.15 },
    { name: 'Log Cabin', slug: 'log-cabin', description: 'Structures utilizing thermal mass of logs rather than traditional cavity insulation. Subject to shifting and air leaks without proper chinking.', typicalRWall: 14, typicalRRoof: 30, tightnessStr: 'average', glazingRatio: 0.18 },
    { name: 'Container Home', slug: 'shipping-container-home', description: 'Homes built from repurposed steel shipping containers. Requires intense continuous exterior insulation to prevent thermal bridging.', typicalRWall: 21, typicalRRoof: 30, tightnessStr: 'tight', glazingRatio: 0.25 },
    { name: 'Standard New Construction', slug: 'new-construction', description: 'Modern stick-built homes conforming to recent IECC residential energy codes.', typicalRWall: 15, typicalRRoof: 38, tightnessStr: 'average', glazingRatio: 0.18 },
    { name: 'A-Frame Cabin', slug: 'a-frame-cabin', description: 'Steeply-angled roofline structures where walls act as the roof. Prone to stratification issues.', typicalRWall: 21, typicalRRoof: 21, tightnessStr: 'average', glazingRatio: 0.30 }
];
