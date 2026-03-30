// Vercel Serverless Function: /api/rss
// Serves the RSS feed for the HVAC Engineering Blog
// This bypasses all static file routing issues on Vercel's CDN

export default function handler(req, res) {
  const siteConfig = {
    brand: 'CoreLoad',
    domain: 'https://coreload-hvac.vercel.app',
    description: 'Free online HVAC load calculator inspired by ACCA Manual J. Estimate heating and cooling BTU loads, AC tonnage sizing, and infiltration rates.',
  };

  // Blog posts matching src/pages/blog/*.mdx
  const blogPosts = [
    { slug: 'duct-losses-hidden-tax', title: 'Duct Losses: The Hidden Tax on Your HVAC System' },
    { slug: 'heat-pumps-at-altitude', title: 'Heat Pumps At Altitude: Sizing Challenges Above 5000 Feet' },
    { slug: 'how-to-size-ac', title: 'How To Size An AC Unit For Your Home' },
    { slug: 'manual-j-vs-rule-of-thumb', title: 'Manual J vs Rule Of Thumb: Why Accurate Load Calculations Matter' },
    { slug: 'sensible-vs-latent-heat', title: 'Sensible vs Latent Heat: Understanding Your HVAC Load Components' },
    { slug: 'understanding-seer2', title: 'Understanding SEER2: The New Efficiency Standard' },
    { slug: 'window-orientation-matters', title: 'Window Orientation Matters: Solar Heat Gain and HVAC Sizing' },
  ];

  const pubDate = new Date().toUTCString();
  
  let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${siteConfig.brand} HVAC Engineering Blog</title>
  <link>${siteConfig.domain}/blog</link>
  <description>${siteConfig.description}</description>
  <language>en-us</language>
  <pubDate>${pubDate}</pubDate>
  <lastBuildDate>${pubDate}</lastBuildDate>
  <atom:link href="${siteConfig.domain}/rss.xml" rel="self" type="application/rss+xml" />
`;

  for (const post of blogPosts) {
    rss += `  <item>
    <title>${post.title} | ${siteConfig.brand} Blog</title>
    <link>${siteConfig.domain}/blog/${post.slug}</link>
    <description>Read our latest article on ${post.slug.replace(/-/g, ' ')} and learn more about HVAC engineering at ${siteConfig.brand}.</description>
    <guid isPermaLink="true">${siteConfig.domain}/blog/${post.slug}</guid>
    <pubDate>${pubDate}</pubDate>
  </item>
`;
  }

  rss += `</channel>
</rss>`;

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(rss);
}
