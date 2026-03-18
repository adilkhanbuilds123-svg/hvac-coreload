import SEOHead from '../../components/SEOHead';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, FileText, ArrowRight, Zap, Target, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManualJCalculator() {
    return (
        <>
            <SEOHead
                title="Free Manual J Load Calculator | ACCA-Compliant HVAC Sizing"
                description="Stop guessing. Use our free, browser-based Manual J calculator to determine exact heating and cooling BTU requirements for your specific climate zone."
                path="/manual-j-calculator"
                breadcrumbs={[
                    { name: 'CoreLoad', url: 'https://coreload-hvac.vercel.app/' },
                    { name: 'Tools', url: 'https://coreload-hvac.vercel.app/' },
                    { name: 'Manual J Calculator', url: 'https://coreload-hvac.vercel.app/manual-j-calculator' }
                ]}
            />
            <Helmet>
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org",
                      "@type": "SoftwareApplication",
                      "name": "Manual J Load Calculator",
                      "url": "https://coreload-hvac.vercel.app/manual-j-calculator",
                      "description": "Determine exact heating and cooling BTU requirements for your specific climate zone.",
                      "applicationCategory": "UtilitiesApplication",
                      "operatingSystem": "Web",
                      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
                    }
                    `}
                </script>
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org",
                      "@type": "FAQPage",
                    `}
                </script>
            </Helmet>

            <main className="relative pt-28 pb-20 px-4 min-h-[80vh] bg-white">
                <div className="relative z-10 max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8 font-medium flex-wrap">
                        <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-zinc-900 font-bold">Manual J Calculator</span>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                            <ShieldCheck className="text-blue-600" size={24} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 tracking-tight break-words">
                            Manual J Load Calculator
                        </h1>
                    </div>

                    <p className="text-xl text-zinc-500 leading-relaxed mb-10 max-w-2xl font-medium">
                        The industry standard for residential HVAC sizing. Compute exact conductive, convective, and radiant heat transfer using ACCA methodologies.
                    </p>

                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 mb-12">
                        <h2 className="text-2xl font-black text-zinc-900 mb-4">Why Manual J Matters</h2>
                        <p className="text-zinc-600 mb-6 leading-relaxed font-medium">
                            For decades, contractors sized air conditioners using the "rule of thumb" (1 ton per 500 square feet). This is mathematically incorrect and leads to massive oversizing, higher energy bills, and poor humidity control.
                            <br /><br />
                            A proper <strong>Manual J calculation</strong> evaluates the entire building envelope:
                        </p>

                        <ul className="grid sm:grid-cols-2 gap-4 mb-8">
                            <li className="flex items-start gap-3">
                                <Target className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                                <span className="text-zinc-600 font-medium">Local 99% design temperatures</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Target className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                                <span className="text-zinc-600 font-medium">Wall and ceiling insulation R-values</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Target className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                                <span className="text-zinc-600 font-medium">Window U-values and Solar Heat Gain</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Target className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                                <span className="text-zinc-600 font-medium">Infiltration and blower door testing</span>
                            </li>
                        </ul>

                        <Link
                            to="/app"
                            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-black text-white text-lg font-black shadow-xl shadow-zinc-900/10 transition-all"
                        >
                            Launch Free Calculator
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Educational Content */}
                    <div className="max-w-none">
                        <h2 className="text-zinc-900 font-black text-2xl mb-4">How It Works</h2>
                        <p className="text-zinc-500 mb-6 font-medium">
                            Our free engine simplifies the complex Manual J math into a fast, intuitive block load calculation.
                        </p>

                        <div className="grid sm:grid-cols-3 gap-6 mt-8">
                            <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                                <Gauge className="text-blue-600 mb-4" size={28} />
                                <h3 className="text-zinc-900 font-black mb-2">1. Climate Data</h3>
                                <p className="text-sm text-zinc-500 font-medium">Pulls exact ASHRAE weather data for your specific US or Canadian city.</p>
                            </div>
                            <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                                <FileText className="text-blue-600 mb-4" size={28} />
                                <h3 className="text-zinc-900 font-black mb-2">2. Shell Design</h3>
                                <p className="text-sm text-zinc-500 font-medium">Calculates conductive thermal bleed through your walls and roof.</p>
                            </div>
                            <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                                <Zap className="text-blue-600 mb-4" size={28} />
                                <h3 className="text-zinc-900 font-black mb-2">3. Sensible Load</h3>
                                <p className="text-sm text-zinc-500 font-medium">Instantly outputs required BTU/hr and equivalent AC tonnage.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}
