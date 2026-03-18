import { useParams, Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import NotFound from './NotFound';
import { buildingTypes } from '../../data/seo/buildingTypes';
import { locations } from '../../data/seo/locations';
import { Home as HomeIcon, Calculator, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import InternalSEOLinks from '../../components/InternalSEOLinks';

export default function BuildingTypeSizing() {
    const { building } = useParams();
    
    const baseSlug = building?.replace('-hvac-sizing', '');
    const bData = buildingTypes.find(b => b.slug === baseSlug);

    if (!bData) return <NotFound />;

    return (
        <>
            <SEOHead
                title={`${bData.name} HVAC Sizing Guide & Load Calculator`}
                description={`How to calculate heating and cooling loads for a ${bData.name}. Understand the physics and insulation impacts on your HVAC tonnage requirements.`}
                path={`/sizing/${bData.slug}-hvac-sizing`}
                breadcrumbs={[
                    { name: 'CoreLoad', url: 'https://coreload-hvac.vercel.app/' },
                    { name: 'Structure Types', url: 'https://coreload-hvac.vercel.app/html-sitemap' },
                    { name: bData.name, url: `https://coreload-hvac.vercel.app/sizing/${bData.slug}-hvac-sizing` }
                ]}
            />

            <main className="pt-24 pb-24 bg-white min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8 mt-8 flex-wrap">
                        <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <Link to="/html-sitemap" className="hover:text-zinc-900 transition-colors">Structure Types</Link>
                        <ChevronRight size={14} />
                        <span className="text-zinc-900 font-bold">{bData.name}</span>
                    </div>

                    <header className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest mb-6 border border-blue-100">
                            <HomeIcon size={14} />
                            Structure Specialist
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 mb-6 leading-tight tracking-tight break-words">
                            <span className="text-blue-600">{bData.name}</span> HVAC Sizing Guide
                        </h1>
                        <p className="text-lg text-zinc-500 leading-relaxed font-medium">
                            {bData.description}
                        </p>
                    </header>

                    {/* Envelope Specs */}
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-emerald-600" size={20} />
                            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">{bData.name} Thermal Profile</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Wall R-Value</div>
                                <div className="text-2xl font-black text-zinc-900">R-{bData.typicalRWall}</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Roof R-Value</div>
                                <div className="text-2xl font-black text-zinc-900">R-{bData.typicalRRoof}</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Envelope</div>
                                <div className="text-2xl font-black text-zinc-900 capitalize">{bData.tightnessStr}</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Glass Ratio</div>
                                <div className="text-2xl font-black text-zinc-900">{(bData.glazingRatio * 100).toFixed(0)}%</div>
                            </div>
                        </div>
                    </div>

                    {/* Engineering content */}
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 mb-12">
                        <h2 className="text-xl font-black text-zinc-900 mb-4">Why {bData.name} Requires Specialized Sizing</h2>
                        <p className="text-zinc-600 leading-relaxed font-medium mb-4">
                            A standard "square footage per ton" rule fails for {bData.name.toLowerCase()} structures because the thermal envelope behaves fundamentally differently than conventional stick-built homes. 
                            With wall insulation of R-{bData.typicalRWall} and a <strong className="text-zinc-900">{bData.tightnessStr}</strong> air seal, the conductive and infiltration loads vary dramatically from standard assumptions.
                        </p>
                        <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                            At {(bData.glazingRatio * 100).toFixed(0)}% glazing ratio, solar heat gain through windows becomes {bData.glazingRatio > 0.25 ? 'the dominant cooling load component' : 'a moderate but manageable factor'}. 
                            Proper Manual J calculations account for these specific envelope parameters rather than relying on generalized rules of thumb.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-8 text-center mb-12">
                        <Zap className="text-blue-500 mx-auto mb-4" size={32} />
                        <h3 className="text-2xl font-black text-white mb-2">Size Your {bData.name} Now</h3>
                        <p className="text-zinc-400 mb-8 max-w-lg mx-auto font-medium">
                            Our block load calculator uses these exact R-values and envelope parameters to determine your correct tonnage.
                        </p>
                        <Link to="/app" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20">
                            <Calculator size={20} />
                            Start Load Calculation
                        </Link>
                    </div>

                    {/* Cross-link: this building type in every city */}
                    <div className="mb-12">
                        <h2 className="text-xl font-black text-zinc-900 mb-6">{bData.name} Sizing by City</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {locations.map(loc => (
                                <Link
                                    key={loc.slug}
                                    to={`/load-calculation/${loc.slug}/${bData.slug}`}
                                    className="text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 font-bold p-3 rounded-xl border border-zinc-100 transition-all text-center"
                                >
                                    {loc.city}, {loc.state}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <InternalSEOLinks currentPath={`/sizing/${bData.slug}-hvac-sizing`} />
                </div>
            </main>
        </>
    );
}
