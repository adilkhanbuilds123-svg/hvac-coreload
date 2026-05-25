import React from 'react';

export function StepHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-display font-bold text-zinc-200 uppercase tracking-wide">{title}</h2>
      <p className="text-xs text-zinc-500 mt-1">{description}</p>
    </div>
  );
}
