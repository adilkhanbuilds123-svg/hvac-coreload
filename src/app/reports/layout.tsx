import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Physics Report | CoreLoad',
  description: 'View the final HVAC Manual J engineering report. Analyze sensible heat ratios, verify telemetry data, and export precise system tonnages.',
};

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
