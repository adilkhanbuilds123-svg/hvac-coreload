import { useParams, Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import NotFound from './NotFound';
import { comparisons } from '../../data/seo/comparisons';
import { SplitSquareHorizontal, Calculator, ChevronRight, Activity, Thermometer } from 'lucide-react';
import InternalSEOLinks from '../../components/InternalSEOLinks';

export default function EquipmentComparison() {
    const { comparison } = useParams();
    
    const compData = comparisons.find(c => c.slug === comparison);

    if (!compData) return <NotFound />;

    const btuDiff = compData.btu2 - compData.btu1;

    return (
        <>
            <SEOHead
                title={`${compData.size1} Ton vs ${compData.size2} Ton AC Unit Size Comparison`}
                description={`Should you install a ${compData.size1} ton or ${compData.size2} ton air conditioner? Compare BTU capacities, airflow CFM requirements, and sizing thresholds.`}
                path={`/compare/${compData.slug}`}
            />

            <main className="pt-24 pb-24 bg-white min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8 mt-8 flex-wrap">
                        <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <Link to="/html-sitemap" className="hover:text-zinc-900 transition-colors">Comparisons</Link>
                        <ChevronRight size={14} />
                        <span className="text-zinc-900 font-bold">{compData.size1} vs {compData.size2} Ton</span>
                    </div>

                    <header className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest mb-6 border border-emerald-100">
                            <SplitSquareHorizontal size={14} />
                            Capacity Boundary Analysis
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 mb-6 leading-tight tracking-tight break-words">
                            Which is Right?{' '}
                            <span className="text-emerald-600">{compData.size1} Ton</span> vs{' '}
                            <span className="text-emerald-600">{compData.size2} Ton</span> AC Unit
                        </h1>
                        <p className="text-lg text-zinc-500 leading-relaxed font-medium">
                            {compData.description} Understanding the exact {btuDiff.toLocaleString()} BTU difference is critical to preventing short-cycling.
                        </p>
                    </header>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-3 py-1.5 bg-zinc-200 text-[10px] font-black text-zinc-500 uppercase tracking-widest rounded-bl-xl">Smaller</div>
                            <div className="flex items-center gap-3 mb-6 mt-2">
                                <Thermometer className="text-blue-600" size={24} />
                                <h3 className="text-3xl font-black text-zinc-900">{compData.size1} Ton</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Capacity</div>
                                    <div className="text-2xl text-blue-600 font-mono font-black border-b border-zinc-200 pb-2 tabular-nums">{compData.btu1.toLocaleString()} BTUs</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Nominal Airflow</div>
                                    <div className="text-xl text-zinc-700 font-mono font-bold border-b border-zinc-200 pb-2 tabular-nums">~{(parseFloat(compData.size1) * 400)} CFM</div>
                                </div>
                                <div className="pt-2">
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Ideal For</div>
                                    <div className="text-sm text-zinc-500 font-medium">{compData.useCase1}</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 p-6 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 px-3 py-1.5 bg-emerald-100 text-[10px] font-black text-emerald-700 uppercase tracking-widest rounded-bl-xl">Larger</div>
                            <div className="flex items-center gap-3 mb-6 mt-2">
                                <Activity className="text-emerald-600" size={24} />
                                <h3 className="text-3xl font-black text-zinc-900">{compData.size2} Ton</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Capacity</div>
                                    <div className="text-2xl text-emerald-600 font-mono font-black border-b border-emerald-200 pb-2 tabular-nums">{compData.btu2.toLocaleString()} BTUs</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Nominal Airflow</div>
                                    <div className="text-xl text-zinc-700 font-mono font-bold border-b border-emerald-200 pb-2 tabular-nums">~{(parseFloat(compData.size2) * 400)} CFM</div>
                                </div>
                                <div className="pt-2">
                                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Ideal For</div>
                                    <div className="text-sm text-zinc-500 font-medium">{compData.useCase2}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-8 text-center mb-12">
                        <h3 className="text-2xl font-black text-white mb-4">Stop Guessing. Do the Math.</h3>
                        <p className="text-zinc-400 mb-8 max-w-2xl mx-auto font-medium">
                            The difference between a {compData.size1} ton and {compData.size2} ton system is exactly {btuDiff.toLocaleString()} BTUs. If your home's calculated Manual J boundary load is {(compData.btu1 + 1000).toLocaleString()} BTUs, sizing up might cause severe humidity issues. Run a free block load to find out exactly where you stand.
                        </p>
                        <Link to="/app" className="inline-flex items-center justify-center gap-2 py-4 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-600/20 text-lg">
                            <Calculator size={20} />
                            Calculate Exact Tonnage Required
                        </Link>
                    </div>

                    <InternalSEOLinks currentPath={`/compare/${compData.slug}`} />
                </div>
            </main>
        </>
    );
}
