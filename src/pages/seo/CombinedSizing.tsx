import { useParams, Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import NotFound from './NotFound';
import { locations } from '../../data/seo/locations';
import { buildingTypes } from '../../data/seo/buildingTypes';
import { MapPin, Home as HomeIcon, Calculator, ChevronRight, ThermometerSun, ShieldCheck, Zap } from 'lucide-react';
import InternalSEOLinks from '../../components/InternalSEOLinks';

export default function CombinedSizing() {
    const { state, city, building } = useParams();
    
    const locSlug = `${state}/${city}`;
    const locData = locations.find(l => l.slug === locSlug);
    const bData = buildingTypes.find(b => b.slug === building);

    if (!locData || !bData) return <NotFound />;

    const title = `${bData.name} HVAC Sizing in ${locData.city}, ${locData.state} | Manual J Guide`;
    const description = `Calculate the precise heating and cooling load for a ${bData.name} located in ${locData.city}, ${locData.state}. Factors in ${locData.summerDesignTemp}°F design summer peaks and ${bData.name} envelope physics.`;

    return (
        <>
            <SEOHead
                title={title}
                description={description}
                path={`/load-calculation/${locData.slug}/${bData.slug}`}
                breadcrumbs={[
                    { name: 'CoreLoad', url: 'https://coreload-hvac.vercel.app/' },
                    { name: 'Locations', url: 'https://coreload-hvac.vercel.app/html-sitemap' },
                    { name: locData.city, url: `https://coreload-hvac.vercel.app/load-calculation/${locData.slug}` },
                    { name: bData.name, url: `https://coreload-hvac.vercel.app/load-calculation/${locData.slug}/${bData.slug}` }
                ]}
            />

            <main className="pt-24 pb-24 bg-white min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8 mt-8 flex-wrap">
                        <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <Link to="/html-sitemap" className="hover:text-zinc-900 transition-colors">Sizing</Link>
                        <ChevronRight size={14} />
                        <Link to={`/load-calculation/${locData.slug}`} className="hover:text-zinc-900 transition-colors">{locData.city}</Link>
                        <ChevronRight size={14} />
                        <span className="text-zinc-900 font-bold">{bData.name}</span>
                    </div>

                    <header className="mb-12">
                        <div className="flex flex-wrap gap-2 mb-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-black uppercase tracking-widest border border-zinc-200">
                                <MapPin size={14} />
                                {locData.city}, {locData.state}
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest border border-blue-100">
                                <HomeIcon size={14} />
                                {bData.name}
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 mb-6 leading-tight tracking-tight break-words">
                            Sizing HVAC for a <span className="text-blue-600">{bData.name}</span>{' '}
                            in {locData.city}
                        </h1>
                        <p className="text-lg text-zinc-500 leading-relaxed font-medium">
                            Engineering a {bData.name.toLowerCase()} for the unique climate of {locData.city} requires balancing high-performance envelope metrics with IECC {locData.ieccVersion} code requirements and Zone {locData.climateZone} design conditions.
                        </p>
                    </header>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {/* Climate Stats */}
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <ThermometerSun className="text-amber-600" size={20} />
                                <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Local Design Conditions</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded-xl border border-zinc-100 shadow-sm">
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Summer Peak</div>
                                    <div className="text-2xl font-black text-zinc-900 tabular-nums">{locData.summerDesignTemp}°F</div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-zinc-100 shadow-sm">
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Winter Low</div>
                                    <div className="text-2xl font-black text-zinc-900 tabular-nums">{locData.winterDesignTemp}°F</div>
                                </div>
                            </div>
                        </div>

                        {/* Envelope Stats */}
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <ShieldCheck className="text-emerald-600" size={20} />
                                <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Envelope Standards</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded-xl border border-zinc-100 shadow-sm">
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Wall R-Value</div>
                                    <div className="text-2xl font-black text-emerald-600">R-{bData.typicalRWall}</div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-zinc-100 shadow-sm">
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Tightness</div>
                                    <div className="text-2xl font-black text-emerald-600 capitalize">{bData.tightnessStr}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Editorial: Combined local + building type challenge */}
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 mb-12">
                        <h2 className="text-xl font-black text-zinc-900 mb-4">The {locData.city} {bData.name} Sizing Challenge</h2>
                        <p className="text-zinc-600 leading-relaxed font-medium mb-6">
                            {locData.localChallenge}
                        </p>
                        <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                            When calculating the load for a <strong className="text-zinc-900">{bData.name}</strong> in <strong className="text-zinc-900">{locData.city}</strong>, orientation and latent heat management are critical. 
                            In Climate Zone {locData.climateZone}, the design grains of moisture ({locData.designGrains}) mean that your {bData.name.toLowerCase()}'s cooling system must be sized not just for temperature, but for aggressive dehumidification.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-12">
                        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                            <div className="text-blue-600 font-black text-xs uppercase tracking-widest mb-1">Energy Code</div>
                            <div className="text-zinc-900 text-lg font-black">IECC {locData.ieccVersion}</div>
                            <div className="text-xs text-zinc-400 font-medium">Local building standards</div>
                        </div>
                        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                            <div className="text-blue-600 font-black text-xs uppercase tracking-widest mb-1">Utility Rates</div>
                            <div className="text-zinc-900 text-lg font-black">${locData.avgUtilityRate}/kWh</div>
                            <div className="text-xs text-zinc-400 font-medium">Regional average</div>
                        </div>
                        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                            <div className="text-blue-600 font-black text-xs uppercase tracking-widest mb-1">Tax Credits</div>
                            <div className="text-zinc-900 text-lg font-black capitalize">{locData.rebateStatus} Availability</div>
                            <div className="text-xs text-zinc-400 font-medium">HEEHRA & local incentives</div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-8 text-center mb-12">
                        <Zap className="text-blue-500 mx-auto mb-4" size={32} />
                        <h3 className="text-2xl font-black text-white mb-2">Ready for a Precise Calculation?</h3>
                        <p className="text-zinc-400 mb-8 max-w-lg mx-auto font-medium">
                            Run a full ACCA-compliant block load specifically for your {locData.city} {bData.name.toLowerCase()} project.
                        </p>
                        <Link to={`/app?city=${city}&state=${state}&building=${building}`} className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20">
                            <Calculator size={20} />
                            Start Professional Analysis
                        </Link>
                    </div>

                    <div className="mb-12">
                        <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                            Because {bData.name.toLowerCase()} structures often feature {bData.typicalRWall >= 20 ? 'high-performance spray foam' : 'unique insulation profiles'} and a {bData.tightnessStr} envelope, 
                            using a standard "square footage per ton" rule in {locData.state} will almost certainly result in an oversized unit that short-cycles. 
                            Under IECC {locData.ieccVersion} standards, {locData.city} projects require rigorous Manual J load calculations to qualify for most local rebates.
                        </p>
                    </div>

                    <InternalSEOLinks currentPath={`/load-calculation/${locData.slug}/${bData.slug}`} />
                </div>
            </main>
        </>
    );
}
