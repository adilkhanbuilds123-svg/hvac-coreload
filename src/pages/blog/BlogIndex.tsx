import SEOHead from '../../components/SEOHead';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../../lib/constants';

// Dynamically import all MDX posts
type MDXModule = { frontmatter: { title: string; description: string; date: string; category: string; readTime: string; } };
const mdxModules = import.meta.glob('./*.mdx', { eager: true }) as Record<string, MDXModule>;

const posts = Object.entries(mdxModules).map(([path, module]) => {
    const slug = path.replace('./', '').replace('.mdx', '');
    return {
        slug,
        ...module.frontmatter
    };
}).sort((a: { date: string }, b: { date: string }) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function BlogIndex() {
    return (
        <>
            <SEOHead
                title={`HVAC Engineering Blog | ${SITE_CONFIG.brand} Technical Articles`}
                description={SITE_CONFIG.description}
                path="/blog"
            />

            <div className="relative pt-28 pb-24 px-4 min-h-[80vh]">
                <div className="relative z-10 max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-100 border border-cyan-200 mb-6 shadow-sm">
                            <BookOpen className="text-cyan-600" size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            HVAC Engineering <span className="text-cyan-600">Blog</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                            Deep dives into building science, thermal load calculations, and best practices for residential HVAC sizing.
                        </p>
                    </div>

                    {/* Posts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => {
                            // Generate a gradient based on category
                            const gradients: Record<string, string> = {
                                'HVAC Engineering': 'from-blue-600 to-cyan-500',
                                'Building Science': 'from-emerald-600 to-teal-500',
                                'Energy Efficiency': 'from-amber-500 to-orange-500',
                                'Equipment': 'from-purple-600 to-indigo-500',
                            };
                            const gradient = gradients[post.category] || 'from-slate-600 to-slate-500';
                            
                            return (
                            <Link
                                key={post.slug}
                                to={`/blog/${post.slug}`}
                                className="group flex flex-col h-full bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md hover:border-cyan-300 transition-all duration-300"
                            >
                                {/* Visual header strip */}
                                <div className={`h-28 bg-gradient-to-br ${gradient} flex items-end p-5 relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]" style={{ backgroundSize: '16px 16px' }}></div>
                                    <span className="relative inline-block px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold tracking-wide uppercase">
                                        {post.category}
                                    </span>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors">
                                        {post.title}
                                    </h2>

                                    <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 font-medium">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium mt-auto pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {post.date}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                {post.readTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            );
                        })}
                    </div>

                </div>
            </div>
        </>
    );
}
