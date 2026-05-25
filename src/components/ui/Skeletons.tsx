export function SkeletonLoaderHUD({ type = 'card' }: { type?: 'viewport' | 'card' | 'panel' | 'slider' }) {
  if (type === 'viewport') {
    return (
      <div className="relative w-full h-full min-h-[300px] bg-zinc-950 border border-zinc-800/60 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs font-mono text-zinc-700 uppercase tracking-widest">
            Initializing viewport
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-cooling/30 to-transparent scan-line" />
        </div>
        <div className="absolute inset-0 border border-cyan-cooling/10 rounded-lg pulse-glow" />
      </div>
    );
  }

  if (type === 'panel') {
    return (
      <div className="space-y-3 p-4 bg-zinc-950 border border-zinc-800/60 rounded-lg">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="w-20 h-3 bg-zinc-900 rounded animate-pulse" />
            <div className="flex-1 h-3 bg-zinc-900 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'slider') {
    return (
      <div className="space-y-2 p-4">
        <div className="flex justify-between">
          <div className="w-16 h-3 bg-zinc-900 rounded animate-pulse" />
          <div className="w-10 h-3 bg-zinc-900 rounded animate-pulse" />
        </div>
        <div className="w-full h-1 bg-zinc-900 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800/60 rounded-lg p-4 animate-pulse">
      <div className="w-8 h-8 bg-zinc-900 rounded mb-3" />
      <div className="w-20 h-6 bg-zinc-900 rounded mb-2" />
      <div className="w-16 h-3 bg-zinc-900 rounded" />
    </div>
  );
}
