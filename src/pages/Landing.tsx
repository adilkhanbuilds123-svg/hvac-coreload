import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
    ShieldCheck, 
    Zap, 
    ArrowRight,
    MapPin
} from 'lucide-react';
import { CoreLoadLogo } from '../components/branding/CoreLoadLogo';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white text-slate-600 font-sans selection:bg-brand-blue/30 overflow-x-hidden">
            <Helmet>
                <title>CoreLoad | Precision HVAC Sizing — Free Manual J Calculator</title>
                <meta name="description" content="CoreLoad is the free, engineering-grade HVAC load calculator. Estimate heating and cooling BTU loads, AC tonnage, and infiltration rates using Manual J physics for residential buildings." />
            </Helmet>
            {/* Minimalist Pro Header */}
            <header className="fixed top-0 w-full z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <CoreLoadLogo className="h-9" variant="dark" />
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <Link to="/manual-j-calculator" className="hover:text-brand-blue transition-colors">AC Sizing</Link>
                        <Link to="/btu-calculator" className="hover:text-brand-blue transition-colors">Engineering</Link>
                        <Link to="/blog" className="hover:text-brand-blue transition-colors">Documentation</Link>
                    </nav>
                    <Link 
                        to="/app" 
                        className="px-5 py-2 rounded-full bg-brand-navy hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-xl"
                    >
                        Dashboard
                    </Link>
                </div>
            </header>

            {/* Hero Section: The "Swiss" SaaS Look */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-50">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-brand-blue/5 to-transparent pointer-events-none"></div>
                
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[11px] font-bold uppercase tracking-[0.1em] mb-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-amber"></span>
                            Engineering-Grade Block Load Analysis
                        </div>
                        
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-[1.1] max-w-4xl">
                            Precision Sizing <br className="hidden md:block" /> For Modern Builds.
                        </h1>
                        
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                            The professional alternative to "Rule of Thumb" sizing. Build-specific <strong className="text-slate-900">Manual J physics</strong> delivered in a high-performance web interface.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                            <Link 
                                to="/app" 
                                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-brand-blue text-white hover:bg-brand-blue border border-transparent font-bold text-lg transition-all shadow-2xl shadow-brand-blue/20 flex items-center justify-center gap-3 group"
                            >
                                Start Load Calculation
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link 
                                to="/blog" 
                                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white text-slate-700 hover:text-brand-navy hover:bg-slate-50 font-bold text-lg transition-all border border-slate-200 shadow-sm flex items-center justify-center"
                            >
                                Engineering Guides
                            </Link>
                        </div>
                    </div>
                </div>

                {/* The "Product Hub" Mockup */}
                <div className="max-w-6xl mx-auto px-6 mt-32 relative">
                    <div className="rounded-[2.5rem] border border-slate-200 bg-white p-4 shadow-[0_20px_100px_rgba(15,23,42,0.08)] relative overflow-hidden group">
                        <div className="aspect-[16/9] w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[1.5rem] border border-slate-700 overflow-hidden relative shadow-inner p-6 md:p-10">
                            {/* Real dashboard preview */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px' }}></div>
                            <div className="relative flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-4 md:mb-6">
                                    <CoreLoadLogo className="h-6" variant="light" showText={false} />
                                    <span className="text-white/80 font-bold text-sm">CoreLoad Dashboard</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3 md:gap-4 flex-1">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 md:p-5 flex flex-col">
                                        <span className="text-[9px] md:text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">Heating Load</span>
                                        <span className="text-xl md:text-3xl font-black text-white">48,200</span>
                                        <span className="text-[10px] text-white/40 mt-0.5">BTU/hr</span>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 md:p-5 flex flex-col">
                                        <span className="text-[9px] md:text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Cooling Load</span>
                                        <span className="text-xl md:text-3xl font-black text-white">36,800</span>
                                        <span className="text-[10px] text-white/40 mt-0.5">BTU/hr</span>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 md:p-5 flex flex-col">
                                        <span className="text-[9px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Recommended</span>
                                        <span className="text-xl md:text-3xl font-black text-white">3.0</span>
                                        <span className="text-[10px] text-white/40 mt-0.5">Tons AC</span>
                                    </div>
                                </div>
                                <div className="mt-3 md:mt-4 bg-white/5 border border-white/10 rounded-xl p-3 md:p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Envelope Analysis</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1 bg-blue-500/20 rounded-lg h-2"><div className="bg-blue-400 h-full rounded-lg" style={{ width: '72%' }}></div></div>
                                        <span className="text-[10px] text-white/50 font-bold">R-19 Walls</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section className="py-24 border-t border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="md:col-span-2 p-10 rounded-[2rem] bg-slate-50 border border-slate-200 flex flex-col justify-end min-h-[300px] group hover:bg-slate-100 transition-colors">
                            <Zap size={32} className="text-brand-amber mb-6" />
                            <h3 className="text-2xl font-bold text-brand-navy mb-2">Instant Convergence</h3>
                            <p className="text-slate-600 leading-relaxed font-medium">Whole-house block loads optimized for immediate equipment selection. No redundant inputs.</p>
                        </div>
                        <div className="p-10 rounded-[2rem] bg-slate-50 border border-slate-200 flex flex-col justify-end group hover:bg-slate-100 transition-colors">
                            <ShieldCheck size={32} className="text-emerald-600 mb-6" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Audit-Ready</h3>
                            <p className="text-slate-600 text-sm leading-relaxed font-medium">Transparent sensible and latent split reporting for local permits.</p>
                        </div>
                        <div className="p-10 rounded-[2rem] bg-slate-50 border border-slate-200 flex flex-col justify-end group hover:bg-slate-100 transition-colors">
                            <MapPin size={32} className="text-brand-blue mb-6" />
                            <h3 className="text-xl font-bold text-brand-navy mb-2">Geo-Specific</h3>
                            <p className="text-slate-600 text-sm leading-relaxed font-medium">ASHRAE Design data for 235+ United States municipalities built-in.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Browse by City — SEO Discovery */}
            <section className="py-20 border-t border-slate-200 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">Sizing Guides for Every Climate</h2>
                        <p className="text-slate-500 font-medium max-w-2xl mx-auto">Deep-dive engineering data for 120+ US cities. ASHRAE design temperatures, latent moisture grains, and equipment recommendations.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {[
                            { city: 'Houston', state: 'Texas', slug: 'texas/houston', zone: '2A' },
                            { city: 'Miami', state: 'Florida', slug: 'florida/miami', zone: '1A' },
                            { city: 'Phoenix', state: 'Arizona', slug: 'arizona/phoenix', zone: '2B' },
                            { city: 'Chicago', state: 'Illinois', slug: 'illinois/chicago', zone: '5A' },
                            { city: 'Denver', state: 'Colorado', slug: 'colorado/denver', zone: '5B' },
                            { city: 'Atlanta', state: 'Georgia', slug: 'georgia/atlanta', zone: '3A' },
                            { city: 'Dallas', state: 'Texas', slug: 'texas/dallas', zone: '3A' },
                            { city: 'Boston', state: 'Massachusetts', slug: 'massachusetts/boston', zone: '5A' },
                        ].map(loc => (
                            <Link 
                                key={loc.slug}
                                to={`/load-calculation/${loc.slug}`}
                                className="group flex flex-col p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/5 transition-all"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin size={14} className="text-brand-blue" />
                                    <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Zone {loc.zone}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-blue transition-colors">{loc.city}</h3>
                                <p className="text-xs text-slate-400 font-medium">{loc.state}</p>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center">
                        <Link 
                            to="/html-sitemap" 
                            className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-blue-700 transition-colors"
                        >
                            Browse all 120+ cities 
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 relative bg-brand-navy">
                <div className="max-w-4xl mx-auto px-6 text-center pt-16 pb-16">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tight leading-[1.1]">Architectural Accuracy. <br/> Modern Performance.</h2>
                    <Link 
                        to="/app" 
                        className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-brand-blue text-white hover:bg-blue-600 font-bold text-xl transition-all shadow-2xl shadow-brand-blue/20 active:scale-95 border border-transparent"
                    >
                        Launch Application
                    </Link>
                </div>
            </section>

            <footer className="py-12 border-t border-slate-800 bg-[#070b14]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-400 text-sm uppercase tracking-widest">CoreLoad v2.1</span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        Professional SaaS Engineering Suite © {new Date().getFullYear()}
                    </div>
                </div>
            </footer>
        </div>
    );
}
