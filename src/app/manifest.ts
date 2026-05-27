import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CoreLoad | HVAC Load Calculator',
    short_name: 'CoreLoad',
    description: 'Professional HVAC load calculation tool using ACCA Manual J block load methodology.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030303',
    theme_color: '#030303',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.png', // Next.js dynamic apple-icon.tsx outputs to /apple-icon.png
        sizes: '180x180',
        type: 'image/png',
      }
    ],
  };
}
