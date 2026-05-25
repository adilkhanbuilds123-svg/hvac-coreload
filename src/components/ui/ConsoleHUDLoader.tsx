'use client';

import { SkeletonLoaderHUD } from './Skeletons';

export function ConsoleHUDLoader() {
  return (
    <div className="w-full space-y-4 pb-24">
      {/* Desktop HUD Skeleton */}
      <div className="hidden md:grid grid-cols-4 gap-px bg-border-subtle rounded-lg shadow-lg shadow-black/40 ring-1 ring-zinc-800 mb-8 overflow-hidden h-[120px]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-zinc-950 p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent scan-line" />
            <div className="w-8 h-8 bg-zinc-900 rounded mb-3 animate-pulse" />
            <div className="w-24 h-8 bg-zinc-900 rounded mb-2 animate-pulse" />
            <div className="w-16 h-3 bg-zinc-900 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Step Navigation Rail Skeleton */}
      <div className="flex gap-1 border-b border-zinc-800/50 pb-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-28 bg-zinc-900/50 rounded-t animate-pulse border border-zinc-800/30" />
        ))}
      </div>

      {/* Main Layout Skeleton */}
      <div className="max-w-3xl mx-auto bg-zinc-950/60 rounded-lg overflow-hidden ring-1 ring-zinc-800 p-6 min-h-[500px] flex flex-col space-y-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/10 to-transparent scan-line" style={{ animationDuration: '3s' }} />
        
        <div>
          <div className="w-48 h-6 bg-zinc-900 rounded animate-pulse mb-2" />
          <div className="w-3/4 h-3 bg-zinc-900 rounded animate-pulse" />
        </div>
        
        <SkeletonLoaderHUD type="panel" />
        <SkeletonLoaderHUD type="panel" />
        
        <div className="mt-auto flex justify-between border-t border-zinc-800/50 pt-6">
          <div className="w-28 h-11 bg-zinc-900 rounded animate-pulse" />
          <div className="w-28 h-11 bg-zinc-900 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
