import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved HVAC Projects & Client Portfolio | CoreLoad',
  description: 'Manage and retrieve your precision HVAC load calculations. Securely store client data, design conditions, and engineering reports.',
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
