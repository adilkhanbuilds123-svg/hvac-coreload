import type { Metadata } from 'next';
import Link from 'next/link';
import { articles } from '@/data/blog-articles';

export const metadata: Metadata = {
  title: 'Engineering Blog | CoreLoad',
  description: 'Technical articles on HVAC load calculations, Manual J methodology, equipment sizing, and building science.',
};

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
      <header className="border-b border-zinc-900 pb-12">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-zinc-100 tracking-tight leading-[0.9] mb-4">
          Engineering<br/>Reference
        </h1>
        <p className="text-zinc-500 font-body text-lg max-w-xl font-light">
          Deep-dive articles on HVAC load calculation methodology, building science, and equipment selection.
        </p>
      </header>

      <div className="flex flex-col">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group block py-10 border-b border-zinc-900 last:border-b-0"
          >
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12">
              
              {/* Meta block */}
              <div className="flex-shrink-0 md:w-32 flex flex-row md:flex-col gap-4 md:gap-1 text-xs font-mono uppercase tracking-widest text-zinc-500">
                <span className="text-zinc-400">{article.date}</span>
                <span>{article.readTime}</span>
              </div>

              {/* Title & Excerpt */}
              <div className="flex-1 space-y-3">
                <h2 className="font-display text-2xl md:text-4xl font-bold text-zinc-200 group-hover:text-white transition-colors leading-tight">
                  {article.title}
                </h2>
                <p className="text-zinc-500 font-body text-base max-w-2xl leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
