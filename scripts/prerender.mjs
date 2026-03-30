import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { preview } from 'vite';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const SITE_CONFIG = require('../src/lib/site-config.json');

// Define the routes and their specific metadata
const staticRoutes = [
    {
        path: '/',
        title: `${SITE_CONFIG.title} — Manual J`,
        description: SITE_CONFIG.description,
    },
    {
        path: '/manual-j-calculator',
        title: 'Free Manual J Load Calculator | ACCA-Compliant HVAC Sizing',
        description: 'Stop guessing. Use our free, browser-based Manual J calculator to determine exact heating and cooling BTU requirements for your specific climate zone.',
    },
    {
        path: '/btu-calculator',
        title: 'Free BTU Calculator — Heating & Cooling Load Estimator',
        description: 'Determine the exact BTUs required to heat and cool your residential project using our free Manual J inspired estimator.',
    },
    {
        path: '/hvac-tonnage-calculator',
        title: 'HVAC Tonnage Calculator — How Many Tons of AC Do I Need?',
        description: 'Easily calculate the proper AC tonnage size for your home. Free cooling load estimator factoring in climate class and home envelope details.',
    },
    {
        path: '/blog',
        title: `HVAC Engineering Blog | ${SITE_CONFIG.brand} Technical Articles`,
        description: 'Technical articles, guides, and tutorials on HVAC load calculations, ACCA Manual J, and building physics.',
    },
    {
        path: '/html-sitemap',
        title: `HTML Sitemap | ${SITE_CONFIG.brand} HVAC Calculators`,
        description: `A complete index of all HVAC load calculators, sizing tools, and technical engineering articles available on ${SITE_CONFIG.brand}.`,
    },
    {
        path: '/404',
        title: `Page Not Found | ${SITE_CONFIG.brand}`,
        description: 'The page you are looking for was not found. Try one of our free HVAC calculators instead.',
    }
];

// Dynamically discover blog posts
const blogDir = path.resolve('src/pages/blog');
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

const blogRoutes = blogFiles.map(file => {
    const slug = file.replace('.mdx', '');
    return {
        path: `/blog/${slug}`,
        title: `${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | ${SITE_CONFIG.brand} Blog`,
        description: `Read our latest article on ${slug.replace(/-/g, ' ')} and learn more about HVAC engineering at ${SITE_CONFIG.brand}.`,
    };
});

// A simple parser to extract our data from the TS files since we are running in plain Node .mjs
function extractArrayFromTS(filePath, arrayName) {
    const content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
    const match = content.match(new RegExp(`export const ${arrayName}(?:\\s*:[^=]+)?\\s*=\\s*([\\s\\S]*?);`));
    if (match && match[1]) {
        try {
            // Unsafe eval is fine here since it's our own static build script
            return eval(`(${match[1].trim()})`);
        } catch (e) {
            console.error(`Failed to parse ${arrayName}`, e);
            return [];
        }
    }
    return [];
}

const locations = extractArrayFromTS(path.resolve('src/data/seo/locations.ts'), 'locations');
const buildingTypes = extractArrayFromTS(path.resolve('src/data/seo/buildingTypes.ts'), 'buildingTypes');
const comparisons = extractArrayFromTS(path.resolve('src/data/seo/comparisons.ts'), 'comparisons');

const locationRoutes = locations.map(loc => ({
    path: `/load-calculation/${loc.slug}`,
    title: `HVAC Load Calculator & Sizing Guide for ${loc.city}, ${loc.state}`,
    description: `Exact Manual J design temperatures for ${loc.city}, ${loc.state}. Calculate your heating and cooling BTU requirements for Climate Zone ${loc.climateZone}.`
}));

// NEW: Combined Location + Building Type Routes (200 routes)
const combinedRoutes = [];
locations.forEach(loc => {
    buildingTypes.forEach(b => {
        combinedRoutes.push({
            path: `/load-calculation/${loc.slug}/${b.slug}`,
            title: `${b.name} HVAC Sizing in ${loc.city}, ${loc.state} | Manual J Guide`,
            description: `Calculate the heating & cooling load for a ${b.name} in ${loc.city}, ${loc.state}. Specific engineering data for Climate Zone ${loc.climateZone} and ${b.name} thermal envelopes.`
        });
    });
});

const buildingRoutes = buildingTypes.map(b => ({
    path: `/sizing/${b.slug}-hvac-sizing`,
    title: `${b.name} HVAC Sizing Guide & Load Calculator`,
    description: `How to calculate heating and cooling loads for a ${b.name}. Understand the physics and insulation impacts on your HVAC tonnage requirements.`
}));

const comparisonRoutes = comparisons.map(c => ({
    path: `/compare/${c.slug}`,
    title: `${c.size1} Ton vs ${c.size2} Ton AC Unit Size Comparison`,
    description: `Should you install a ${c.size1} ton or ${c.size2} ton air conditioner? Compare BTU capacities, airflow CFM requirements, and sizing thresholds.`
}));

const routes = [...staticRoutes, ...blogRoutes, ...locationRoutes, ...combinedRoutes, ...buildingRoutes, ...comparisonRoutes];
console.log(`Total Routes to Prerender: ${routes.length}`);

const distDir = path.resolve('dist');

async function runPrerender() {
    let server;
    try {
        // 1. Start a local preview server
        console.log('Starting preview server for prerendering...');
        server = await preview({ preview: { port: 4173 } });
        const localUrl = server.resolvedUrls.local[0];

        // 2. Launch Puppeteer
        console.log('Launching browser...');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Suppress console logs in the page
        page.on('console', () => {}); 

        for (const route of routes) {
            console.log(`Prerendering ${route.path}...`);
            // Go to the route and wait for the React app to render fully
            await page.goto(`${localUrl}${route.path.substring(1)}`, { waitUntil: 'networkidle0' });

            // We can also wait for a specific element to be sure React mounted
            try {
                // The main layout has some content, let's wait for #root to have children
                await page.waitForSelector('#root > *', { timeout: 10000 });
            } catch (e) {
                console.warn(`Warning: #root > * not found in time for ${route.path}`);
            }

            // Extract the full HTML
            let htmlContent = await page.content();

            // Inject the schema and OG tags
            const metaTags = `
    <link rel="canonical" href="${SITE_CONFIG.domain}${route.path === '/404' ? '' : route.path}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE_CONFIG.domain}${route.path === '/404' ? '' : route.path}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:image" content="${SITE_CONFIG.domain}${SITE_CONFIG.ogImage}" />
    <meta property="og:site_name" content="${SITE_CONFIG.brand}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    <meta name="twitter:image" content="${SITE_CONFIG.domain}${SITE_CONFIG.ogImage}" />
    <link rel="alternate" type="application/rss+xml" title="${SITE_CONFIG.brand} HVAC Blog RSS Feed" href="${SITE_CONFIG.rssFeed}" />`;

            let schemaTags = '';
            if (route.path.startsWith('/blog/')) {
                schemaTags = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${route.title.replace(/"/g, '\\"')}",
      "description": "${route.description.replace(/"/g, '\\"')}",
      "url": "${SITE_CONFIG.domain}${route.path}",
      "author": {
        "@type": "Organization",
        "name": "${SITE_CONFIG.author}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "${SITE_CONFIG.author}"
      }
    }
    </script>`;
            }

            // Append metadata just before </head>
            htmlContent = htmlContent.replace('</head>', `${metaTags}\n${schemaTags}\n</head>`);

            // Save the file
            if (route.path === '/404') {
                const outPath = path.join(distDir, '404.html');
                fs.writeFileSync(outPath, htmlContent, 'utf8');
                console.log(`Generated HTML for 404 (404.html)`);
            } else {
                const dirPath = path.join(distDir, ...route.path.split('/'));
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }
                const outPath = path.join(dirPath, 'index.html');
                fs.writeFileSync(outPath, htmlContent, 'utf8');
                console.log(`Generated HTML for ${route.path}`);
            }
        }

        await browser.close();
        server.httpServer.close();

        // Generate sitemap.xml (exclude /404)
        const today = new Date().toISOString().split('T')[0];
        let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        sitemapContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        for (const route of routes.filter(r => r.path !== '/404')) {
            let priority = '0.8';
            if (route.path === '/') priority = '1.0';
            else if (route.path.includes('/blog/')) priority = '0.7';

            let changefreq = 'weekly';
            if (route.path.includes('/blog/')) changefreq = 'monthly';

            sitemapContent += `  <url>\n`;
            sitemapContent += `    <loc>${SITE_CONFIG.domain}${route.path}</loc>\n`;
            sitemapContent += `    <lastmod>${today}</lastmod>\n`;
            sitemapContent += `    <changefreq>${changefreq}</changefreq>\n`;
            sitemapContent += `    <priority>${priority}</priority>\n`;
            sitemapContent += `  </url>\n`;
        }
        sitemapContent += `</urlset>`;

        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf8');
        console.log('Generated sitemap.xml');

        // Generate RSS Feed (feed.xml) for /blog/ articles
        const blogRoutes = routes.filter(r => r.path.startsWith('/blog/') && r.path !== '/blog');
        const pubDate = new Date().toUTCString();

        let rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${SITE_CONFIG.brand} HVAC Engineering Blog</title>
  <link>${SITE_CONFIG.domain}/blog</link>
  <description>${SITE_CONFIG.description}</description>
  <language>en-us</language>
  <pubDate>${pubDate}</pubDate>
  <lastBuildDate>${pubDate}</lastBuildDate>
  <atom:link href="${SITE_CONFIG.domain}${SITE_CONFIG.rssFeed}" rel="self" type="application/rss+xml" />
`;

        for (const route of blogRoutes) {
            rssContent += `  <item>
    <title>${route.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
    <link>${SITE_CONFIG.domain}${route.path}</link>
    <description>${route.description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</description>
    <guid isPermaLink="true">${SITE_CONFIG.domain}${route.path}</guid>
    <pubDate>${pubDate}</pubDate>
  </item>
`;
        }

        rssContent += `</channel>\n</rss>`;
        fs.writeFileSync(path.join(distDir, 'rss.xml'), rssContent, 'utf8');
        console.log('Generated rss.xml (RSS)');
        
        console.log('Prerendering completed successfully.');
        process.exit(0);

    } catch (err) {
        console.error('Failed to prerender HTML:', err);
        if (server) {
            try { server.httpServer.close(); } catch(e) {}
        }
        process.exit(1);
    }
}

runPrerender();
