import { useParams, Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import NotFound from './NotFound';
import { locations } from '../../data/seo/locations';
import { buildingTypes } from '../../data/seo/buildingTypes';
import { MapPin, Calculator, ChevronRight, ThermometerSun, ThermometerSnowflake, Droplets, Mountain } from 'lucide-react';
import InternalSEOLinks from '../../components/InternalSEOLinks';

export default function LocationSizing() {
    const { state, city } = useParams();
    
    const slug = `${state}/${city}`;
    const locData = locations.find(l => l.slug === slug);

    if (!locData) return <NotFound />;

    return (
        <>
            <SEOHead
                title={`HVAC Load Calculator & Sizing Guide for ${locData.city}, ${locData.state}`}
                description={`Exact Manual J design temperatures for ${locData.city}, ${locData.state}. Calculate your heating and cooling BTU requirements for Climate Zone ${locData.climateZone}.`}
                path={`/load-calculation/${locData.slug}`}
                breadcrumbs={[
                    { name: 'CoreLoad', url: 'https://coreload-hvac.vercel.app/' },
                    { name: 'Locations', url: 'https://coreload-hvac.vercel.app/html-sitemap' },
                    { name: locData.state, url: `https://coreload-hvac.vercel.app/load-calculation/${locData.state.toLowerCase()}` },
                    { name: locData.city, url: `https://coreload-hvac.vercel.app/load-calculation/${locData.slug}` }
                ]}
            />

            <main className="pt-24 pb-24 bg-white min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8 mt-8 flex-wrap">
                        <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <Link to="/html-sitemap" className="hover:text-zinc-900 transition-colors">Locations</Link>
                        <ChevronRight size={14} />
                        <span className="text-zinc-600 capitalize">{locData.state}</span>
                        <ChevronRight size={14} />
                        <span className="text-zinc-900 font-bold capitalize">{locData.city}</span>
                    </div>

                    <header className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-black uppercase tracking-widest mb-6 border border-zinc-200">
                            <MapPin size={14} />
                            Climate Zone {locData.climateZone}
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 mb-6 leading-tight tracking-tight break-words">
                            HVAC Load Sizing in{' '}
                            <span className="text-blue-600">
                                {locData.city}, {locData.state}
                            </span>
                        </h1>
                        <p className="text-lg text-zinc-500 leading-relaxed font-medium">
                            {locData.summerDesignTemp > 95 
                                ? `With scorching ${locData.summerDesignTemp}°F summer peaks, sizing an air conditioner in the ${locData.city} metropolitan area requires strict adherence to ASHRAE Manual J standards to prevent short-cycling.`
                                : `Do not guess your AC tonnage. Understand the exact ASHRAE design temperatures and engineering requirements for homes built in the ${locData.city} area.`}
                        </p>
                    </header>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-6 border-b border-zinc-200 pb-4">
                                99% Design Conditions
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl p-4 border border-zinc-100 shadow-sm">
                                    <div className="flex items-center gap-2 text-amber-600 mb-2">
                                        <ThermometerSun size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Summer</span>
                                    </div>
                                    <div className="text-3xl font-black text-zinc-900 tabular-nums">{locData.summerDesignTemp}°</div>
                                </div>
                                
                                <div className="bg-white rounded-xl p-4 border border-zinc-100 shadow-sm">
                                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                                        <ThermometerSnowflake size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Winter</span>
                                    </div>
                                    <div className="text-3xl font-black text-zinc-900 tabular-nums">{locData.winterDesignTemp}°</div>
                                </div>
                                
                                <div className="bg-white rounded-xl p-4 border border-zinc-100 shadow-sm">
                                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                        <Droplets size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Grains</span>
                                    </div>
                                    <div className="text-2xl font-black text-zinc-900 tabular-nums">{locData.designGrains}</div>
                                </div>
                                
                                <div className="bg-white rounded-xl p-4 border border-zinc-100 shadow-sm">
                                    <div className="flex items-center gap-2 text-zinc-500 mb-2">
                                        <Mountain size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Elevation</span>
                                    </div>
                                    <div className="text-2xl font-black text-zinc-900 tabular-nums">{locData.elevation}'</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-6 flex flex-col justify-center items-center text-center">
                            <Calculator className="text-blue-500 mb-4" size={32} />
                            <h3 className="text-xl font-black text-white mb-2">Run {locData.city} Block Load</h3>
                            <p className="text-sm text-zinc-400 mb-6 font-medium">
                                Input your home's square footage to instantly calculate heating & cooling BTUs using these exact local climate metrics.
                            </p>
                            <Link to={`/app?city=${city}&state=${state}`} className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-600/20">
                                Start Calculation
                            </Link>
                        </div>
                    </div>

                    {/* Editorial Depth: Local Challenge */}
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 mb-12">
                        <h2 className="text-xl font-black text-zinc-900 mb-4">Why {locData.city} Demands Accurate Sizing</h2>
                        <p className="text-zinc-600 leading-relaxed font-medium mb-6">
                            {locData.localChallenge}
                        </p>
                        
                        {locData.designGrains > 90 ? (
                            <div className="border-t border-zinc-200 pt-6">
                                <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-3">Critical Latent Load Warning</h3>
                                <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                                    At {locData.designGrains} design grains of moisture, your air conditioner must remove significant latent heat (humidity) from the air before it can begin dropping the sensible temperature. 
                                    If you install a unit that is a half-ton too large, it will satisfy the thermostat too quickly and shut off before removing the humidity, leaving your {locData.state} home feeling cold but clammy.
                                </p>
                            </div>
                        ) : locData.elevation > 3000 ? (
                            <div className="border-t border-zinc-200 pt-6">
                                <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-3">High Altitude Air Density Limit</h3>
                                <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                                    At an elevation of {locData.elevation.toLocaleString()} feet, the air in {locData.city} is significantly less dense than at sea level. This thin air carries less thermal energy, 
                                    drastically reducing the sensible cooling capacity of standard HVAC equipment. A 3-ton AC unit installed here will not deliver 36,000 BTUs; it calculates out to much less, requiring strict altitude de-rating in your Manual S selection.
                                </p>
                            </div>
                        ) : (
                            <div className="border-t border-zinc-200 pt-6">
                                <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-3">The Winter Heating Penalty</h3>
                                <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                                    With winter lows hitting {locData.winterDesignTemp}°F, heat pump selection is critical. Rather than arbitrarily selecting auxiliary heat strips, an accurate Manual J ensures your base equipment handles the thermal envelope load efficiently down to the balance point.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Cross-link to building types for this location */}
                    <div className="mb-12">
                        <h2 className="text-xl font-black text-zinc-900 mb-6">{locData.city} Sizing by Structure Type</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {buildingTypes.map(b => (
                                <Link
                                    key={b.slug}
                                    to={`/load-calculation/${locData.slug}/${b.slug}`}
                                    className="text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 font-bold p-3 rounded-xl border border-zinc-100 transition-all text-center"
                                >
                                    {b.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <InternalSEOLinks currentPath={`/load-calculation/${locData.slug}`} />
                </div>
            </main>
        </>
    );
}
