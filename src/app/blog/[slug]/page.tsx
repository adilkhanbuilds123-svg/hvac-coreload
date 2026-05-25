import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { articles } from '@/data/blog-articles';
import { ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: 'Article Not Found | CoreLoad' };

  return {
    title: `${article.title} | CoreLoad Blog`,
    description: article.excerpt,
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) notFound();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 hover:text-cyan-cooling transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-3 h-3" />
        Back to Blog
      </Link>

      <article className="space-y-6">
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-600">{article.date}</span>
            <span className="text-xs font-mono text-zinc-700">{article.readTime} read</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-zinc-100 leading-tight">
            {article.title}
          </h1>
          <p className="text-zinc-500 font-body italic">{article.excerpt}</p>
        </header>

        <div className="border-t border-zinc-800/50 pt-6">
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-zinc-400 leading-relaxed mb-4 font-body">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {/* CTA to calculator */}
      <div className="bg-canvas-card border border-zinc-800/50 rounded-lg p-6 text-center space-y-3">
        <p className="text-sm text-zinc-500 font-body">
          Ready to calculate your building&#39;s actual load?
        </p>
        <Link
          href="/calculator"
          className="inline-block px-6 py-2.5 bg-cyan-cooling text-zinc-950 font-mono text-sm font-bold uppercase tracking-wider rounded hover:bg-cyan-400 transition-colors"
        >
          Launch Calculator
        </Link>
      </div>
    </div>
  );
}
