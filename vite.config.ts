import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'

// Custom plugin to generate RSS feed during Vite build so Vercel natively recognizes it
import fs from 'fs'
import path from 'path'
import SITE_CONFIG from './src/lib/site-config.json'

function generateRssFeed(): Plugin {
  return {
    name: 'generate-rss-feed',
    generateBundle() {
      const blogDir = path.resolve('src/pages/blog')
      const blogFiles = fs.existsSync(blogDir) ? fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx')) : []
      const pubDate = new Date().toUTCString()
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
`
      blogFiles.forEach(file => {
        const slug = file.replace('.mdx', '')
        const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        const description = `Read our latest article on ${slug.replace(/-/g, ' ')}`
        rssContent += `  <item>
    <title>${title}</title>
    <link>${SITE_CONFIG.domain}/blog/${slug}</link>
    <description>${description}</description>
    <guid isPermaLink="true">${SITE_CONFIG.domain}/blog/${slug}</guid>
    <pubDate>${pubDate}</pubDate>
  </item>\n`
      })
      rssContent += `</channel>\n</rss>`
      
      this.emitFile({
        type: 'asset',
        fileName: 'rss.xml',
        source: rssContent
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx() },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
    generateRssFeed(),
  ],
  server: {
    port: 3000,
  },
})
