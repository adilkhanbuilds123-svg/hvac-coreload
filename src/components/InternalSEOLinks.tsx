import { Link } from 'react-router-dom';
import { locations } from '../data/seo/locations';
import { buildingTypes } from '../data/seo/buildingTypes';
import { comparisons } from '../data/seo/comparisons';
import { MapPin, Home as HomeIcon, SplitSquareHorizontal } from 'lucide-react';

interface InternalSEOLinksProps {
    currentPath: string;
}

export default function InternalSEOLinks({ currentPath }: InternalSEOLinksProps) {
    // Pick 4 random related links from each category for deep interlacing
    // In a real app with more data, these would be geographically or conceptually related.
    // For now, pseudo-random slicing based on string length is deterministic-ish enough.
    const pathLen = currentPath.length;
    
    const relatedLocations = [
        locations[(pathLen) % locations.length],
        locations[(pathLen + 3) % locations.length],
        locations[(pathLen + 7) % locations.length],
    ];

    const relatedBuildings = [
        buildingTypes[(pathLen + 1) % buildingTypes.length],
        buildingTypes[(pathLen + 4) % buildingTypes.length],
    ];

    const relatedComparisons = [
        comparisons[(pathLen + 2) % comparisons.length],
        comparisons[(pathLen + 5) % comparisons.length],
    ];

    const combinedLink = {
        loc: locations[(pathLen + 2) % locations.length],
        b: buildingTypes[(pathLen + 6) % buildingTypes.length]
    };

    return (
        <div className="mt-16 pt-12 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white mb-8">More HVAC Sizing Guides</h3>
            
            <div className="grid md:grid-cols-3 gap-8">
                {/* Locations Silo */}
                <div>
                    <div className="flex items-center gap-2 mb-4 text-cyan-400">
                        <MapPin size={18} />
                        <h4 className="font-semibold">By Climate Zone</h4>
                    </div>
                    <ul className="space-y-3">
                        {relatedLocations.map(loc => (
                            <li key={loc.slug}>
                                <Link 
                                    to={`/load-calculation/${loc.slug}`} 
                                    className="text-sm text-slate-400 hover:text-cyan-300 transition-colors"
                                >
                                    HVAC Sizing in {loc.city}, {loc.state}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Buildings Silo */}
                <div>
                    <div className="flex items-center gap-2 mb-4 text-blue-400">
                        <HomeIcon size={18} />
                        <h4 className="font-semibold">By Building Type</h4>
                    </div>
                    <ul className="space-y-3">
                        {relatedBuildings.map(b => (
                            <li key={b.slug}>
                                <Link 
                                    to={`/sizing/${b.slug}-hvac-sizing`} 
                                    className="text-sm text-slate-400 hover:text-blue-300 transition-colors"
                                >
                                    {b.name} Load Calculations
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Comparisons Silo */}
                <div>
                    <div className="flex items-center gap-2 mb-4 text-emerald-400">
                        <SplitSquareHorizontal size={18} />
                        <h4 className="font-semibold">Tonnage Comparisons</h4>
                    </div>
                    <ul className="space-y-3">
                        {relatedComparisons.map(c => (
                            <li key={c.slug}>
                                <Link 
                                    to={`/compare/${c.slug}`} 
                                    className="text-sm text-slate-400 hover:text-emerald-300 transition-colors"
                                >
                                    {c.size1} vs {c.size2} Ton AC Units
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link 
                                to={`/load-calculation/${combinedLink.loc.slug}/${combinedLink.b.slug}`}
                                className="text-xs font-bold text-cyan-500 hover:text-cyan-400 transition-colors border-t border-slate-800 mt-2 pt-2 block"
                            >
                                {combinedLink.b.name} in {combinedLink.loc.city} Guide
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
