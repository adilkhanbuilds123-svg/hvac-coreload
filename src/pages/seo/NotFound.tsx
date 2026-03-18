import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Flame, LineChart, ArrowRight } from 'lucide-react';

export default function NotFound() {
    return (
        <>
            <SEOHead
                title="Page Not Found | CoreLoad"
                description="The page you are looking for was not found."
                path="/404"
            />
            <Helmet>
                <meta name="robots" content="noindex, follow" />
            </Helmet>

            <main className="relative pt-32 pb-24 px-4 min-h-[80vh] bg-slate-950 flex flex-col items-center justify-center">
                <div className="text-center mb-12">
                    <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 opacity-80">
                        404
                    </h1>
                    <h2 className="text-3xl font-bold text-white mb-4 shadow-sm">
                        Page Not Found
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto mb-8">
                        The URL you entered might be broken or the page may have moved.
                        Try one of our free HVAC calculators below instead.
                    </p>
                </div>

                <div className="w-full max-w-4xl bg-slate-900/50 rounded-2xl border border-white/5 p-8 shadow-2xl backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Popular Free Tools</h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Link to="/manual-j-calculator" className="group bg-slate-800/80 hover:bg-slate-800 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/20 border border-slate-700/50 p-6 rounded-xl transition-all flex flex-col items-center text-center">
                            <ShieldCheck className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={32} />
                            <h4 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors">Manual J Estimator</h4>
                            <p className="text-sm text-slate-400 mb-4 flex-grow">Calculate precise heating and cooling loads.</p>
                            <span className="text-blue-400 text-sm font-bold flex items-center gap-1">Open Tool <ArrowRight size={14} className="group-hover:-translate-x-[-4px] transition-transform" /></span>
                        </Link>

                        <Link to="/btu-calculator" className="group bg-slate-800/80 hover:bg-slate-800 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-900/20 border border-slate-700/50 p-6 rounded-xl transition-all flex flex-col items-center text-center">
                            <Flame className="text-amber-400 mb-4 group-hover:scale-110 transition-transform" size={32} />
                            <h4 className="text-white font-bold mb-2 group-hover:text-amber-400 transition-colors">BTU Calculator</h4>
                            <p className="text-sm text-slate-400 mb-4 flex-grow">Determine BTU losses for extreme weather.</p>
                            <span className="text-amber-400 text-sm font-bold flex items-center gap-1">Open Tool <ArrowRight size={14} className="group-hover:-translate-x-[-4px] transition-transform" /></span>
                        </Link>

                        <Link to="/hvac-tonnage-calculator" className="group bg-slate-800/80 hover:bg-slate-800 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-900/20 border border-slate-700/50 p-6 rounded-xl transition-all flex flex-col items-center text-center">
                            <LineChart className="text-indigo-400 mb-4 group-hover:scale-110 transition-transform" size={32} />
                            <h4 className="text-white font-bold mb-2 group-hover:text-indigo-400 transition-colors">Tonnage System Sizing</h4>
                            <p className="text-sm text-slate-400 mb-4 flex-grow">Convert heat loads directly into Air Conditioner tons.</p>
                            <span className="text-indigo-400 text-sm font-bold flex items-center gap-1">Open Tool <ArrowRight size={14} className="group-hover:-translate-x-[-4px] transition-transform" /></span>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
