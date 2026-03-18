import fs from 'fs';
import path from 'path';

// Using ES module imports for the TypeScript data files since we run this via tsx
import { locations } from '../src/data/seo/locations.ts';
import { buildingTypes } from '../src/data/seo/buildingTypes.ts';
import { comparisons } from '../src/data/seo/comparisons.ts';
import siteConfig from '../src/lib/site-config.json' with { type: 'json' };

console.log('Generating sitemap.xml...');

// 1. Define static routes
const staticRoutes = [
    { path: '/' },
    { path: '/manual-j-calculator' },
    { path: '/btu-calculator' },
    { path: '/hvac-tonnage-calculator' },
    { path: '/blog' },
    { path: '/html-sitemap' }
];

// 2. Discover blog posts
const blogDir = path.resolve('src/pages/blog');
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));
const blogRoutes = blogFiles.map(file => ({
    path: `/blog/${file.replace('.mdx', '')}`
}));

// 3. Generate dynamics routes
const locationRoutes = locations.map(loc => ({
    path: `/load-calculation/${loc.slug}`
}));

const combinedRoutes = [];
locations.forEach(loc => {
    buildingTypes.forEach(b => {
        combinedRoutes.push({
            path: `/load-calculation/${loc.slug}/${b.slug}`
        });
    });
});

const buildingRoutes = buildingTypes.map(b => ({
    path: `/sizing/${b.slug}-hvac-sizing`
}));

const comparisonRoutes = comparisons.map(c => ({
    path: `/compare/${c.slug}`
}));

// Combine all routes
const routes = [
    ...staticRoutes, 
    ...blogRoutes, 
    ...locationRoutes, 
    ...combinedRoutes, 
    ...buildingRoutes, 
    ...comparisonRoutes
];

console.log(`Found ${routes.length} total routes.`);

// Generate the sitemap XML string
const today = new Date().toISOString().split('T')[0];
let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemapContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const route of routes) {
    let priority = '0.8';
    if (route.path === '/') priority = '1.0';
    else if (route.path.includes('/blog/')) priority = '0.7';

    let changefreq = 'weekly';
    if (route.path.includes('/blog/')) changefreq = 'monthly';

    sitemapContent += `  <url>\n`;
    sitemapContent += `    <loc>${siteConfig.domain}${route.path}</loc>\n`;
    sitemapContent += `    <lastmod>${today}</lastmod>\n`;
    sitemapContent += `    <changefreq>${changefreq}</changefreq>\n`;
    sitemapContent += `    <priority>${priority}</priority>\n`;
    sitemapContent += `  </url>\n`;
}
sitemapContent += `</urlset>`;

// Ensure dist directory exists
const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Write the file
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf8');
console.log(`Successfully generated dist/sitemap.xml with ${routes.length} URLs.`);
