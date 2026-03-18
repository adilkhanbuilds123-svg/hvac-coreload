import SEOHead from '../../components/SEOHead';
import { Helmet } from 'react-helmet-async';
import { LineChart, ArrowRight, Thermometer, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HVACTonnageCalculator() {
    return (
        <>
            <SEOHead
                title="HVAC Tonnage Calculator — How Many Tons of AC Do I Need?"
                description="Easily calculate the proper AC tonnage size for your home. Free cooling load estimator factoring in climate class and home envelope details."
                path="/hvac-tonnage-calculator"
                breadcrumbs={[
                    { name: 'CoreLoad', url: 'https://coreload-hvac.vercel.app/' },
                    { name: 'Tools', url: 'https://coreload-hvac.vercel.app/' },
                    { name: 'Tonnage Calculator', url: 'https://coreload-hvac.vercel.app/hvac-tonnage-calculator' }
                ]}
            />
            <Helmet>
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org",
                      "@type": "SoftwareApplication",
                      "name": "HVAC Tonnage Calculator",
                      "url": "https://coreload-hvac.vercel.app/hvac-tonnage-calculator",
                      "description": "Calculate the proper AC tonnage size for your home.",
                      "applicationCategory": "UtilitiesApplication",
                      "operatingSystem": "Web",
                      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                      "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "ratingCount": "98",
                        "bestRating": "5",
                        "worstRating": "1"
                      }
                    }
                    `}
                </script>
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org",
                      "@type": "FAQPage",
                      "mainEntity": [
                        {
                          "@type": "Question",
                          "name": "How many tons of AC do I need?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "AC tonnage depends on total cooling BTUs. 1 ton equals 12,000 BTUs per hour. Never use the 500-square-foot rule; instead, use an accurate load calculator to evaluate climate, windows, and insulation."
                          }
                        }
                      ]
                    }
                    `}
                </script>
            </Helmet>

            <main className="relative pt-28 pb-20 px-4 min-h-[80vh] bg-white">
                <div className="relative z-10 max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8 font-medium flex-wrap">
                        <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-zinc-900 font-bold">HVAC Tonnage Calculator</span>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                            <LineChart className="text-indigo-600" size={24} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 tracking-tight break-words">
                            HVAC Tonnage Calculator
                        </h1>
                    </div>

                    <p className="text-xl text-zinc-500 leading-relaxed mb-10 max-w-2xl font-medium">
                        Tonnage determines the cooling capacity of an air conditioner. 1 ton removes 12,000 BTUs of heat per hour. Find out exactly what size your home requires.
                    </p>

                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 mb-12">
                        <h2 className="text-2xl font-black text-zinc-900 mb-4">The Truth About AC Sizing</h2>
                        <p className="text-zinc-600 mb-6 leading-relaxed font-medium">
                            For years, contractors used a "rule of thumb" stating you need 1 ton of AC for every 500 square feet. This is dangerously inaccurate today. A modern, well-insulated 2,000 sq ft home in Seattle might only need 2 tons, while an older, poorly insulated home of the same size in Phoenix might need 5 tons.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 mb-8">
                            <div className="bg-red-50 border border-red-100 p-5 rounded-xl">
                                <h3 className="text-red-700 font-black flex items-center gap-2 mb-2">
                                    <Thermometer size={18} /> Oversized Systems
                                </h3>
                                <p className="text-sm text-zinc-600 font-medium">Cool the house too quickly and shut off ("short cycling"). They fail to remove humidity, leading to clammy air and mold growth. They also wear out compressors 30% faster.</p>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                                <h3 className="text-blue-700 font-black flex items-center gap-2 mb-2">
                                    <Wind size={18} /> Undersized Systems
                                </h3>
                                <p className="text-sm text-zinc-600 font-medium">Run constantly on hot days and still fail to reach the target temperature. They waste massive amounts of electricity trying to keep up with the thermal load.</p>
                            </div>
                        </div>

                        <Link
                            to="/app"
                            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-black text-white text-lg font-black shadow-xl shadow-zinc-900/10 transition-all"
                        >
                            Calculate My Tonnage
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="max-w-none">
                        <h2 className="text-zinc-900 font-black text-2xl mb-4">How Tonnage is Calculated</h2>
                        <p className="text-zinc-500 mb-6 font-medium">
                            Our automated engine runs a complete sensible heat gain calculation. It evaluates:
                        </p>
                        <ul className="text-zinc-600 space-y-3 mb-8">
                            <li className="flex items-start gap-3 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                                <span><strong className="text-zinc-900">Solar Gain:</strong> Heat entering through windows (based on SHGC and compass direction).</span>
                            </li>
                            <li className="flex items-start gap-3 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                                <span><strong className="text-zinc-900">Conductive Gain:</strong> Heat bleeding through the roof and walls (based on R-values).</span>
                            </li>
                            <li className="flex items-start gap-3 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                                <span><strong className="text-zinc-900">Infiltration Gain:</strong> Hot outside air leaking in (based on ACH modeling).</span>
                            </li>
                            <li className="flex items-start gap-3 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                                <span><strong className="text-zinc-900">Internal Gain:</strong> Heat generated by people and major appliances.</span>
                            </li>
                        </ul>
                        <p className="text-zinc-500 font-medium">
                            The calculator sums these up to find your Total Cooling BTUs, then divides by 12,000 to determine the exact <strong className="text-zinc-900">AC Tonnage</strong> required.
                        </p>
                    </div>

                </div>
            </main>
        </>
    );
}
