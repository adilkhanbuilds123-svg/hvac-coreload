import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack is enabled via `next dev --turbopack` in the dev script
  
  // Path alias: @/ → src/
  // Already configured in tsconfig.json
  
  // Server-side packages that shouldn't be bundled for client
  serverExternalPackages: ['@react-pdf/renderer'],

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // Strict React mode
  reactStrictMode: true,

  // 301 redirects for legacy Vite SPA routes → new App Router routes
  async redirects() {
    // Dynamic city redirects: /blog/hvac-load-calculation-for-{city} → /calculator/{city}
    // /hvac-load-calculation-for-:slug → /calculator/:slug
    return [
      // Legacy app route
      {
        source: '/app',
        destination: '/calculator',
        permanent: true,
      },
      // Legacy blog city pages
      {
        source: '/blog/hvac-load-calculation-for-:slug',
        destination: '/calculator/:slug',
        permanent: true,
      },
      // Legacy hvac-load-calculation-for- pages
      {
        source: '/hvac-load-calculation-for-:slug',
        destination: '/calculator/:slug',
        permanent: true,
      },
      // Legacy SEO sizing pages
      {
        source: '/hvac-sizing/:slug',
        destination: '/calculator/:slug',
        permanent: true,
      },
      // Legacy SEO comparison pages
      {
        source: '/hvac-sizing-comparison/:slug',
        destination: '/calculator/:slug',
        permanent: true,
      },
      // Legacy standalone calculator pages
      {
        source: '/btu-calculator',
        destination: '/calculator',
        permanent: true,
      },
      {
        source: '/hvac-tonnage-calculator',
        destination: '/calculator',
        permanent: true,
      },
      {
        source: '/manual-j-calculator',
        destination: '/calculator',
        permanent: true,
      },
    ];
  },

  // Cache headers and SEO robots headers
  async headers() {
    const headersList = [
      {
        source: '/api/weather',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=43200',
          },
        ],
      },
    ];

    // Explicitly add X-Robots-Tag noindex for Vercel preview/dev environments
    if (process.env.VERCEL_ENV !== 'production') {
      headersList.push({
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      });
    }

    return headersList;
  },
};

export default nextConfig;
