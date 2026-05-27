import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL 
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
      : 'https://coreload.app'
  ),
  title: 'CoreLoad | Free HVAC Load Calculator & ACCA Manual J Sizing',
  description:
    'Professional HVAC load calculation tool using ACCA Manual J block load methodology. Accurately size heating and cooling systems, heat pumps, and AC units for residential buildings.',
  keywords: ['HVAC load calculator', 'Manual J calculation', 'AC sizing', 'heat pump sizing', 'BTU calculator', 'residential HVAC'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CoreLoad | HVAC Load Calculator',
    description: 'Professional HVAC load calculation using ACCA Manual J methodology.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-canvas-primary text-zinc-400 antialiased min-h-screen font-body">
        <Navigation />
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
