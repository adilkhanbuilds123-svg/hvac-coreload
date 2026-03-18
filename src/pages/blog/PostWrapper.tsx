import SEOHead from '../../components/SEOHead';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Flame, LineChart } from 'lucide-react';
import type { ReactNode } from 'react';

interface PostWrapperProps {
    children: ReactNode;
    title: string;
    description: string;
    path: string;
}

export default function PostWrapper({ children, title, description, path }: PostWrapperProps) {
    return (
        <>
            <SEOHead
                title={title}
                description={description}
                path={path}
            />

            <div className="relative pt-28 pb-24 px-4 min-h-[80vh]">
                <div className="relative z-10 max-w-3xl mx-auto">

                    <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-colors mb-10 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
                    </Link>

                    {/* The MDX Content renders inside this Tailwind Typography prose wrapper */}
                    <article className="prose prose-slate prose-lg prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-cyan-600 hover:prose-a:text-cyan-700 prose-img:rounded-xl max-w-none bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200">
                        {children}
                    </article>

                    {/* SEO Max Out - Funnel Link Equity to Calculators */}
                    <hr className="border-t border-slate-200 my-16" />

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Free HVAC Tools</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link to="/manual-j-calculator" className="group bg-slate-50 hover:bg-slate-100 border border-slate-200 p-5 rounded-xl transition-all">
                                <ShieldCheck className="text-cyan-600 mb-3" size={24} />
                                <h3 className="text-slate-900 font-bold mb-2 group-hover:text-cyan-700 transition-colors">Manual J Calculator</h3>
                                <p className="text-sm text-slate-600 mb-4 font-medium">Official ACCA-compliant method to perfectly size your AC and heating system.</p>
                                <span className="text-cyan-600 text-sm font-bold flex items-center gap-1">Open Tool <ArrowRight size={14} className="group-hover:-translate-x-[-4px] transition-transform" /></span>
                            </Link>

                            <Link to="/btu-calculator" className="group bg-slate-50 hover:bg-slate-100 border border-slate-200 p-5 rounded-xl transition-all">
                                <Flame className="text-amber-600 mb-3" size={24} />
                                <h3 className="text-slate-900 font-bold mb-2 group-hover:text-amber-700 transition-colors">BTU Load Calculator</h3>
                                <p className="text-sm text-slate-600 mb-4 font-medium">Compute exactly how many BTUs your home loses in winter and gains in summer.</p>
                                <span className="text-amber-600 text-sm font-bold flex items-center gap-1">Open Tool <ArrowRight size={14} className="group-hover:-translate-x-[-4px] transition-transform" /></span>
                            </Link>

                            <Link to="/hvac-tonnage-calculator" className="group bg-slate-50 hover:bg-slate-100 border border-slate-200 p-5 rounded-xl transition-all sm:col-span-2">
                                <LineChart className="text-indigo-600 mb-3" size={24} />
                                <h3 className="text-slate-900 font-bold mb-2 group-hover:text-indigo-700 transition-colors">Tonnage Calculator</h3>
                                <p className="text-sm text-slate-600 mb-4 font-medium">Determine the exact AC tonnage required for your square footage and climate zone.</p>
                                <span className="text-indigo-600 text-sm font-bold flex items-center gap-1">Open Tool <ArrowRight size={14} className="group-hover:-translate-x-[-4px] transition-transform" /></span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
