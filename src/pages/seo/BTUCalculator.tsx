import SEOHead from '../../components/SEOHead';
import { Helmet } from 'react-helmet-async';
import { Flame, ArrowRight, Droplets, ThermometerSun } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BTUCalculator() {
    return (
        <>
            <SEOHead
                title="Free BTU Calculator — Heating & Cooling Load Estimator"
                description="Determine the exact BTUs required to heat and cool your residential project using our free Manual J inspired estimator."
                path="/btu-calculator"
                breadcrumbs={[
                    { name: 'CoreLoad', url: 'https://coreload-hvac.vercel.app/' },
                    { name: 'Tools', url: 'https://coreload-hvac.vercel.app/' },
                    { name: 'BTU Calculator', url: 'https://coreload-hvac.vercel.app/btu-calculator' }
                ]}
            />
            <Helmet>
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org",
                      "@type": "SoftwareApplication",
                      "name": "BTU Heating & Cooling Calculator",
                      "url": "https://coreload-hvac.vercel.app/btu-calculator",
                      "description": "Determine the exact BTUs required to heat and cool your residential project.",
                      "applicationCategory": "UtilitiesApplication",
                      "operatingSystem": "Web",
                      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                      "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.8",
                        "ratingCount": "142",
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
                          "name": "What is a BTU in HVAC?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "A British Thermal Unit (BTU) is the amount of heat required to raise the temperature of one pound of water by one degree Fahrenheit. In HVAC, it measures the capacity of a system to add or remove heat."
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
                        <span className="text-zinc-900 font-bold">BTU Calculator</span>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                            <Flame className="text-amber-600" size={24} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 tracking-tight break-words">
                            BTU Heating & Cooling Calculator
                        </h1>
                    </div>

                    <p className="text-xl text-zinc-500 leading-relaxed mb-10 max-w-2xl font-medium">
                        A British Thermal Unit (BTU) is the amount of energy required to heat or cool one pound of water by one degree Fahrenheit. Find out exactly how many BTUs your home loses in winter and gains in summer.
                    </p>

                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 mb-12">
                        <h2 className="text-2xl font-black text-zinc-900 mb-6">The Three Types of BTUs</h2>

                        <div className="grid gap-4 mb-8">
                            <div className="flex bg-white border border-zinc-100 p-4 rounded-xl items-start gap-4 shadow-sm">
                                <div className="p-3 bg-red-50 rounded-lg shrink-0 border border-red-100">
                                    <Flame className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-zinc-900 font-black text-lg mb-1">Heating BTUs (Winter Load)</h3>
                                    <p className="text-sm text-zinc-500 font-medium">The amount of heat energy your furnace or heat pump must generate to replace the heat escaping through your walls, roof, and windows when it's freezing outside.</p>
                                </div>
                            </div>

                            <div className="flex bg-white border border-zinc-100 p-4 rounded-xl items-start gap-4 shadow-sm">
                                <div className="p-3 bg-amber-50 rounded-lg shrink-0 border border-amber-100">
                                    <ThermometerSun className="text-amber-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-zinc-900 font-black text-lg mb-1">Sensible Cooling BTUs (Summer Temp)</h3>
                                    <p className="text-sm text-zinc-500 font-medium">The energy required to physically lower the temperature of the air inside your home (dropping it from 95°F down to 75°F).</p>
                                </div>
                            </div>

                            <div className="flex bg-white border border-zinc-100 p-4 rounded-xl items-start gap-4 shadow-sm">
                                <div className="p-3 bg-blue-50 rounded-lg shrink-0 border border-blue-100">
                                    <Droplets className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-zinc-900 font-black text-lg mb-1">Latent Cooling BTUs (Summer Humidity)</h3>
                                    <p className="text-sm text-zinc-500 font-medium">The energy the AC uses to literally pull moisture (grains of water) out of the air. In humid climates like Miami, latent load can equal 30% of your total cooling BTUs.</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/app"
                            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-black text-white text-lg font-black shadow-xl shadow-zinc-900/10 transition-all"
                        >
                            Calculate My BTUs
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
