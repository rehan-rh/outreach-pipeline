export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md skeleton" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 skeleton w-3/4 rounded" />
          <div className="h-2.5 skeleton w-1/2 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="flex gap-4 px-4 py-2">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 skeleton rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-2">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-3 skeleton rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 skeleton w-1/2 rounded" />
        <div className="w-4 h-4 rounded skeleton" />
      </div>
      <div className="h-6 skeleton w-1/3 rounded" />
    </div>
  );
}
