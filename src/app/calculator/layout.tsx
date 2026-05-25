import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ACCA Manual J Load Calculator | CoreLoad',
  description: 'Calculate precision residential HVAC loads using our dynamic block-load engine. Account for altitude density, duct loss physics, and exact solar heat gain.',
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
