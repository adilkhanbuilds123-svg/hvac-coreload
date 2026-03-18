/**
 * Static Sitemap Generator
 * Generates sitemap.xml for all ~246 unique URLs
 * Run after build: node scripts/generate-sitemap.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOMAIN = 'https://coreload-hvac.vercel.app';

// Mirror the data from the source files
const locations = [
    { slug: 'texas/austin' }, { slug: 'texas/dallas' }, { slug: 'texas/houston' },
    { slug: 'arizona/phoenix' }, { slug: 'arizona/tucson' },
    { slug: 'florida/miami' }, { slug: 'florida/orlando' }, { slug: 'florida/tampa' },
    { slug: 'nevada/las-vegas' }, { slug: 'colorado/denver' },
    { slug: 'georgia/atlanta' }, { slug: 'north-carolina/charlotte' },
    { slug: 'illinois/chicago' }, { slug: 'new-york/new-york-city' },
    { slug: 'california/los-angeles' }, { slug: 'california/sacramento' },
    { slug: 'washington/seattle' }, { slug: 'oregon/portland' },
    { slug: 'tennessee/nashville' }, { slug: 'ohio/columbus' }
];

const buildingTypes = [
    { slug: 'barndominium' }, { slug: 'spray-foam-attic' }, { slug: 'mid-century-modern' },
    { slug: 'passivhaus' }, { slug: 'historic-home' }, { slug: 'mobile-home' },
    { slug: 'log-cabin' }, { slug: 'shipping-container-home' }, { slug: 'new-construction' },
    { slug: 'a-frame-cabin' }
];

const comparisons = [
    '1-5-ton-vs-2-ton-ac', '2-ton-vs-2-5-ton-ac', '2-5-ton-vs-3-ton-ac',
    '3-ton-vs-3-5-ton-ac', '3-5-ton-vs-4-ton-ac', '4-ton-vs-5-ton-ac'
];

const blogPosts = ['how-to-size-ac', 'sensible-vs-latent-heat', 'understanding-seer2'];

function generateSitemap() {
    const today = new Date().toISOString().split('T')[0];
    const urls = [];

    // Static pages
    const staticPages = [
        { path: '/', priority: '1.0', changefreq: 'weekly' },
        { path: '/app', priority: '0.9', changefreq: 'weekly' },
        { path: '/manual-j-calculator', priority: '0.8', changefreq: 'monthly' },
        { path: '/hvac-tonnage-calculator', priority: '0.8', changefreq: 'monthly' },
        { path: '/btu-calculator', priority: '0.8', changefreq: 'monthly' },
        { path: '/blog', priority: '0.7', changefreq: 'weekly' },
        { path: '/html-sitemap', priority: '0.3', changefreq: 'monthly' },
    ];

    for (const page of staticPages) {
        urls.push(`  <url>
    <loc>${DOMAIN}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
    }

    // Blog posts
    for (const post of blogPosts) {
        urls.push(`  <url>
    <loc>${DOMAIN}/blog/${post}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
    }

    // Location pages
    for (const loc of locations) {
        urls.push(`  <url>
    <loc>${DOMAIN}/load-calculation/${loc.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }

    // Building type pages
    for (const b of buildingTypes) {
        urls.push(`  <url>
    <loc>${DOMAIN}/sizing/${b.slug}-hvac-sizing</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
    }

    // Combined pages (the big 200)
    for (const loc of locations) {
        for (const b of buildingTypes) {
            urls.push(`  <url>
    <loc>${DOMAIN}/load-calculation/${loc.slug}/${b.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`);
        }
    }

    // Comparison pages
    for (const comp of comparisons) {
        urls.push(`  <url>
    <loc>${DOMAIN}/compare/${comp}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    // Write to public/ so Vite serves it statically
    const outPath = path.resolve(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(outPath, xml, 'utf-8');
    console.log(`✅ Sitemap generated: ${urls.length} URLs → ${outPath}`);
}

generateSitemap();
