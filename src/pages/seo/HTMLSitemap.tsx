import SEOHead from '../../components/SEOHead';
import { Link } from 'react-router-dom';
import { Calculator, BookOpen, ChevronRight, Activity, MapPin, Home as HomeIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { locations } from '../../data/seo/locations';
import { buildingTypes } from '../../data/seo/buildingTypes';
import { comparisons } from '../../data/seo/comparisons';

export default function HTMLSitemap() {
    return (
        <>
            <SEOHead
                title="HTML Sitemap | CoreLoad HVAC Calculators"
                description="A complete index of all HVAC load calculators, sizing tools, and technical engineering articles available on CoreLoad."
                path="/html-sitemap"
            />
            <Helmet>
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org",
                      "@type": "ItemList",
                      "itemListElement": [
                        {
                          "@type": "ListItem",
                          "position": 1,
                          "url": "https://coreload-hvac.vercel.app/manual-j-calculator",
                          "name": "Manual J Load Calculator"
                        },
                        {
                          "@type": "ListItem",
                          "position": 2,
                          "url": "https://coreload-hvac.vercel.app/btu-calculator",
                          "name": "Heating & Cooling BTU Calculator"
                        },
                        {
                          "@type": "ListItem",
                          "position": 3,
                          "url": "https://coreload-hvac.vercel.app/hvac-tonnage-calculator",
                          "name": "AC Tonnage Sizing Calculator"
                        },
                        {
                          "@type": "ListItem",
                          "position": 4,
                          "url": "https://coreload-hvac.vercel.app/blog",
                          "name": "HVAC Engineering Blog"
                        }
                      ]
                    }
                    `}
                </script>
            </Helmet>

            <main className="relative pt-32 pb-24 px-4 min-h-[80vh] bg-white">
                <div className="relative z-10 max-w-4xl mx-auto">

                    <div className="text-center mb-16">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 mb-6 tracking-tight">
                            Site <span className="text-blue-600">Directory</span>
                        </h1>
                        <p className="text-lg text-zinc-500 max-w-2xl mx-auto font-medium">
                            A complete index of all our free HVAC sizing tools and technical engineering resources.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        {/* Calculators Category */}
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <Calculator className="text-blue-600" size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-zinc-900">HVAC Tools</h2>
                            </div>

                            <ul className="space-y-3">
                                <li>
                                    <Link to="/" className="group flex items-center justify-between text-zinc-600 hover:text-zinc-900 transition-colors p-3 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200">
                                        <span className="font-bold">CoreLoad Home</span>
                                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manual-j-calculator" className="group flex items-center justify-between text-zinc-600 hover:text-zinc-900 transition-colors p-3 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200">
                                        <span className="font-bold">Manual J Load Calculator</span>
                                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/btu-calculator" className="group flex items-center justify-between text-zinc-600 hover:text-zinc-900 transition-colors p-3 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200">
                                        <span className="font-bold">Heating & Cooling BTU Calculator</span>
                                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/hvac-tonnage-calculator" className="group flex items-center justify-between text-zinc-600 hover:text-zinc-900 transition-colors p-3 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200">
                                        <span className="font-bold">AC Tonnage Sizing Calculator</span>
                                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Engineering Blog Category */}
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <BookOpen className="text-emerald-600" size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-zinc-900">Engineering Blog</h2>
                            </div>

                            <ul className="space-y-3">
                                <li>
                                    <Link to="/blog" className="group flex items-center justify-between text-zinc-600 hover:text-zinc-900 transition-colors p-3 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200">
                                        <span className="font-bold">Articles Overview</span>
                                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog/how-to-size-ac" className="group flex items-center justify-between text-zinc-600 hover:text-zinc-900 transition-colors p-3 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200">
                                        <span className="font-bold">How to Size an Air Conditioner</span>
                                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog/sensible-vs-latent-heat" className="group flex items-center justify-between text-zinc-600 hover:text-zinc-900 transition-colors p-3 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200">
                                        <span className="font-bold">Sensible vs Latent Heat</span>
                                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog/understanding-seer2" className="group flex items-center justify-between text-zinc-600 hover:text-zinc-900 transition-colors p-3 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200">
                                        <span className="font-bold">Understanding SEER2</span>
                                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog/manual-j-vs-rule-of-thumb" className="group flex items-center justify-between text-zinc-600 hover:text-zinc-900 transition-colors p-3 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200">
                                        <span className="font-bold">Manual J vs. Rule of Thumb</span>
                                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog/duct-losses-hidden-tax" className="group flex items-center justify-between text-zinc-600 hover:text-zinc-900 transition-colors p-3 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200">
                                        <span className="font-bold">Duct Losses: The Hidden 30% Tax</span>
                                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog/heat-pumps-at-altitude" className="group flex items-center justify-between text-zinc-600 hover:text-zinc-900 transition-colors p-3 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200">
                                        <span className="font-bold">Heat Pumps at Altitude</span>
                                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog/window-orientation-matters" className="group flex items-center justify-between text-zinc-600 hover:text-zinc-900 transition-colors p-3 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200">
                                        <span className="font-bold">Window Orientation Matters</span>
                                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <div className="mt-12 text-center mb-8">
                        <h2 className="text-2xl font-black text-zinc-900 mb-2">Detailed Sizing Specifications</h2>
                        <p className="text-zinc-500 font-medium">Deep-dive engineering parameters for specific climates, structures, and systems.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Locations */}
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                            <div className="flex items-center gap-2 mb-4 text-blue-600">
                                <MapPin size={18} />
                                <h3 className="text-lg font-black text-zinc-900">City Climates</h3>
                            </div>
                            <ul className="space-y-2">
                                {locations.map(loc => (
                                    <li key={loc.slug}>
                                        <Link to={`/load-calculation/${loc.slug}`} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors block py-1 font-medium">
                                            HVAC Sizing in {loc.city}, {loc.state}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Building Types */}
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                            <div className="flex items-center gap-2 mb-4 text-emerald-600">
                                <HomeIcon size={18} />
                                <h3 className="text-lg font-black text-zinc-900">Structure Types</h3>
                            </div>
                            <ul className="space-y-2">
                                {buildingTypes.map(b => (
                                    <li key={b.slug}>
                                        <Link to={`/sizing/${b.slug}-hvac-sizing`} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors block py-1 font-medium">
                                            {b.name} Load Calculations
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Comparisons */}
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                            <div className="flex items-center gap-2 mb-4 text-amber-600">
                                <Activity size={18} />
                                <h3 className="text-lg font-black text-zinc-900">Unit Comparisons</h3>
                            </div>
                            <ul className="space-y-2">
                                {comparisons.map(c => (
                                    <li key={c.slug}>
                                        <Link to={`/compare/${c.slug}`} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors block py-1 font-medium">
                                            {c.size1} vs {c.size2} Ton AC Unit
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 text-center mb-12">
                        <h2 className="text-2xl font-black text-zinc-900 mb-4">Structure-Specific Climate Guides</h2>
                        <p className="text-zinc-500 max-w-2xl mx-auto font-medium">Deep-dive engineering parameters for specific building types across all {locations.length} major US climate zones.</p>
                    </div>

                    {/* Group by state for organization — ALL 200 combined pages */}
                    {Object.entries(
                        locations.reduce((acc, loc) => {
                            if (!acc[loc.state]) acc[loc.state] = [];
                            acc[loc.state].push(loc);
                            return acc;
                        }, {} as Record<string, typeof locations>)
                    ).map(([stateName, stateLocs]) => (
                        <div key={stateName} className="mb-8">
                            <h3 className="text-sm font-black text-blue-600 mb-4 uppercase tracking-widest border-b border-zinc-200 pb-2">{stateName}</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {stateLocs.map(loc => (
                                    <div key={loc.slug} className="bg-zinc-50 rounded-xl border border-zinc-200 p-4">
                                        <h4 className="text-sm font-black text-zinc-900 mb-3">{loc.city} — Zone {loc.climateZone}</h4>
                                        <ul className="space-y-1">
                                            {buildingTypes.map(b => (
                                                <li key={b.slug}>
                                                    <Link 
                                                        to={`/load-calculation/${loc.slug}/${b.slug}`} 
                                                        className="text-[11px] text-zinc-400 hover:text-zinc-900 transition-colors block truncate font-medium"
                                                    >
                                                        {b.name} Sizing
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                </div>
            </main>
        </>
    );
}
