export interface ComparisonData {
    size1: string; // e.g., '2.5'
    size2: string; // e.g., '3.0'
    slug: string;
    btu1: number;
    btu2: number;
    description: string;
    useCase1: string;
    useCase2: string;
}

export const comparisons: ComparisonData[] = [
    { size1: '1.5', size2: '2.0', slug: '1-5-ton-vs-2-ton-ac', btu1: 18000, btu2: 24000, description: 'Comparing entry-level residential central air sizing for primary living spaces or small homes.', useCase1: 'Tight envelopes under 1,000 sq ft', useCase2: 'Standard homes up to 1,200 sq ft' },
    { size1: '2.0', size2: '2.5', slug: '2-ton-vs-2-5-ton-ac', btu1: 24000, btu2: 30000, description: 'The boundary between small and mid-sized homes. Often where multi-stage equipment begins to matter.', useCase1: 'Main floors of townhomes', useCase2: 'Split levels and small ranches' },
    { size1: '2.5', size2: '3.0', slug: '2-5-ton-vs-3-ton-ac', btu1: 30000, btu2: 36000, description: 'The most common residential AC capacity sizing question. A half-ton can radically alter latent removal capability.', useCase1: 'Strict energy-efficient builds under 1,800 sq ft', useCase2: 'Standard builds from 1,500 to 2,000 sq ft' },
    { size1: '3.0', size2: '3.5', slug: '3-ton-vs-3-5-ton-ac', btu1: 36000, btu2: 42000, description: 'Mid-to-large capacity threshold. Crucial sizing where ductwork limitations often prevent the larger size.', useCase1: 'Homes with standard 8-inch primary trunks', useCase2: 'Homes with updated enlarged return drops' },
    { size1: '3.5', size2: '4.0', slug: '3-5-ton-vs-4-ton-ac', btu1: 42000, btu2: 48000, description: 'Large capacity boundary. A 4-ton unit moves 1,600 CFM and requires serious airflow planning.', useCase1: 'Well insulated 2,500 sq ft homes', useCase2: 'Older or leakier 2,000+ sq ft homes' },
    { size1: '4.0', size2: '5.0', slug: '4-ton-vs-5-ton-ac', btu1: 48000, btu2: 60000, description: 'The maximum residential size threshold. 5-ton units are notorious for short-cycling if improperly sized.', useCase1: 'Large homes with tight envelopes', useCase2: 'Sprawling estates or extreme heat climates' }
];
